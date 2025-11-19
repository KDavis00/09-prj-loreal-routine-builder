# Project 9: L'Oréal Routine Builder

L'Oréal is expanding what's possible with AI, and now your chatbot is getting smarter. This week, you'll upgrade it into a product-aware routine builder.

Users will be able to browse real L'Oréal brand products, select the ones they want, and generate a personalized routine using AI. They can also ask follow-up questions about their routine—just like chatting with a real advisor.

## ✨ Features Implemented

### Core Features

- ✅ **Product Selection**: Click on any product card to select or unselect it. Selected products are highlighted with a red border and checkmark.
- ✅ **Product Descriptions**: Click the "Info" button on any product to reveal its full description.
- ✅ **Persistent Storage**: Selected products are saved to localStorage and persist across page reloads.
- ✅ **Remove Products**: Remove individual products from your selection or clear all at once.
- ✅ **AI Routine Generation**: Click "Generate Routine" to get a personalized beauty routine based on your selected products.
- ✅ **Conversational Chat**: Ask follow-up questions about your routine, skincare, haircare, makeup, and more.
- ✅ **L'Oréal Branding**: Styled with L'Oréal's signature colors (#ff003b and #e3a535).

### Extra Credit Features

- ✅ **Product Search** (10 pts): Real-time search that filters products by name, brand, category, or keywords as you type.

## 🎨 Design Highlights

- **Brand Colors**: Red (#ff003b) and gold (#e3a535) throughout the interface
- **Smooth Animations**: Fade-in effects for messages, slide-in for selected chips
- **Hover Effects**: Cards lift and highlight on hover
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Visual Feedback**: Clear indicators for selected products, loading states, and interactions

## 🚀 Getting Started

### 1. Set Up Your Cloudflare Worker

Before you can use the AI features, you need to set up a Cloudflare Worker to securely handle OpenAI API requests:

1. Follow the detailed instructions in [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md)
2. Copy your worker URL
3. Update `script.js` with your worker URL (replace `YOUR_CLOUDFLARE_WORKER_URL` in two places)

### 2. Open the Application

1. Open `index.html` in a web browser, or
2. Use a local development server like Live Server in VS Code

### 3. Start Building Your Routine

1. **Browse Products**: Select a category from the dropdown or use the search bar
2. **Select Products**: Click on product cards to add them to your selection
3. **View Details**: Click the "Info" button to see full product descriptions
4. **Generate Routine**: Once you've selected products, click "Generate Routine"
5. **Chat Away**: Ask follow-up questions in the chatbox

## 📁 Project Structure

```
├── index.html              # Main HTML structure
├── style.css               # Styles with L'Oréal branding
├── script.js               # All JavaScript functionality
├── products.json           # Product data from L'Oréal brands
├── img/                    # Images folder
├── README.md               # This file
└── CLOUDFLARE_SETUP.md     # Cloudflare Worker setup guide
```

## 🔧 How It Works

### Product Selection

- Products are stored in an array when selected
- Selection state is saved to localStorage
- Visual feedback shows selected state with borders and checkmarks

### AI Integration

- Conversation history is maintained for context
- Selected products are sent as JSON to OpenAI via Cloudflare Worker
- AI generates personalized routines based on product data
- Follow-up questions maintain conversation context

### Search & Filter

- Real-time filtering as you type in the search box
- Searches across product name, brand, category, and description
- Works in combination with category filter

## 🌟 Future Enhancements

Want to take this project further? Consider adding:

- **Web Search Integration** (10 pts extra credit): Use a model that can search the web for current L'Oréal product info
- **Product Recommendations**: AI suggests complementary products
- **Save Routines**: Allow users to save and name their favorite routines
- **Share Functionality**: Generate shareable links to routines
- **Dark Mode**: Toggle between light and dark themes
- **Multi-language Support**: Translate interface and AI responses

## 🎓 Learning Outcomes

This project demonstrates:

- Working with external APIs (OpenAI)
- Managing application state
- Using localStorage for data persistence
- Event handling and DOM manipulation
- Responsive design principles
- Async/await patterns
- Array methods (filter, map, find, some)
- JSON data handling

## 📝 Notes

- No npm packages or Node SDKs are used
- All API requests use native `fetch()` with `async/await`
- Code includes beginner-friendly comments
- Uses modern JavaScript (const, let, template literals, arrow functions)

## 🙏 Credits

- Product data and images from L'Oréal brands
- Icons from Font Awesome
- Fonts from Google Fonts (Montserrat)

---

**Happy Building!** 💄✨
