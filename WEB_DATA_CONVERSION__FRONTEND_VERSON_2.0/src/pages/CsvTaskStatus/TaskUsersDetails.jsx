import React from 'react'
import { FaAngleDoubleLeft } from "react-icons/fa";

const TaskUsersDetails = ({
    csvDetails,
    setOpenDetails,
    selectedHeader,
    headerValue,
    onGetUserDetailsHandler,
    onGetUserTaskDetailsHandler
}) => {


    const hasUserDetailsKey = csvDetails && csvDetails?.some((item) => item.hasOwnProperty('User Details'));
    const userDetailCounts = {};
    let uncompletedDataCount = 0;

    csvDetails?.forEach((item) => {
        const userDetailValue = item['User Details'];
        if (!userDetailValue) {
            uncompletedDataCount += 1;
        } else {
            if (userDetailCounts[userDetailValue]) {
                userDetailCounts[userDetailValue] += 1;
            } else {
                userDetailCounts[userDetailValue] = 1;
            }
        }
    });


    return (
        <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 templatemapping min-h-[100vh]">
            <div className="w-full max-w-6xl px-8 py-10 bg-white rounded-xl shadow-lg">
                <span onClick={() => setOpenDetails(false)} className="cursor-pointer"><FaAngleDoubleLeft className='cursor-pointer text-3xl' /></span>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                            CSV Data Overview
                        </h2>
                        <p className="mt-2 text-base text-gray-500">
                            Showing header for <span className="font-semibold text-blue-600">{selectedHeader}</span> with code <span className="font-semibold text-blue-600">{headerValue}</span>
                        </p>
                    </div>

                    <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col rounded-lg bg-blue-50 px-6 py-6 text-center shadow-md">
                            <dt className="text-base font-medium text-gray-500">Header</dt>
                            <dd className="text-3xl font-bold text-blue-600 mt-1">{selectedHeader}</dd>
                        </div>

                        <div className="flex flex-col rounded-lg bg-blue-50 px-6 py-6 text-center shadow-md">
                            <dt className="text-base font-medium text-gray-500">Header Value</dt>
                            <dd className="text-3xl font-bold text-blue-600 mt-1">{headerValue}</dd>
                        </div>

                        <div className="flex flex-col rounded-lg bg-blue-50 px-6 py-6 text-center shadow-md">
                            <dt className="text-base font-medium text-gray-500">Total Records</dt>
                            <dd className="text-3xl font-bold text-blue-600 mt-1">{csvDetails?.length}</dd>
                        </div>

                        <div className="flex flex-col rounded-lg bg-blue-50 px-6 py-6 text-center shadow-md">
                            <dt className="text-base font-medium text-gray-500">Completed Data</dt>
                            {hasUserDetailsKey ? <dd className="text-3xl font-bold text-blue-600 mt-1">{csvDetails?.length - uncompletedDataCount}</dd> :
                                <dd className="text-xl font-bold text-blue-600 mt-1">Task Not stated yet</dd>}
                        </div>
                    </dl>

                    {/* Displaying CSV Details */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">CSV Data Details</h3>
                        <div className="overflow-x-auto">
                            <div className="max-h-[300px] overflow-y-auto">
                                <table className="w-full text-left table-auto border-collapse">
                                    <thead className="bg-blue-200 text-blue-800">
                                        <tr className="border-b border-gray-300 ">
                                            <th className="px-4 py-2 font-semibold text-sm">Name</th>
                                            <th className="px-4 py-2 font-semibold text-center  text-sm">Email</th>
                                            <th className="px-4 py-2 text-center font-semibold text-sm">Total Updated Data</th>
                                            <th className="px-4 py-2 text-center font-semibold text-sm">User Details</th>
                                            <th className="px-4 py-2 text-center font-semibold text-sm">Tasks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(userDetailCounts).map(([userDetail, count], idx) => (
                                            <tr key={idx} className={`bg-white cursor-pointer border-b border-gray-200`}>
                                                <td className="px-4 py-2 text-sm text-gray-700">
                                                    {userDetail && userDetail?.split(':')[0]}
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm text-gray-700">
                                                    {userDetail && userDetail?.split(':')[1]}
                                                </td>
                                                <td className="px-4 py-2 text-center text-sm text-gray-700">
                                                    {count}
                                                </td>
                                                <td className="text-center text-sm text-gray-700 p-2">
                                                    <button
                                                        onClick={() => onGetUserDetailsHandler(userDetail?.split(':')[1])}
                                                        className="inline-flex items-center rounded border border-indigo-600 bg-indigo-600 px-4 p-2 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                                                    >
                                                        <span className="text-sm font-medium"> Details </span>
                                                        <svg
                                                            className="size-5 rtl:rotate-180"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                                <td className="text-center text-sm text-gray-700 p-2">
                                                    <button
                                                        onClick={() => onGetUserTaskDetailsHandler(userDetail?.split(':')[1])}
                                                        className="inline-flex items-center rounded border border-indigo-600 bg-indigo-600 px-4 p-2 text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                                                    >
                                                        <span className="text-sm font-medium"> Tasks </span>

                                                        <svg
                                                            className="size-5 rtl:rotate-180"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskUsersDetails
