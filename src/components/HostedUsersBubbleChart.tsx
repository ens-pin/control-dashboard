import { useEffect, useState } from "react";
import BubbleChart from "./BubbleChart";

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

export default function HostedUsersBubbleChart() {
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

  // Transform user data to bubble chart format
  const getBubbleData = () => {
    if (!users.length) return [];

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

    // For bubble sizing (always use MB for consistent scale)
    const bytesToMB = (bytes: number) => {
      return bytes / (1024 * 1024);
    };

    // Generate a color palette for the bubbles
    const generateColor = (index: number) => {
      const colors = [
        "#4299E1", // blue
        "#48BB78", // green
        "#ED8936", // orange
        "#9F7AEA", // purple
        "#F56565", // red
        "#38B2AC", // teal
        "#ED64A6", // pink
        "#ECC94B", // yellow
      ];
      return colors[index % colors.length];
    };

    return users.map((user, index) => {
      const fileSizeMB = bytesToMB(user.file_size);
      return {
        label: `${user.name} (${formatFileSize(user.file_size)})`,
        count: fileSizeMB, // Use file size in MB for the bubble size
        color: generateColor(index),
        hash: user.hash, // Store hash for redirect on click
      };
    });
  };

  // Handle bubble click
  const handleBubbleClick = (hash: string) => {
    window.open(`https://ipfs.io/ipfs/${hash}`, '_blank');
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-400">Loading bubble chart data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-md">
          <p className="text-red-400">{error}</p>
        </div>
        <button 
          onClick={fetchHostedUsers}
          className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const bubbleData = getBubbleData();

  return (
    <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-300">Hosted Users Visualization</h3>
        <button 
          onClick={fetchHostedUsers}
          className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>
      
      {bubbleData.length > 0 ? (
        <BubbleChart 
          data={bubbleData} 
          width={800} 
          height={500} 
          maxBubbleSize={120}
          onBubbleClick={handleBubbleClick}
        />
      ) : (
        <div className="p-4 text-center text-gray-400">No hosted users found to visualize.</div>
      )}
    </div>
  );
} 