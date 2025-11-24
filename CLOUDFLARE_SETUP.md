# Cloudflare Worker Setup Guide

This guide will help you set up a Cloudflare Worker to securely handle OpenAI API requests for your L'Oréal Routine Builder project.

## Why Use a Cloudflare Worker?

A Cloudflare Worker acts as a secure proxy between your frontend application and the OpenAI API. This keeps your API key safe and hidden from users who might inspect your website's code.

## Step 1: Create a Cloudflare Account

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create a New Worker

1. Log in to your Cloudflare dashboard
2. Click on "Workers & Pages" in the left sidebar
3. Click "Create Application"
4. Click "Create Worker"
5. Give your worker a name (e.g., `loreal-ai-proxy`)
6. Click "Deploy"

## Step 3: Add Your Worker Code

Copy and paste this code into your worker editor:

```javascript
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Add CORS headers to allow requests from your frontend
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests after handling OPTIONS
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get the request body from your frontend
    const body = await request.json();

    // Make request to OpenAI API with web search enabled
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY_HERE`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: body.messages,
          temperature: 0.7,
          max_tokens: 1500,
          // Enable web search with the prediction tool
          tools: [
            {
              type: "web_search_preview",
            },
          ],
        }),
      }
    );

    // Get the response from OpenAI
    const data = await openaiResponse.json();

    // Return the response to your frontend with CORS headers
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}
```

## Step 4: Add Your OpenAI API Key

1. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key
2. **Important**: Keep this key secret! Never share it or commit it to Git
3. Get your API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Step 5: Deploy Your Worker

1. Click "Save and Deploy" in the worker editor
2. Copy the worker URL (it will look like: `https://loreal-ai-proxy.your-subdomain.workers.dev`)

## Step 6: Update Your Frontend Code

In your `script.js` file, replace `YOUR_CLOUDFLARE_WORKER_URL` with your actual worker URL:

```javascript
// Find these two places in script.js and update the URL:

// In the generateRoutine() function:
const response = await fetch(
  "https://loreal-ai-proxy.your-subdomain.workers.dev",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: conversationHistory,
    }),
  }
);

// In the chatForm submit handler:
const response = await fetch(
  "https://loreal-ai-proxy.your-subdomain.workers.dev",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: conversationHistory,
    }),
  }
);
```

## Step 7: Test Your Setup

1. Open your L'Oréal Routine Builder in a browser
2. Select some products
3. Click "Generate Routine"
4. You should see an AI-generated routine appear in the chat window
5. Try asking follow-up questions in the chat

## Troubleshooting

### Error: "Failed to process request"

- Check that your OpenAI API key is correct
- Make sure you have credits in your OpenAI account
- Check the Cloudflare Worker logs for detailed error messages

### Error: CORS issues

- Make sure the CORS headers are set correctly in your worker
- Check that you're using POST requests from your frontend

### Worker not responding

- Check that the worker URL is correct in your `script.js`
- Make sure the worker is deployed and active in Cloudflare dashboard
- Test the worker directly using a tool like Postman

## Advanced: Using Environment Variables (Recommended)

For better security, use Cloudflare's environment variables instead of hardcoding your API key:

1. In your Cloudflare Worker dashboard, go to Settings → Variables
2. Add a new environment variable:
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
   - Click "Encrypt" to make it a secret
3. Update your worker code to use the environment variable:

```javascript
'Authorization': `Bearer ${OPENAI_API_KEY}`
```

This way, your API key is never visible in the code!

## Need Help?

- Cloudflare Workers Docs: [https://developers.cloudflare.com/workers/](https://developers.cloudflare.com/workers/)
- OpenAI API Docs: [https://platform.openai.com/docs](https://platform.openai.com/docs)
