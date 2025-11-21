import React, { useState } from 'react';
import { Users, UserPlus, Building, CheckCircle } from 'lucide-react';

// This component allows Main Government to add State Heads, Deputies, and Vendors through UI

export const AdminPanel = () => {
  const [newStateHead, setNewStateHead] = useState('');
  const [newDeputy, setNewDeputy] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Add State Head
  const handleAddStateHead = async () => {
    if (!newStateHead) {
      setMessage('Please enter a Principal ID');
      return;
    }

    setLoading(true);
    try {
      // Call your canister
      // const result = await canister.proposeStateHead(newStateHead);
      // await canister.confirmStateHead(newStateHead);
      
      // For now, just show success (you'll connect to canister later)
      setMessage(`✅ State Head added: ${newStateHead}`);
      setNewStateHead('');
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Add Deputy
  const handleAddDeputy = async () => {
    if (!newDeputy) {
      setMessage('Please enter a Principal ID');
      return;
    }

    setLoading(true);
    try {
      // const result = await canister.proposeDeputy(newDeputy, stateHeadPrincipal);
      // await canister.confirmDeputy(newDeputy, stateHeadPrincipal);
      
      setMessage(`✅ Deputy added: ${newDeputy}`);
      setNewDeputy('');
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Add Vendor
  const handleAddVendor = async () => {
    if (!newVendor) {
      setMessage('Please enter a Principal ID');
      return;
    }

    setLoading(true);
    try {
      // const result = await canister.proposeVendor(newVendor);
      // await canister.approveVendor(newVendor);
      
      setMessage(`✅ Vendor approved: ${newVendor}`);
      setNewVendor('');
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Panel - Add Users</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Add State Head */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Add State Head</h2>
        </div>
        <p className="text-gray-600 mb-4">
          State Heads can allocate budgets and manage deputies in their region.
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Principal ID (e.g., abc123-xyz-cai)"
            value={newStateHead}
            onChange={(e) => setNewStateHead(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddStateHead}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add State Head
          </button>
        </div>
      </div>

      {/* Add Deputy */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Users className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold">Add Deputy</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Deputies can select vendors and manage project allocations.
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Principal ID (e.g., def456-abc-cai)"
            value={newDeputy}
            onChange={(e) => setNewDeputy(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={handleAddDeputy}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add Deputy
          </button>
        </div>
      </div>

      {/* Add Vendor */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Building className="w-6 h-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold">Approve Vendor</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Vendors can submit claims and receive payments for completed work.
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Principal ID (e.g., ghi789-xyz-cai)"
            value={newVendor}
            onChange={(e) => setNewVendor(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleAddVendor}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Approve Vendor
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📝 How to Get Principal IDs:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>User creates Internet Identity at <a href="https://identity.ic0.app" target="_blank" rel="noopener noreferrer" className="underline">identity.ic0.app</a></li>
          <li>User logs into H.E.L.I.X with their Internet Identity</li>
          <li>User copies their Principal ID from their profile</li>
          <li>User sends you their Principal ID (via email/form)</li>
          <li>You paste it here and click the button to add them</li>
        </ol>
      </div>
    </div>
  );
};
