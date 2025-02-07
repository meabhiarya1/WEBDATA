import React from 'react';

const UserTaskDetails = ({ setIsDetailsView, userDetails }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative transition-transform transform scale-100">
                <button
                    onClick={() => setIsDetailsView(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Task Details</h2>
                <div className="overflow-auto max-h-96 border-t border-b border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-600">SN</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {/* Sort userDetails by timestamp in descending order */}
                            {userDetails
                                ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sorting by timestamp
                                .map((data, index) => {
                                    const dateObject = new Date(data?.timestamp);
                                    const date = dateObject.toLocaleDateString("en-GB");
                                    const timeOptions = {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                    };
                                    const time = dateObject.toLocaleTimeString("en-US", timeOptions);

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition duration-200 ease-in-out">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">{data.action || 'Unknown Action'}</td>
                                            <td className="px-4 py-3">{date || 'No description'}</td>
                                            <td className="px-4 py-3">{time}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default UserTaskDetails;
