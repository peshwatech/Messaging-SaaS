// File Location: /pages/api/webhooks/whatsapp.js

// This is the primary webhook endpoint for receiving all events from the WhatsApp Cloud API.
export default function handler(req, res) {
  // --- Webhook Verification ---
  if (req.method === 'GET') {
    const serverToken = process.env.WHATSAPP_VERIFY_TOKEN;

    // --- AGGRESSIVE DEBUGGING ---
    // This will immediately stop the code and send back the token value.
    // This allows us to see what the server is reading without relying on logs.
    const debugMessage = `Server's verify token is: "${serverToken || 'UNDEFINED'}"`;
    res.status(418).send(debugMessage); // Using an unusual status code to be sure it's our new code.
    return; // Stop further execution
    // --- END OF DEBUGGING ---

    // The code below will not be reached while debugging is active.
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === serverToken) {
        console.log('Webhook verified successfully!');
        res.status(200).send(challenge);
      } else {
        const errorMessage = `Verification failed. Meta token ("${token}") != Server token ("${serverToken}").`;
        console.error(errorMessage);
        res.status(403).send(errorMessage);
      }
    } else {
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
