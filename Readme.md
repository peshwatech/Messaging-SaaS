Messaging-SaaS: A Multi-tenant WhatsApp Communication Platform 🚀 (Local Development)
This project is a multi-tenant SaaS application designed for automated and personalized WhatsApp messaging. It's configured for local development and testing only, adhering strictly to the Firebase Spark Plan and requiring no linked Google Cloud billing account for its operation.

Your API and Worker services will run directly on your local machine, using Firebase as the backend database and ngrok to create a temporary public URL for WhatsApp webhooks.

✨ Features
Secure Multi-Tenancy: Client data isolation using Firebase Authentication Custom Claims and Firestore Security Rules.

Bulk Messaging: Send personalized messages to contact lists via the official WhatsApp Cloud API.

Campaign Management: Create, schedule (conceptually), and track messaging campaigns.

Contact Management: Import, organize, and segment customer contacts.

Message Templates: Manage WhatsApp message templates.

Real-time Status Updates: Receive delivery and read receipts via webhooks.

Incoming Message Handling: Process customer replies for two-way communication.

CRM Integration Ready: Designed for future integration with external CRM systems.

Cost-Optimized: Leverages Firebase Spark Plan free tier and local execution to incur no cloud compute/deployment costs.

🛠️ Technology Stack (Local Focus)
Backend: Node.js (running locally)

Database: Google Cloud Firestore (Firebase Spark Plan)

Authentication: Firebase Authentication (Firebase Spark Plan)

Local Tunneling: ngrok (for exposing local API to WhatsApp webhooks)

External API: WhatsApp Business Cloud API

📁 Project Structure
Messaging-SaaS/
├── database/             # Stores sensitive Firebase service account key
│   └── serviceAccountKey.json
├── api-service/          # Your API service code (runs locally on port 8080)
│   ├── index.js
│   ├── package.json
│   └── .env              # Local environment variables
└── worker-service/       # Your Worker service code (runs locally on port 8081)
    ├── index.js
    ├── package.json
    └── .env              # Local environment variables

⚙️ Getting Started (Local Development)
Follow these steps to set up and run your Messaging-SaaS project on your Windows desktop.

Prerequisites
Node.js & npm: Installed on your Windows desktop.

Git Bash: Installed (recommended for Windows terminal).

VS Code: Installed on your Windows desktop.

Firebase Project: A Firebase project (e.g., "Messaging-SaaS") set up in the Firebase Console.

Firebase Service Account Key: Downloaded from your Firebase project settings (Project settings > Service accounts > Generate new private key) and saved as serviceAccountKey.json.

Meta Developer Account: An account with a Business-type app created and the WhatsApp product added.

ngrok: Downloaded and set up for local tunneling.

🔒 Proprietary Software
This project contains proprietary software. All rights are reserved. Unauthorized copying, modification, or distribution of this software, or any portion of it, is strictly prohibited.