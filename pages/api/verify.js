// File Location: /pages/api/verify.js

// This is the primary webhook endpoint for receiving all events from the WhatsApp Cloud API.
export default function handler(req, res) {
  // Log the request method and query for debugging
  console.log(`Received a ${req.method} request.`);

  // --- Webhook Verification ---
  // The WhatsApp API sends a GET request to verify your webhook endpoint.
  if (req.method === 'GET') {
    console.log('Handling webhook verification...');
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Check if a token and mode are in the query string of the request
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === 'subscribe' && token === verifyToken) {
        // Respond with the challenge token from the request
        console.log('Webhook verified successfully!');
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        console.error('Webhook verification failed: Tokens do not match.');
        // FIX: Use .status().end() instead of .sendStatus()
        res.status(403).end();
      }
    } else {
      // Respond with '400 Bad Request' if mode or token is missing
      console.error('Webhook verification failed: Missing mode or token.');
      // FIX: Use .status().end() instead of .sendStatus()
      res.status(400).end();
    }
  }

  // --- Handle Incoming Messages ---
  // The WhatsApp API sends a POST request when a message is received or a status changes.
  if (req.method === 'POST') {
    console.log('Handling incoming message or status update...');
    const body = req.body;

    // Log the entire request body to see the structure of the incoming data.
    // In a production app, you would parse this body and save the relevant data
    // to your Firestore database.
    console.log(JSON.stringify(body, null, 2));

    // You must respond with a 200 OK status to let Meta know you've received the event.
    // If you don't, they will keep resending the webhook.
    res.status(200).send('EVENT_RECEIVED');
  }
}
