import React from 'react';

const UserTaskDetails = ({ setIsUserTaskView, userTaskDetails }) => {

    console.log(userTaskDetails)
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8 relative transition-transform transform scale-100">
                <button
                    onClick={() => setIsUserTaskView(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 focus:outline-none transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Task Details</h2>

                {/* Task Table */}
                <div className="overflow-auto max-h-96 border-t border-b border-gray-200">
                    <table className="min-w-full text-left table-auto">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600">
                                <th className="px-4 py-3 font-semibold">Template ID</th>
                                <th className="px-4 py-3 font-semibold">Min</th>
                                <th className="px-4 py-3 font-semibold">Max</th>
                                <th className="px-4 py-3 font-semibold">Module</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {userTaskDetails?.map((data) => (
                                <tr className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">{data?.templeteId}</td>
                                    <td className="px-4 py-3">{data?.min}</td>
                                    <td className="px-4 py-3">{data?.max}</td>
                                    <td className="px-4 py-3">{data?.moduleType}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-3 py-1 text-sm font-semibold ${data?.taskStatus ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"} bg-green-100 text-green-600 rounded-full`}>
                                            {data?.taskStatus ? "Completed" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserTaskDetails;
