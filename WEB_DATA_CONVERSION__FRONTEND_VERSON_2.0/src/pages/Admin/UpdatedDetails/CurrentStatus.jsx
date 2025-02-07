import React from 'react';
import { FaTimes } from 'react-icons/fa';

const CurrentStatus = ({
    currentDetails,
    setCurrentDetails,
    openCurrentDetails,
    setOpenCurrentDetails
}) => {
    const details = [
        "Detail 1: System running smoothly",
        "Detail 2: Last backup 2 hours ago",
        "Detail 3: Network status is stable",
        "Detail 4: CPU usage at 45%",
        "Detail 5: Disk space available: 120GB",
        "Detail 6: No active alerts",
        "Detail 7: Next scheduled maintenance in 3 days",
        "Detail 8: Memory usage at 65%",
        "Detail 9: Security scan completed",
        "Detail 10: All systems are operational",
    ];

    const handleClose = () => {
        setOpenCurrentDetails(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {openCurrentDetails && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-700">Current System Status</h2>
                            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {details.map((detail, index) => (
                                <li key={index} className="text-gray-600">
                                    {detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentStatus;
