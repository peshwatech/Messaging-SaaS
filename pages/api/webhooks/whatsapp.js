// File Location: /pages/api/webhooks/whatsapp.js

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
        // --- START OF DEBUGGING CHANGE ---
        // Respond with a detailed error message, including the token the server is using.
        // This helps debug without relying on delayed logs.
        const errorMessage = `Verification failed. The token sent by Meta ("${token}") does not match the token on the server ("${verifyToken || 'not set'}").`;
        console.error(errorMessage);
        res.status(403).send(errorMessage);
        // --- END OF DEBUGGING CHANGE ---
      }
    } else {
      // Respond with '400 Bad Request' if mode or token is missing
      console.error('Webhook verification failed: Missing mode or token.');
      res.status(400).end();
    }
  }

  // --- Handle Incoming Messages ---
  if (req.method === 'POST') {
    console.log('Handling incoming message or status update...');
    const body = req.body;
    console.log(JSON.stringify(body, null, 2));
    res.status(200).send('EVENT_RECEIVED');
  }
}
