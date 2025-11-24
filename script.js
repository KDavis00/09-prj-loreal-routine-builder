/*
 * L'ORÉAL SMART ROUTINE BUILDER
 *
 * This script handles all the functionality for the routine builder:
 * - Loading and displaying products from JSON
 * - Product selection and deselection
 * - Filtering by category and search
 * - Saving selections to localStorage
 * - Generating AI routines via OpenAI
 * - Conversational chat with AI
 *
 * ✅ CONFIGURED:
 * Cloudflare Worker URL: https://loreal2.kdavi136.workers.dev/
 *
 * See CLOUDFLARE_SETUP.md for setup details
 */

/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const productsContainer = document.getElementById("productsContainer");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineBtn = document.getElementById("generateRoutine");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

/* Store selected products and conversation history */
let selectedProducts = [];
let conversationHistory = [
  {
    role: "system",
    content:
      "You are a knowledgeable beauty and skincare advisor specializing in L'Oréal brand products. You help users create personalized beauty routines and answer questions about skincare, haircare, makeup, and fragrance. When discussing L'Oréal products or beauty trends, use web search to find current information, product availability, reviews, and the latest innovations. Always include citations and links when you reference current information. Provide clear, specific advice about product usage, application order, and timing (morning/evening). Be friendly, professional, and helpful. Keep responses concise but informative.",
  },
];
let allProducts = [];
let currentFilteredProducts = [];
let currentSearchTerm = "";
let currentCategory = "";

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category or search for products
  </div>
`;

/* ========================================
   PRODUCT DATA FUNCTIONS
   ======================================== */

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  allProducts = data.products;
  return allProducts;
}

/* Load selected products from localStorage on page load */
function loadSelectedProductsFromStorage() {
  const savedIds = localStorage.getItem("selectedProducts");
  if (savedIds) {
    const ids = JSON.parse(savedIds);
    /* Find the full product objects from our product data */
    selectedProducts = allProducts.filter((product) =>
      ids.includes(product.id)
    );
    updateSelectedProductsList();
  }
}

/* Save selected product IDs to localStorage */
function saveSelectedProductsToStorage() {
  const ids = selectedProducts.map((product) => product.id);
  localStorage.setItem("selectedProducts", JSON.stringify(ids));
}

/* Toggle product selection when card is clicked */
function toggleProductSelection(product) {
  const index = selectedProducts.findIndex((p) => p.id === product.id);

  if (index > -1) {
    /* Product is already selected, so remove it */
    selectedProducts.splice(index, 1);
  } else {
    /* Product is not selected, so add it */
    selectedProducts.push(product);
  }

  /* Update localStorage and UI */
  saveSelectedProductsToStorage();
  updateSelectedProductsList();
  /* Re-render products to update selected state */
  displayProducts(currentFilteredProducts);
}

/* Remove a product from selected list */
function removeProduct(productId) {
  selectedProducts = selectedProducts.filter((p) => p.id !== productId);
  saveSelectedProductsToStorage();
  updateSelectedProductsList();
  /* Re-render products to update selected state */
  displayProducts(currentFilteredProducts);
}

/* Clear all selected products */
function clearAllProducts() {
  selectedProducts = [];
  saveSelectedProductsToStorage();
  updateSelectedProductsList();
  displayProducts(currentFilteredProducts);
}

/* Update the selected products display section */
function updateSelectedProductsList() {
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = `
      <p class="no-products-message">No products selected yet</p>
    `;
    return;
  }

  selectedProductsList.innerHTML = selectedProducts
    .map(
      (product) => `
      <div class="selected-chip">
        <span>${product.name}</span>
        <button class="remove-chip" onclick="removeProduct(${product.id})" aria-label="Remove ${product.name}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `
    )
    .join("");

  /* Add a clear all button if there are selected products */
  if (selectedProducts.length > 0) {
    selectedProductsList.innerHTML += `
      <button class="clear-all-btn" onclick="clearAllProducts()">
        <i class="fa-solid fa-trash"></i> Clear All
      </button>
    `;
  }
}

/* Toggle description visibility for a product card */
function toggleDescription(event, productId) {
  event.stopPropagation(); /* Prevent card click from firing */
  const descElement = document.querySelector(
    `.product-description[data-id="${productId}"]`
  );
  descElement.classList.toggle("visible");
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  currentFilteredProducts = products;

  productsContainer.innerHTML = products
    .map((product) => {
      /* Check if this product is currently selected */
      const isSelected = selectedProducts.some((p) => p.id === product.id);

      return `
    <div class="product-card ${
      isSelected ? "selected" : ""
    }" onclick="toggleProductSelection(${JSON.stringify(product).replace(
        /"/g,
        "&quot;"
      )})">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
        <button class="toggle-description" onclick="toggleDescription(event, ${
          product.id
        })" aria-label="Show description">
          <i class="fa-solid fa-info-circle"></i> Info
        </button>
        <div class="product-description" data-id="${product.id}">
          <p>${product.description}</p>
        </div>
      </div>
    </div>
  `;
    })
    .join("");
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  if (allProducts.length === 0) {
    allProducts = await loadProducts();
    loadSelectedProductsFromStorage();
  }

  currentCategory = e.target.value;
  applyFilters();
});

/* Filter products by search term in real-time */
productSearch.addEventListener("input", async (e) => {
  if (allProducts.length === 0) {
    allProducts = await loadProducts();
    loadSelectedProductsFromStorage();
  }

  currentSearchTerm = e.target.value.toLowerCase().trim();
  applyFilters();
});

/* Apply both category and search filters */
function applyFilters() {
  let filteredProducts = allProducts;

  /* Apply category filter if a category is selected */
  if (currentCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === currentCategory
    );
  }

  /* Apply search filter if there's a search term */
  if (currentSearchTerm) {
    filteredProducts = filteredProducts.filter((product) => {
      /* Search in product name, brand, category, and description */
      return (
        product.name.toLowerCase().includes(currentSearchTerm) ||
        product.brand.toLowerCase().includes(currentSearchTerm) ||
        product.category.toLowerCase().includes(currentSearchTerm) ||
        product.description.toLowerCase().includes(currentSearchTerm)
      );
    });
  }

  /* If no filters are applied, show the placeholder */
  if (!currentCategory && !currentSearchTerm) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        Select a category or search for products
      </div>
    `;
    return;
  }

  /* If filters are applied but no products match, show a message */
  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">
        No products found. Try a different search or category.
      </div>
    `;
    return;
  }

  displayProducts(filteredProducts);
}

/* Add a message to the chat window */
function addMessageToChat(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}`;

  /* Format the message text to preserve line breaks and make links clickable */
  let formattedMessage = message.replace(/\n/g, "<br>");

  /* Convert URLs to clickable links */
  formattedMessage = formattedMessage.replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>'
  );

  messageDiv.innerHTML = `
    <div class="message-content">
      ${formattedMessage}
    </div>
  `;

  chatWindow.appendChild(messageDiv);
  /* Scroll to bottom of chat */
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Generate a personalized routine using OpenAI */
async function generateRoutine() {
  /* Check if user has selected products */
  if (selectedProducts.length === 0) {
    addMessageToChat(
      "Please select at least one product to generate a routine.",
      "assistant"
    );
    return;
  }

  /* Show animated thinking bubbles */
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "chat-message assistant thinking";
  thinkingDiv.innerHTML = `
    <div class="message-content">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatWindow.appendChild(thinkingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  /* Prepare the product data to send to OpenAI */
  const productData = selectedProducts.map((p) => ({
    name: p.name,
    brand: p.brand,
    category: p.category,
    description: p.description,
  }));

  /* Create the prompt for OpenAI */
  const prompt = `You are a beauty and skincare expert. Based on the following products, create a personalized routine that explains how to use each product, in what order, and when (morning/evening). Be specific and helpful.

Products:
${JSON.stringify(productData, null, 2)}

Please provide a clear, step-by-step routine.`;

  /* Add user's request to conversation history */
  conversationHistory.push({
    role: "user",
    content: prompt,
  });

  try {
    /* Call OpenAI API through Cloudflare Worker */
    const response = await fetch("https://loreal2.kdavi136.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversationHistory,
      }),
    });

    const data = await response.json();

    /* Get the AI's response */
    const aiResponse = data.choices[0].message.content;

    /* Add AI response to conversation history */
    conversationHistory.push({
      role: "assistant",
      content: aiResponse,
    });

    /* Remove thinking bubbles and show the routine */
    const thinkingMsg = chatWindow.querySelector(".thinking");
    if (thinkingMsg) thinkingMsg.remove();
    addMessageToChat(aiResponse, "assistant");
  } catch (error) {
    console.error("Error generating routine:", error);
    const thinkingMsg = chatWindow.querySelector(".thinking");
    if (thinkingMsg) thinkingMsg.remove();
    addMessageToChat(
      "Sorry, there was an error generating your routine. Please make sure your Cloudflare Worker URL is set up correctly.",
      "assistant"
    );
  }
}

/* Handle Generate Routine button click */
generateRoutineBtn.addEventListener("click", generateRoutine);

/* Chat form submission handler for follow-up questions */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  /* Display user's message in chat */
  addMessageToChat(userMessage, "user");

  /* Clear input field */
  userInput.value = "";

  /* Add user message to conversation history */
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  /* Show animated thinking bubbles */
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "chat-message assistant thinking";
  thinkingDiv.innerHTML = `
    <div class="message-content">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatWindow.appendChild(thinkingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    /* Call OpenAI API through Cloudflare Worker */
    const response = await fetch("https://loreal2.kdavi136.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: conversationHistory,
      }),
    });

    const data = await response.json();

    /* Get the AI's response */
    const aiResponse = data.choices[0].message.content;

    /* Add AI response to conversation history */
    conversationHistory.push({
      role: "assistant",
      content: aiResponse,
    });

    /* Remove thinking bubbles and show response */
    const thinkingMsg = chatWindow.querySelector(".thinking");
    if (thinkingMsg) thinkingMsg.remove();
    addMessageToChat(aiResponse, "assistant");
  } catch (error) {
    console.error("Error:", error);
    const thinkingMsg = chatWindow.querySelector(".thinking");
    if (thinkingMsg) thinkingMsg.remove();
    addMessageToChat(
      "Sorry, there was an error processing your request. Please check your Cloudflare Worker setup.",
      "assistant"
    );
  }
});

/* Initialize the app when page loads */
window.addEventListener("DOMContentLoaded", async () => {
  allProducts = await loadProducts();
  loadSelectedProductsFromStorage();
});
