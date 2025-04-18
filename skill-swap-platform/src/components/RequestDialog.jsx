import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

const RequestDialog = ({ request, onClose, isIncoming }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    try {
      setLoading(true);
      setError('');

      await updateDoc(doc(db, 'connections', request.id), {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });

      onClose();
    } catch (error) {
      setError('Failed to approve request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      setError('');

      await deleteDoc(doc(db, 'connections', request.id));
      onClose();
    } catch (error) {
      setError('Failed to reject request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      await deleteDoc(doc(db, 'connections', request.id));
      onClose();
    } catch (error) {
      setError('Failed to delete request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!request) return null;

  const otherUser = isIncoming ? request.sender : request.recipient;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-800 p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-xl"
        >
          ×
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{otherUser.name}</h2>
            <p className="text-gray-300 mt-2">{otherUser.bio || 'No bio provided'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">
                {isIncoming ? 'Skills They Are Offering' : 'Skills You Are Offering'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {request.skillsOffered.map(skill => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-sm bg-primary-600 text-white"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-100 mb-4">
                {isIncoming ? 'Skills They Want' : 'Skills You Want'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {request.skillsWanted.map(skill => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-sm bg-dark-600 text-gray-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {isIncoming ? (
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Delete Request'}
              </button>
            </div>
          )}

          {isIncoming && (
            <div className="text-sm text-gray-400 mt-4">
              Note: If you approve this request, your contact information will be shared with {otherUser.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDialog; 