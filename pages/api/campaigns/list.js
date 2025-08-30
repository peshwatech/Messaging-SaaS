// pages/api/campaigns/list.js
import { getAuth } from 'firebase-admin/auth';
// Import only adminDb, as initialization is now automatic.
import { adminDb } from '../../../lib/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. VERIFY USER TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No auth header provided.' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Added a stricter check and logging for debugging
    if (!idToken || typeof idToken !== 'string') {
      console.error("Invalid token received:", idToken);
      return res.status(401).json({ message: 'Unauthorized: Malformed token.' });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 2. FETCH CAMPAIGNS FROM FIRESTORE
    const campaignsSnapshot = await adminDb
      .collection('tenants')
      .doc(userId)
      .collection('campaigns')
      .get();

    if (campaignsSnapshot.empty) {
      return res.status(200).json([]);
    }

    const campaigns = campaignsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(campaigns);

  } catch (error) {
    console.error("Error fetching campaigns:", error.code ? error.code : error.message);
    if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ message: 'Unauthorized: Token expired.' });
    }
    // Provide a more specific error message for argument errors
    if (error.code === 'auth/argument-error') {
        return res.status(401).json({ message: 'Unauthorized: The provided token is invalid.' });
    }
    res.status(500).json({ message: 'Failed to fetch campaigns.' });
  }
}

