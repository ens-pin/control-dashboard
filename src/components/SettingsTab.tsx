
export const SettingsTab = () => {
    return (
        <>
            <h1 className="text-4xl font-bold mb-6 text-white">Settings</h1>
            <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 text-gray-300">Account Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                        <div>
                            <p className="font-medium text-gray-300">Notifications</p>
                            <p className="text-sm text-gray-500">Manage your notification preferences</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Configure</button>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                        <div>
                            <p className="font-medium text-gray-300">Privacy</p>
                            <p className="text-sm text-gray-500">Control your privacy settings</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Manage</button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-300">Security</p>
                            <p className="text-sm text-gray-500">Update your security preferences</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Review</button>
                    </div>
                </div>
            </div>
        </>
    );
}; 