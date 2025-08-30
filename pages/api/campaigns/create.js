// File Location: /pages/api/campaigns/create.js
// This API has been updated to be secure and multi-tenant aware.
import { adminDb } from '../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import axios from 'axios';

// Ensure the admin app is initialized by importing the config
import '../../../lib/firebaseAdmin';

export default async function handler(req, res) {
  // --- 1. Webhook Verification ---
  if (req.method === 'GET') {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else {
      console.error('Webhook verification failed.');
      return res.status(403).end();
    }
  }

  // --- 2. Handle POST Request from Frontend ---
  if (req.method === 'POST') {
    console.log('Handling incoming message or status update...');
    const body = req.body;

    try {
        // Check for a webhook status update first
        const status = body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
        if (status) {
            console.log('Received webhook status update.');
            const messageId = status.id;
            const newStatus = status.status;

            const lookupRef = adminDb.collection('message_lookups').doc(messageId);
            const lookupDoc = await lookupRef.get();

            if (!lookupDoc.exists) {
                console.warn(`Could not find lookup for messageId: ${messageId}`);
                return res.status(200).send('EVENT_RECEIVED_NO_LOOKUP');
            }

            const { userId, campaignId } = lookupDoc.data();
            const messageRef = adminDb
                .collection('tenants')
                .doc(userId)
                .collection('campaigns')
                .doc(campaignId)
                .collection('messages')
                .doc(messageId);
            
            await messageRef.update({
                status: newStatus,
                updatedAt: FieldValue.serverTimestamp()
            });

            const campaignRef = adminDb.collection('tenants').doc(userId).collection('campaigns').doc(campaignId);
            if (newStatus === 'delivered' || newStatus === 'read') {
                await campaignRef.update({
                    [`stats.${newStatus}`]: FieldValue.increment(1)
                });
            }
            
            console.log(`Updated message ${messageId} to status '${newStatus}' for campaign ${campaignId}`);
            return res.status(200).send('EVENT_PROCESSED');
        }

        // Handle a new campaign creation request from the frontend
        console.log('Received a new campaign creation request.');
        const { templateName, contactNumbers } = body;

        // AUTHENTICATION: Get the user ID from the custom token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Unauthorized: No auth header provided.' });
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // BUSINESS LOGIC: Store campaign and messages in Firestore
        const campaignRef = await adminDb
            .collection('tenants')
            .doc(userId)
            .collection('campaigns')
            .add({
                name: templateName,
                contactCount: contactNumbers.length,
                status: 'in-progress',
                createdAt: FieldValue.serverTimestamp(),
                dateSent: new Date().toISOString(),
                stats: {
                    sent: 0,
                    delivered: 0,
                    read: 0,
                }
            });

        const messagesRef = campaignRef.collection('messages');

        // Prepare messages for batch sending
        const messages = contactNumbers.map(number => ({
            contact: number,
            status: 'pending',
            sentAt: FieldValue.serverTimestamp(),
            messageId: null // To be updated by the webhook
        }));
        
        // A. Loop through contacts and send messages
        for (const number of contactNumbers) {
            // Placeholder for WhatsApp Cloud API call
            // In a real application, you would make an API call here.
            // For example:
            // const whatsappResponse = await axios.post(
            //   `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            //   {
            //     messaging_product: "whatsapp",
            //     to: number,
            //     type: "template",
            //     template: {
            //       name: templateName,
            //       language: { code: "en_US" }
            //     }
            //   },
            //   {
            //     headers: {
            //       Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
            //     }
            //   }
            // );

            // Simulating a successful API response with a mock message ID
            const mockMessageId = `mock-message-${Math.random().toString(36).substr(2, 9)}`;

            // B. Create a lookup document to map the WhatsApp message ID back to the user and campaign
            await adminDb.collection('message_lookups').doc(mockMessageId).set({
                userId,
                campaignId: campaignRef.id
            });

            // C. Save the message to Firestore
            await messagesRef.doc(mockMessageId).set({
                contact: number,
                status: 'sent', // Initially sent, will be updated by webhook
                sentAt: FieldValue.serverTimestamp()
            });
        }
        
        return res.status(200).json({ message: 'Campaign initiated successfully. Messages are being sent.' });

    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Handle other methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}
