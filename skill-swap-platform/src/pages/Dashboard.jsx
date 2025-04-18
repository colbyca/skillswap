import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import RequestDialog from '../components/RequestDialog';
import ConnectionDialog from '../components/ConnectionDialog';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState({ have: [], want: [] });
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isIncomingRequest, setIsIncomingRequest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch user's skills
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }
        const userData = userDoc.data();

        // Fetch skill details for skillsIHave and skillsIWant
        const skillsIHaveDocs = await Promise.all(
          (userData.skillsIHave || []).map(async (skillId) => {
            const skillDoc = await getDoc(doc(db, 'skills', skillId));
            return skillDoc.exists() ? skillDoc : null;
          })
        );
        const skillsIWantDocs = await Promise.all(
          (userData.skillsIWant || []).map(async (skillId) => {
            const skillDoc = await getDoc(doc(db, 'skills', skillId));
            return skillDoc.exists() ? skillDoc : null;
          })
        );

        setSkills({
          have: skillsIHaveDocs
            .filter(doc => doc !== null)
            .map(doc => ({ id: doc.id, ...doc.data() })),
          want: skillsIWantDocs
            .filter(doc => doc !== null)
            .map(doc => ({ id: doc.id, ...doc.data() }))
        });

        // Fetch outgoing connection requests
        const outgoingQuery = query(
          collection(db, 'connections'),
          where('senderId', '==', currentUser.uid),
          where('status', '==', 'pending')
        );
        const outgoingSnapshot = await getDocs(outgoingQuery);
        const outgoingRequests = await Promise.all(
          outgoingSnapshot.docs.map(async (requestDoc) => {
            const data = requestDoc.data();
            const recipientDoc = await getDoc(doc(db, 'users', data.recipientId));
            if (!recipientDoc.exists()) {
              return null;
            }

            const skillsOfferedDocs = await Promise.all(
              (data.skillsOffered || []).map(async (skillId) => {
                const skillDoc = await getDoc(doc(db, 'skills', skillId));
                return skillDoc.exists() ? skillDoc : null;
              })
            );
            const skillsWantedDocs = await Promise.all(
              (data.skillsWanted || []).map(async (skillId) => {
                const skillDoc = await getDoc(doc(db, 'skills', skillId));
                return skillDoc.exists() ? skillDoc : null;
              })
            );

            return {
              id: requestDoc.id,
              ...data,
              recipient: recipientDoc.data(),
              skillsOffered: skillsOfferedDocs
                .filter(doc => doc !== null)
                .map(doc => ({ id: doc.id, ...doc.data() })),
              skillsWanted: skillsWantedDocs
                .filter(doc => doc !== null)
                .map(doc => ({ id: doc.id, ...doc.data() }))
            };
          })
        );
        setOutgoingRequests(outgoingRequests.filter(request => request !== null));

        // Fetch incoming connection requests
        const incomingQuery = query(
          collection(db, 'connections'),
          where('recipientId', '==', currentUser.uid),
          where('status', '==', 'pending')
        );
        const incomingSnapshot = await getDocs(incomingQuery);
        const incomingRequests = await Promise.all(
          incomingSnapshot.docs.map(async (requestDoc) => {
            const data = requestDoc.data();
            const senderDoc = await getDoc(doc(db, 'users', data.senderId));
            if (!senderDoc.exists()) {
              return null;
            }

            const skillsOfferedDocs = await Promise.all(
              (data.skillsOffered || []).map(async (skillId) => {
                const skillDoc = await getDoc(doc(db, 'skills', skillId));
                return skillDoc.exists() ? skillDoc : null;
              })
            );
            const skillsWantedDocs = await Promise.all(
              (data.skillsWanted || []).map(async (skillId) => {
                const skillDoc = await getDoc(doc(db, 'skills', skillId));
                return skillDoc.exists() ? skillDoc : null;
              })
            );

            return {
              id: requestDoc.id,
              ...data,
              sender: senderDoc.data(),
              skillsOffered: skillsOfferedDocs
                .filter(doc => doc !== null)
                .map(doc => ({ id: doc.id, ...doc.data() })),
              skillsWanted: skillsWantedDocs
                .filter(doc => doc !== null)
                .map(doc => ({ id: doc.id, ...doc.data() }))
            };
          })
        );
        setIncomingRequests(incomingRequests.filter(request => request !== null));

        // Fetch approved connections
        const sentConnectionsQuery = query(
          collection(db, 'connections'),
          where('status', '==', 'approved'),
          where('senderId', '==', currentUser.uid)
        );
        const receivedConnectionsQuery = query(
          collection(db, 'connections'),
          where('status', '==', 'approved'),
          where('recipientId', '==', currentUser.uid)
        );

        const [sentSnapshot, receivedSnapshot] = await Promise.all([
          getDocs(sentConnectionsQuery),
          getDocs(receivedConnectionsQuery)
        ]);

        const sentConnections = await Promise.all(
          sentSnapshot.docs.map(async (connectionDoc) => {
            const data = connectionDoc.data();
            const recipientDoc = await getDoc(doc(db, 'users', data.recipientId));
            if (!recipientDoc.exists()) {
              return null;
            }

            return {
              id: connectionDoc.id,
              ...data,
              recipient: recipientDoc.data(),
              isSender: true
            };
          })
        );

        const receivedConnections = await Promise.all(
          receivedSnapshot.docs.map(async (connectionDoc) => {
            const data = connectionDoc.data();
            const senderDoc = await getDoc(doc(db, 'users', data.senderId));
            if (!senderDoc.exists()) {
              return null;
            }

            return {
              id: connectionDoc.id,
              ...data,
              recipient: senderDoc.data(),
              isSender: false
            };
          })
        );

        setConnections([
          ...sentConnections.filter(connection => connection !== null),
          ...receivedConnections.filter(connection => connection !== null)
        ]);
      } catch (error) {
        setError('Failed to fetch data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleRequestClick = (request, isIncoming) => {
    setSelectedRequest(request);
    setIsIncomingRequest(isIncoming);
  };

  const handleConnectionClick = (connection) => {
    setSelectedConnection(connection);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Left - My Skills */}
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary-400">My Skills</h2>
            <Link
              to="/edit-profile"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Edit Profile
            </Link>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-100 mb-2">Skills I Have</h3>
              <div className="flex flex-wrap gap-2">
                {skills.have.map(skill => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 rounded-full text-sm bg-primary-600 text-white"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-100 mb-2">Skills I Want</h3>
              <div className="flex flex-wrap gap-2">
                {skills.want.map(skill => (
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
        </section>

        {/* Top Right - Connections */}
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">Connections</h2>
          <div className="space-y-4">
            {connections.map(connection => (
              <div
                key={connection.id}
                className="bg-dark-700 p-4 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors"
                onClick={() => handleConnectionClick(connection)}
              >
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  {connection.recipient.name}
                </h3>
                <div className="text-sm text-gray-400">
                  Connected since {new Date(connection.approvedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Left - Incoming Requests */}
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">Incoming Requests</h2>
          <div className="space-y-4">
            {incomingRequests.map(request => (
              <div
                key={request.id}
                className="bg-dark-700 p-4 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors"
                onClick={() => handleRequestClick(request, true)}
              >
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  From: {request.sender.name}
                </h3>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Offering:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {request.skillsOffered.map(skill => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 rounded-full text-xs bg-primary-600 text-white"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Wanting:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {request.skillsWanted.map(skill => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 rounded-full text-xs bg-dark-600 text-gray-300"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Status: {request.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Right - Outgoing Requests */}
        <section className="bg-dark-800 p-6 rounded-lg border border-dark-700">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">Outgoing Requests</h2>
          <div className="space-y-4">
            {outgoingRequests.map(request => (
              <div
                key={request.id}
                className="bg-dark-700 p-4 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors"
                onClick={() => handleRequestClick(request, false)}
              >
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  To: {request.recipient.name}
                </h3>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Offering:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {request.skillsOffered.map(skill => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 rounded-full text-xs bg-primary-600 text-white"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Wanting:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {request.skillsWanted.map(skill => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 rounded-full text-xs bg-dark-600 text-gray-300"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Status: {request.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedRequest && (
        <RequestDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          isIncoming={isIncomingRequest}
        />
      )}

      {selectedConnection && (
        <ConnectionDialog
          connection={selectedConnection}
          onClose={() => setSelectedConnection(null)}
        />
      )}
    </div>
  );
};

export default Dashboard; 