// File Location: /pages/dashboard.js

import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  // State for the campaign form
  const [template, setTemplate] = useState('hello_world'); // Default template
  const [contacts, setContacts] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error)
      {
      console.error("Error signing out: ", error);
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('');

    // Convert the textarea string into an array of numbers, trimming whitespace
    const contactList = contacts.split('\n').map(num => num.trim()).filter(num => num);

    if (contactList.length === 0) {
      setStatusMessage('Please enter at least one contact number.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
          contacts: contactList
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage(`Success: ${data.message}`);
        setContacts(''); // Clear the contacts list after sending
      } else {
        throw new Error(data.message || 'An unknown error occurred.');
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">WhatsApp SaaS</h1>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Campaign Creation Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create a New Campaign</h2>
            <form onSubmit={handleSendCampaign}>
              <div className="mb-4">
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  id="template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contacts" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone Numbers (one per line)
                </label>
                <textarea
                  id="contacts"
                  rows="5"
                  value={contacts}
                  onChange={(e) => setContacts(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g.&#10;15551234567&#10;15557654321"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
                >
                  {isLoading ? 'Sending...' : 'Send Campaign'}
                </button>
              </div>
            </form>
            {statusMessage && (
              <p className={`mt-4 text-sm ${statusMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
