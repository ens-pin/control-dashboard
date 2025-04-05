import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { OverviewTab } from "@/components/OverviewTab";
import { AddNodeTab } from "@/components/AddNodeTab";

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'create-node':
                return <AddNodeTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <div 
                className={`bg-black text-white w-64 border-r border-gray-800 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'ml-0' : '-ml-64'
                } h-screen sticky top-0`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-white">Dashboard Menu</h2>
                    </div>
                    <nav className="mt-8">
                        <ul className="space-y-2">
                            <li 
                                className={`p-2 rounded cursor-pointer ${activeTab === 'overview' ? 'bg-gray-800 text-white' : 'hover:bg-gray-900'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </li>
                            <li 
                                className={`p-2 rounded cursor-pointer ${activeTab === 'create-node' ? 'bg-gray-800 text-white' : 'hover:bg-gray-900'}`}
                                onClick={() => setActiveTab('create-node')}
                            >
                                Add IPFS Node
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ease-in-out`}>
                {/* Header */}
                <header className="bg-black shadow-sm p-4 border-b border-gray-800 flex items-center">
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-gray-900 text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isSidebarOpen ? 
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                    <span className="ml-4 text-white text-lg">IPFS Dashboard</span>
                </header>

                {/* Dashboard Content */}
                <main className="p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}