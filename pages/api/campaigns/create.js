// File Location: /pages/api/campaigns/create.js

import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

// This API route handles the creation of a new messaging campaign.
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { template, contacts } = req.body;

  // --- Basic Validation ---
  if (!template || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ message: 'Invalid request body. Template and a non-empty contacts array are required.' });
  }

  // In a real multi-tenant app, you would get the tenantId from the user's authenticated session.
  // For this example, we'll use a hardcoded value.
  const tenantId = 'test-tenant'; // Replace with dynamic tenant ID from auth session later

  try {
    // --- Step 1: Log the new campaign in Firestore ---
    const campaignRef = await addDoc(collection(db, `tenants/${tenantId}/campaigns`), {
      templateName: template,
      contactCount: contacts.length,
      status: 'in_progress',
      createdAt: serverTimestamp(),
    });
    console.log(`Campaign logged with ID: ${campaignRef.id}`);

    // --- Step 2: Send messages via WhatsApp Cloud API ---
    // We create an array of promises for all the API calls.
    const sendMessagePromises = contacts.map(contactNumber => {
      return axios.post(
        `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: contactNumber,
          type: "template",
          template: {
            name: template,
            language: { code: "en_US" }
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    });

    // Use Promise.allSettled to wait for all messages to be sent, even if some fail.
    const results = await Promise.allSettled(sendMessagePromises);

    // Optional: Log the results for debugging
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Message sent to ${contacts[index]} successfully.`);
      } else {
        console.error(`Failed to send message to ${contacts[index]}:`, result.reason.response?.data || result.reason.message);
      }
    });

    // --- Step 3: Update campaign status in Firestore (optional) ---
    // In a more advanced setup, you might update the campaign status to 'completed'.
    // For now, we'll skip this to keep it simple.

    res.status(200).json({ message: `Campaign created successfully! Attempted to send ${contacts.length} messages.` });

  } catch (error) {
    console.error("Error creating campaign:", error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to create campaign.' });
  }
}
