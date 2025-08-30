// File Location: /pages/api/campaigns/create.js
// This API has been updated to be secure and multi-tenant aware.

import { getAuth } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { initializeAdminApp, adminDb } from '../../../lib/firebaseAdmin'; // We need a new admin config file
import axios from 'axios';

// Initialize the Firebase Admin SDK
initializeAdminApp();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. VERIFY USER TOKEN
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid; // This is the user's unique ID, our new tenantId

    // 2. VALIDATE REQUEST BODY
    const { template, contacts } = req.body;
    if (!template || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    // 3. SAVE CAMPAIGN TO FIRESTORE (under the user's tenant)
    const campaignData = {
      templateName: template,
      contactCount: contacts.length,
      status: 'in_progress',
      createdAt: Timestamp.now(),
    };
    
    const campaignRef = await adminDb
      .collection('tenants')
      .doc(userId) // Use the authenticated user's UID as the document ID
      .collection('campaigns')
      .add(campaignData);

    console.log(`Campaign ${campaignRef.id} logged for user ${userId}`);

    // 4. SEND MESSAGES VIA WHATSAPP API
    const sendMessagePromises = contacts.map(contactNumber => {
      return axios.post(
        `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: contactNumber,
          type: "template",
          template: { name: template, language: { code: "en_US" } },
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    });

    await Promise.allSettled(sendMessagePromises);

    res.status(200).json({ message: `Campaign created successfully! Attempted to send ${contacts.length} messages.` });

  } catch (error) {
    console.error("Error creating campaign:", error.code ? error.code : error.message);
    if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ message: 'Unauthorized: Token expired.' });
    }
    res.status(500).json({ message: 'Failed to create campaign.' });
  }
}
