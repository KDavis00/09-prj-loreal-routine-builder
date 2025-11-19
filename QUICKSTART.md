# Quick Start Guide

## 🚀 Get Your App Running in 5 Minutes

### Step 1: Open the App

Just open `index.html` in your web browser (or use Live Server in VS Code)

### Step 2: Try the Features WITHOUT AI First

You can test most features without setting up the AI:

1. ✅ **Select a category** from the dropdown
2. ✅ **Click on products** to select/unselect them
3. ✅ **Click the Info button** to see product descriptions
4. ✅ **Use the search bar** to find specific products
5. ✅ **Remove products** from your selection
6. ✅ **Reload the page** - your selections will still be there!

### Step 3: Set Up AI (Cloudflare Worker)

To enable the "Generate Routine" button and chatbot:

1. 📖 Read the full guide: [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md)
2. 🔑 Create a Cloudflare Worker with your OpenAI API key
3. 🔗 Copy your Worker URL
4. ✏️ In `script.js`, find `YOUR_CLOUDFLARE_WORKER_URL` (appears 2 times)
5. 📝 Replace it with your actual Worker URL

**Example:**

```javascript
// Before:
const response = await fetch("YOUR_CLOUDFLARE_WORKER_URL", {

// After:
const response = await fetch("https://loreal-ai-proxy.your-name.workers.dev", {
```

### Step 4: Test the AI Features

1. Select some products
2. Click "Generate Routine"
3. Watch the AI create a personalized routine!
4. Ask follow-up questions in the chat

---

## 🎯 Key Features to Show Off

### 1. Product Selection

- Click any product card to select it
- Selected products get a red border and checkmark ✓
- They appear as chips in the "Selected Products" section

### 2. Product Info

- Click the gold "Info" button on any product
- The description expands below
- Click again to collapse it

### 3. Search

- Type in the search box at the top
- Products filter in real-time as you type
- Search works on name, brand, category, and description

### 4. Persistent Storage

- Select some products
- Refresh the page
- Your selections are still there! (thanks to localStorage)

### 5. AI Routine Generation

- Select products from different categories (cleanser, moisturizer, etc.)
- Click "Generate Routine"
- Get a step-by-step routine with morning/evening recommendations

### 6. Conversational AI

- After generating a routine, ask questions like:
  - "Can I use these products together?"
  - "What order should I apply these in?"
  - "Is this routine good for dry skin?"
  - "Can I skip any steps?"

---

## 🎨 Customization Ideas

Want to make it your own? Try:

### Easy Changes

- Change the brand colors in `style.css` (search for `#ff003b` and `#e3a535`)
- Add your own logo to `img/` folder
- Modify the chat window height
- Change the product card layout

### Medium Changes

- Add filters for skin type or concerns
- Create favorite/saved routines
- Add product ratings
- Include product prices

### Advanced Changes

- Add authentication so users can save their data
- Create a comparison mode to compare products
- Add a "share routine" feature
- Integrate with a real product database

---

## ❓ Troubleshooting

### "No products showing"

- Make sure you selected a category OR typed in the search box
- Check the browser console for errors (F12)

### "Generate Routine doesn't work"

- Did you set up your Cloudflare Worker?
- Did you replace `YOUR_CLOUDFLARE_WORKER_URL` in script.js?
- Check the browser console for error messages
- Make sure you have OpenAI API credits

### "Selected products disappear after refresh"

- Check if localStorage is enabled in your browser
- Try in a different browser
- Check for JavaScript errors in console

### "Search doesn't work"

- Make sure you're typing in the search box, not the category dropdown
- Try different keywords
- Check browser console for errors

---

## 📚 Learning Resources

### JavaScript Concepts Used

- `async/await` - For API calls
- `fetch()` - To get data from APIs
- `localStorage` - To save data in the browser
- `.filter()` - To filter arrays
- `.map()` - To transform arrays
- `.find()` - To find items in arrays
- Template literals - For HTML strings
- Event listeners - For user interactions

### APIs Used

- OpenAI Chat Completions API (via Cloudflare Worker)
- Local Fetch API (for products.json)

### Design Patterns

- DOM manipulation
- State management
- Event-driven programming
- Separation of concerns

---

## 🎓 Next Steps

Once you have this working, you can:

1. ✅ Complete the extra credit features
2. 🎨 Customize the design to match your style
3. 📱 Test on mobile devices
4. 🚀 Deploy to GitHub Pages or Netlify
5. 💼 Add it to your portfolio!

---

**Need help?** Check the detailed guides:

- [`CLOUDFLARE_SETUP.md`](./CLOUDFLARE_SETUP.md) - For Cloudflare Worker setup
- [`README.md`](./README.md) - For full project documentation

Happy coding! 💄✨
