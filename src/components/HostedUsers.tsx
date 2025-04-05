import { useState, useEffect } from 'react';

interface HostedUser {
  name: string;
  node: string;
  hash: string;
  file_size: number;
}

interface HostedUsersResponse {
  message: string;
  users: HostedUser[];
}

export function HostedUsers() {
  const [users, setUsers] = useState<HostedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostedUsers();
  }, []);

  const fetchHostedUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hosted');
      if (!response.ok) {
        throw new Error(`Failed to fetch hosted users: ${response.status}`);
      }
      
      const data: HostedUsersResponse = await response.json();
      
      if (data && data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching hosted users:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Format file size - KB if less than 1000KB, MB otherwise
  const formatFileSize = (bytes: number) => {
    const kilobytes = bytes / 1024;
    
    // If less than 1000KB, display in KB
    if (kilobytes < 1000) {
      return kilobytes.toFixed(2) + ' KB';
    }
    
    // Otherwise display in MB
    const megabytes = kilobytes / 1024;
    return megabytes.toFixed(2) + ' MB';
  };

  return (
    <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-300">Hosted Users</h3>
        <button 
          onClick={fetchHostedUsers}
          className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-md">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="p-4 text-center text-gray-400">Loading hosted users...</div>
      ) : users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Node ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IPFS Hash</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File Size</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <span className="font-mono">{user.node.substring(0, 8)}...{user.node.substring(user.node.length - 8)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <a href={`https://ipfs.io/ipfs/${user.hash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-400 hover:underline">
                      {user.hash.substring(0, 8)}...{user.hash.substring(user.hash.length - 8)}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatFileSize(user.file_size)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">No hosted users found.</div>
      )}
    </div>
  );
} 