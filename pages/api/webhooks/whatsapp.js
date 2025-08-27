// File Location: /pages/api/webhooks/whatsapp.js

// This is the primary webhook endpoint for receiving all events from the WhatsApp Cloud API.
export default function handler(req, res) {
  // --- Webhook Verification ---
  if (req.method === 'GET') {
    
    // --- FINAL DEBUGGING STEP ---
    // This code ignores the verify token and simply sends back the challenge.
    // This will help us determine if the connection from Meta to Vercel is working at all.
    const challenge = req.query['hub.challenge'];
    if (challenge) {
      console.log("Received a challenge. Responding directly.");
      res.status(200).send(challenge);
      return;
    }
    // --- END OF DEBUGGING STEP ---

    // If there's no challenge, it's a bad request.
    res.status(400).send("No challenge token found.");
  }

  // --- Handle Incoming Messages ---
  if (req.method === 'POST') {
    console.log('Handling incoming message or status update...');
    const body = req.body;
    console.log(JSON.stringify(body, null, 2));
    res.status(200).send('EVENT_RECEIVED');
  }
}
