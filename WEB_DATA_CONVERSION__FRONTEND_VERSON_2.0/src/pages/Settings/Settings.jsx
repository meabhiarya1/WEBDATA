import React from 'react';
import axios from "axios";
import { toast } from "react-toastify"

const Settings = () => {
    const token = JSON.parse(localStorage.getItem("userData"));
    const onCsvBackupHandler = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_IP}/settings/csvbackup`,
                {},
                {
                    headers: {
                        token: token
                    }
                }
            )
            toast.success("CSV Backup completed successfully!")
        }
        catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const onMysqlBackupHandler = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_IP}/settings/mysqlbackup`,
                {},
                {
                    headers: {
                        token: token
                    }
                }
            )
            toast.success("Mysql backup completed successfully!")
        }
        catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className=" flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-20">
            <div className="bg-white w-4/6 lg:w-1/2 xl:w-1/3 rounded-3xl py-8 px-8 shadow-md">
                <h1 className="px-6 py-2 text-3xl font-semibold flex items-center ">
                    BACKUP -
                </h1>
                <div className="flow-root px-4 py-3 mb-3 shadow-sm">
                    <dl className="-my-3 divide-y divide-gray-100 text-lg">
                        <div className="grid grid-cols-1 gap-1 p-4 even:bg-gray-50 sm:grid-cols-3 sm:gap-1">
                            <dt className="font-medium text-gray-900">Mysql backup</dt>
                            <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
                                <button
                                    onClick={onMysqlBackupHandler}
                                    className="inline-block rounded-md bg-white px-4 py-2 text-sm text-blue-500 shadow-sm focus:relative"
                                >
                                    GET BACKUP
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1 p-4 even:bg-gray-50 sm:grid-cols-3 sm:gap-1">
                            <dt className="font-medium text-gray-900">Csv backup</dt>
                            <div className="inline-flex text-center rounded-lg border border-gray-100 bg-gray-100 p-1">
                                <button
                                    onClick={onCsvBackupHandler}
                                    className="inline-block rounded-md bg-white px-4 py-2 text-sm text-blue-500 shadow-sm focus:relative"
                                >
                                    GET BACKUP
                                </button>
                            </div>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}

export default Settings;