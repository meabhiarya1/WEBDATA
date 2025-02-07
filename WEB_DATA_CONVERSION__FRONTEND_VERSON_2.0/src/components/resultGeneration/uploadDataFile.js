import axios from "axios";
import React, { useContext, useState } from "react";
import { ImFolderUpload } from "react-icons/im";
import MarksApply from "./MarksApply";
import SubjectWiseMarkApply from "./SubjectWiseMarkApply";
import OutPutHeaders from "./OutPutHeaders";
import UploadStatus from "./uploadStatus";
import PaperkeyMap from "./PaperKeyMap";
import PaperQueMapper from "./PaperQueMapper";

import { toast } from "react-toastify";
import ResultGenerationContext from "../../Store/ResultGenerationContext";
import SavingLoaderModal from "./SavingLoaderModal";

const UploadDataFile = () => {
  const ctx = useContext(ResultGenerationContext);
  const token = JSON.parse(localStorage.getItem("userData"));
  const [uploadingFileStatus, setFileUploadingStatus] = useState("Pending");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadingFilesPercentage, setUploadingFilesPercentage] = useState(0);
  const [downloadingFilesPercentage, setDownloadingFilesPercentage] =
    useState(0);
  const [uploadingStatusModalOpen, setUploadingModalOpen] = useState(false);
  const keyHEaders = ctx.keyHeaders;
  const dataHeaders = ctx.dataHeaders;

  const csvfileUploader = async (e) => {
    const formData = new FormData();
    formData.append("dataFile", e.target.files[0]);
    setUploadingModalOpen(true);
    setFileUploadingStatus("Pending");
    await axios
      .post(`${process.env.REACT_APP_SERVER_IP}/upload/data`, formData, {
        headers: {
          token: token,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          console.log(percentCompleted);
          setUploadingFilesPercentage(percentCompleted);
        },
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          console.log(percentCompleted);
          setDownloadingFilesPercentage(percentCompleted);
        },
      })
      .then((res) => {
        setUploadFiles((prev) => {
          return [...prev, e.target.files[0].name];
        });
        setFileUploadingStatus("Accepted");
        setUploadingModalOpen(false);

        ctx.uploadFilesHandler(e.target.files[0].name);
        // setFileUploadingStatus(false);
        ctx.uploadDataHeaders(res.data.data);
      })
      .catch((err) => {
        setFileUploadingStatus("Rejected");
        toast.error(
          "some problem while uploading data file ....check (.csv) file and try again later "
        );
      });
  };
  const keyfileUploader = async (e) => {
    const formData = new FormData();
    formData.append("keyFile", e.target.files[0]);
    setFileUploadingStatus("Pending");
    setUploadingModalOpen(true);
    await axios
      .post(`${process.env.REACT_APP_SERVER_IP}/upload/key`, formData, {
        headers: {
          token: token,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          console.log(percentCompleted);
          setUploadingFilesPercentage(percentCompleted);
        },
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          console.log(percentCompleted);
          setDownloadingFilesPercentage(percentCompleted);
        },
      })
      .then((res) => {
        setUploadFiles((prev) => {
          return [...prev, e.target.files[0].name];
        });
        setFileUploadingStatus("Accepted");
        setUploadingModalOpen(false);

        ctx.uploadFilesHandler(e.target.files[0].name);

        ctx.uploadKeyHeaders(res.data.data);
      })
      .catch((err) => {
        setFileUploadingStatus("Accepted");
        toast.error(
          "some problem while uploading key file ....check (.csv) file and try again later "
        );
      });
  };
  return (
    <>
      <div className="h-[100vh] w-[100%] flex  pt-20 overflow-y-hidden lg:mx-4 xl:mx-20 ">
        {uploadFiles.length > 0 && (
          <div
            className="h-auto flex flex-col min-w-[200px]  md:min-w-[300px] w-[20vw]  overflow-y-scroll border-e-2 border-gray-400"
            style={{ scrollbarWidth: "none" }}
          >
            <UploadStatus />
            <PaperkeyMap></PaperkeyMap>
            <PaperQueMapper></PaperQueMapper>
          </div>
        )}

        <div
          className=" w-[100%] flex max-[1103px]:flex-col overflow-y-scroll ms-4"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="h-auto  flex w-[100%] ">
            {!keyHEaders && (
              <div className="h-[100vh] flex flex-col items-center justify-center  w-[100%]">
                {!dataHeaders && (
                  <div
                    className="animate__animated animate__bounceInLeft bg-gradient-to-r from-green-400 to-blue-300 hover:from-pink-400 hover:to-yellow-600 w-[350px] md:w-[500px] rounded-lg py-4 font-semibold hover:font-bold shadow-2xl shadow-black"
                    onChange={csvfileUploader}
                  >
                    <label
                      htmlFor="dataFile1"
                      className="block cursor-pointer mx-4 p-16 border-dashed border-white-500 border-4 hover:border-8"
                    >
                      <input type="file" id="dataFile1" className="hidden" />
                      <div className="flex flex-col justify-center items-center text-2xl md:text-3xl w-[120%] md:w-[100%]">
                        <ImFolderUpload className="w-[80px] h-[80px] text-white" />{" "}
                        <p className="flex items-center mx-2  text-white ">
                          upload data file
                        </p>{" "}
                      </div>
                    </label>
                  </div>
                )}
                {dataHeaders && !keyHEaders && (
                  <div
                    className="animate__animated animate__bounceInRight animate__slow bg-gradient-to-r from-green-400 to-blue-300 hover:from-pink-400 hover:to-yellow-600 w-[350px] md:w-[500px] rounded-lg py-4 font-semibold hover:font-bold shadow-2xl shadow-black"
                    onChange={keyfileUploader}
                  >
                    <label
                      htmlFor="dataFile2"
                      className="block cursor-pointer mx-4 p-16 border-dashed border-white-500 border-4 hover:border-8"
                    >
                      <input type="file" id="dataFile2" className="hidden" />
                      <div className="flex flex-col items-center justify-center text-2xl md:text-3xl w-[120%] md:w-[100%] text-white">
                        <ImFolderUpload className="w-[80px] h-[80px]" />{" "}
                        <p className="flex items-center mx-2 ">
                          upload key file
                        </p>{" "}
                      </div>
                    </label>
                  </div>
                )}
              </div>
            )}
            {/* marks apply  */}
            {dataHeaders && keyHEaders && (
              <div className="w-[100%] ">
                {dataHeaders && keyHEaders && <MarksApply></MarksApply>}
                {dataHeaders && keyHEaders && (
                  <SubjectWiseMarkApply></SubjectWiseMarkApply>
                )}
              </div>
            )}
          </div>
          {dataHeaders && keyHEaders && (
            <OutPutHeaders></OutPutHeaders>

            // <div className="h-auto border-2 flex w-[20vw] min-w-[300px] max-[1020px]:w-[100%] mb-[70px]">
            //   <div className="mx-2 w-[100%]">
            //   </div>
            // </div>
          )}
        </div>
      </div>

      {uploadingStatusModalOpen && (
        <SavingLoaderModal
          status={uploadingFileStatus}
          uploadingPercentage={uploadingFilesPercentage}
          downlaodingPercentage={downloadingFilesPercentage}
          closeModal={() => {
            
            setUploadingModalOpen(false);
          }}
        ></SavingLoaderModal>
      )}
    </>
  );
};

export default UploadDataFile;
