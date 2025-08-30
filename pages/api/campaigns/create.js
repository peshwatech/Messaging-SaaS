// File Location: /pages/api/campaigns/create.js
// This API has been updated to be secure and multi-tenant aware.
import { adminDb } from '../../../lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

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

  // --- 2. Handle Incoming Status Updates ---
  if (req.method === 'POST') {
    const body = req.body;
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    try {
        const status = body.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
        if (!status) {
            console.log('Not a status update webhook. Acknowledging.');
            return res.status(200).send('EVENT_RECEIVED');
        }

        const messageId = status.id;
        const newStatus = status.status; // e.g., 'delivered', 'read', 'failed'

        // A. Find the message using the lookup collection
        const lookupRef = adminDb.collection('message_lookups').doc(messageId);
        const lookupDoc = await lookupRef.get();

        if (!lookupDoc.exists) {
            console.warn(`Could not find lookup for messageId: ${messageId}`);
            return res.status(200).send('EVENT_RECEIVED_NO_LOOKUP');
        }

        const { userId, campaignId } = lookupDoc.data();

        // B. Update the specific message document with the new status
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

        // C. (Optional but recommended) Increment the campaign's stats counter
        const campaignRef = adminDb.collection('tenants').doc(userId).collection('campaigns').doc(campaignId);
        
        // Use FieldValue.increment to safely update the count
        // Note: 'failed' status might also come through, you can add a counter for it too.
        if (newStatus === 'delivered' || newStatus === 'read') {
             await campaignRef.update({
                [`stats.${newStatus}`]: FieldValue.increment(1)
            });
        }
        
        console.log(`Updated message ${messageId} to status '${newStatus}' for campaign ${campaignId}`);
        return res.status(200).send('EVENT_PROCESSED');

    } catch (error) {
        console.error('Error processing webhook:', error);
        // Still send 200 to prevent WhatsApp from resending, but log the error
        return res.status(200).send('EVENT_RECEIVED_WITH_ERROR');
    }
  }

  // Handle other methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end('Method Not Allowed');
}
