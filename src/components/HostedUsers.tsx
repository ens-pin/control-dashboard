import { useQuery } from "@tanstack/react-query";

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
  const { data, isLoading, error, refetch } = useQuery<HostedUsersResponse>({
    queryKey: ['hosted-users'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/hosted`);
      if (!response.ok) {
        throw new Error(`Failed to fetch hosted users: ${response.status}`);
      }
      return response.json();
    },
  });

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

  if (isLoading) {
    return <div className="p-4 text-center text-gray-400">Loading hosted users...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-md">
          <p className="text-red-400">{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-300">Hosted Users</h3>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>
      
      {data?.users?.length ? (
        <div className="grid gap-4">
          {data.users.map((user, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-md border border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-medium text-white">{user.name}</h4>
                  <p className="text-gray-400 mt-1">Node: {user.node}</p>
                  <p className="text-xs text-gray-500 mt-1">Hash: {user.hash}</p>
                  <p className="text-xs text-gray-500 mt-1">Size: {formatFileSize(user.file_size)}</p>
                </div>
                <a
                  href={`https://ipfs.io/ipfs/${user.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">No hosted users found</div>
      )}
    </div>
  );
} 