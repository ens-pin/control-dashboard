
import { useState, type ChangeEvent, type FormEvent } from 'react';

export function CreateNodeTab() {
    const [nodeName, setNodeName] = useState('ipfs');
    const [dataPath, setDataPath] = useState('/data/ipfs');
    const [port, setPort] = useState('4001');
    const [apiPort, setApiPort] = useState('5001');
    const [gatewayPort, setGatewayPort] = useState('8080');
    const [swarmKey, setSwarmKey] = useState('');
    const [bootstrapNodes, setBootstrapNodes] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [nodeCreated, setNodeCreated] = useState(false);
    const [creationMessage, setCreationMessage] = useState('');

    // Handle individual field changes with proper typing
    const handleNodeNameChange = (e: ChangeEvent<HTMLInputElement>) => setNodeName(e.target.value);
    const handleDataPathChange = (e: ChangeEvent<HTMLInputElement>) => setDataPath(e.target.value);
    const handlePortChange = (e: ChangeEvent<HTMLInputElement>) => setPort(e.target.value);
    const handleApiPortChange = (e: ChangeEvent<HTMLInputElement>) => setApiPort(e.target.value);
    const handleGatewayPortChange = (e: ChangeEvent<HTMLInputElement>) => setGatewayPort(e.target.value);
    const handleSwarmKeyChange = (e: ChangeEvent<HTMLTextAreaElement>) => setSwarmKey(e.target.value);
    const handleBootstrapNodesChange = (e: ChangeEvent<HTMLTextAreaElement>) => setBootstrapNodes(e.target.value);

    // Handle form submission with proper typing
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        setCreationMessage('');

        // Simulate API call
        setTimeout(() => {
            setIsCreating(false);
            setNodeCreated(true);
            setCreationMessage(`IPFS Node "${nodeName}" created successfully!`);
        }, 2000);
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-white">Create IPFS Node</h1>
            <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-2xl font-semibold mb-6 text-gray-300">Node Configuration</h3>
                
                {nodeCreated && (
                    <div className="mb-6 p-3 bg-green-900/30 border border-green-700 rounded-md">
                        <p className="text-green-400">{creationMessage}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Node Name</label>
                            <input
                                type="text"
                                value={nodeName}
                                onChange={handleNodeNameChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="e.g. ipfs"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be used as the Docker container name</p>
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 mb-2">Data Path</label>
                            <input
                                type="text"
                                value={dataPath}
                                onChange={handleDataPathChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="e.g. /data/ipfs"
                            />
                            <p className="text-xs text-gray-500 mt-1">Local path to store IPFS data</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Swarm Port</label>
                            <input
                                type="text"
                                value={port}
                                onChange={handlePortChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="4001"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 mb-2">API Port</label>
                            <input
                                type="text"
                                value={apiPort}
                                onChange={handleApiPortChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="5001"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 mb-2">Gateway Port</label>
                            <input
                                type="text"
                                value={gatewayPort}
                                onChange={handleGatewayPortChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="8080"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 mb-2">Swarm Key (Optional)</label>
                        <textarea
                            value={swarmKey}
                            onChange={handleSwarmKeyChange}
                            rows={3}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white font-mono text-sm"
                            placeholder="/key/swarm/psk/1.0.0/
/base16/
ef361054ef06907d56ce3aa353e09ff0d4f45bbc46612c0e4d8c6fd3b92b6eff"
                        />
                        <p className="text-xs text-gray-500 mt-1">Private swarm key for creating private networks</p>
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 mb-2">Bootstrap Nodes (Optional)</label>
                        <textarea
                            value={bootstrapNodes}
                            onChange={handleBootstrapNodesChange}
                            rows={3}
                            className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white font-mono text-sm"
                            placeholder="/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
                        />
                        <p className="text-xs text-gray-500 mt-1">List of bootstrap nodes, one per line</p>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className={`px-6 py-3 rounded-md font-medium ${
                                isCreating
                                    ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isCreating ? 'Creating Node...' : 'Create IPFS Node'}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-2xl font-semibold mb-6 text-gray-300">IPFS Docker Command</h3>
                <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <pre className="text-gray-300 text-sm font-mono">
{`docker run -d \\
  --name ${nodeName} \\
  -p ${port}:4001 \\
  -p ${apiPort}:5001 \\
  -p ${gatewayPort}:8080 \\
  -v ${dataPath}:/data/ipfs \\
  ipfs/kubo:latest`}
                    </pre>
                </div>
            </div>
        </div>
    );
} 