import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { OverviewTab } from "../components/OverviewTab";
import { DockerCliTab } from "../components/DockerCliTab";
import { SettingsTab } from "../components/SettingsTab";
import { CreateNodeTab } from "../components/CreateNodeTab";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'cli':
                return <DockerCliTab />;
            case 'create-node':
                return <CreateNodeTab />;
            case 'settings':
                return <SettingsTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Sidebar */}
            <div className={`bg-black text-white w-64 fixed h-full transition-transform duration-300 ease-in-out border-r border-gray-800 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}>
                <div className="p-4">
                    <h2 className="text-2xl font-semibold text-white">Dashboard Menu</h2>
                    <nav className="mt-8">
                        <ul className="space-y-2">
                            <li 
                                className={`p-2 rounded cursor-pointer ${activeTab === 'overview' ? 'text-white' : 'hover:bg-gray-900'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </li>
                            <li 
                                className={`p-2 rounded cursor-pointer ${activeTab === 'create-node' ? 'text-white' : 'hover:bg-gray-900'}`}
                                onClick={() => setActiveTab('create-node')}
                            >
                                Create IPFS Node
                            </li>
                            <li 
                                className={`p-2 rounded cursor-pointer ${activeTab === 'cli' ? 'text-white' : 'hover:bg-gray-900'}`}
                                onClick={() => setActiveTab('cli')}
                            >
                                Docker CLI
                            </li>
                            <li 
                                className={`p-2 rounded cursor-pointer ${activeTab === 'settings' ? 'text-white' : 'hover:bg-gray-900'}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                Settings
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Header */}
                <header className="bg-black shadow-sm p-4 border-b border-gray-800">
                    <button 
                        onClick={toggleSidebar}
                        className="md:hidden p-2 rounded-md hover:bg-gray-900"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                {/* Dashboard Content */}
                <main className="p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}