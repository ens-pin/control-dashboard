import { useState, useRef, useEffect, type KeyboardEvent, memo } from 'react';

const DockerCLIComponent = memo(() => {
    const [command, setCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const historyContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect
    useEffect(() => {
        if (historyContainerRef.current) {
            historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight;
        }
    }, [commandHistory]);

    const executeCommand = async (cmd: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${hostname}:${port}/docker`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command: cmd }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to execute command');
            }

            setCommandHistory(prev => [...prev, data.output]);
        } catch (error: any) {
            setCommandHistory(prev => [...prev, `Error: ${error.message}`]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommand = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && command.trim() && !isLoading) {
            // Add command to history
            setCommandHistory(prev => [...prev, `$ ${command}`]);
            
            // Process command
            const cmd = command.trim().toLowerCase();
            if (cmd === 'clear') {
                setCommandHistory([]);
            } else {
                await executeCommand(cmd);
            }
            
            // Clear input
            setCommand('');
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-300">Docker CLI</h3>
            <div className="bg-gray-900 rounded-lg p-4">
                <div 
                    ref={historyContainerRef}
                    className="h-40 overflow-y-auto mb-4 font-mono text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                >
                    {commandHistory.map((line, index) => (
                        <div key={index} className="text-gray-300 whitespace-pre-wrap">{line}</div>
                    ))}
                    {isLoading && (
                        <div className="text-blue-400">Executing command...</div>
                    )}
                </div>
                <div className="flex items-center text-gray-400">
                    <span className="mr-2">$</span>
                    <input 
                        type="text" 
                        className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0"
                        placeholder="Enter docker command..."
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={handleCommand}
                        disabled={isLoading}
                    />
                </div>
                <div className="text-sm font-mono text-gray-400 mt-4">
                    <p>Common commands:</p>
                    <p className="mt-2">• docker ps - List running containers</p>
                    <p>• docker start ipfs - Start IPFS container</p>
                    <p>• docker stop ipfs - Stop IPFS container</p>
                    <p>• docker logs ipfs - View IPFS logs</p>
                    <p>• clear - Clear command history</p>
                </div>
            </div>
        </div>
    );
});

DockerCLIComponent.displayName = 'DockerCLIComponent';

export const DockerCliTab = () => {
    return (
        <>
            <h1 className="text-4xl font-bold mb-6 text-white">Docker CLI</h1>
            <DockerCLIComponent />
        </>
    );
}; 