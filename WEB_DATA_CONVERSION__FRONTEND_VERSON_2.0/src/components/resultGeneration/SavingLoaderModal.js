import React from "react";
import { IoMdClose } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import uploadImg from "../../assets/images/data-cloud.gif";
import rejectedImg from "../../assets/images/warning.gif";
import downloadedImg from "../../assets/images/verified.gif";
import downloadingImg from "../../assets/images/cloud.gif";
import iosLogo from "../../assets/images/IOS_LOGO.png";
const SavingLoaderModal = (props) => {
  // console.log(props)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-700"
      // onClick={props.closeModal} // Close modal when clicking outside the modal content
    >
      <div
        className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full max-w-md p-6 "
        // onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between  border-gray-400 border-b-2 p-2">
          {" "}
          <div className="flex">
            {" "}
            <img src={iosLogo} className="w-[40px]"></img>
            <p className="text-[1.2rem] mx-2 font-semibold text-blue-500">
              Result Generator Tool
            </p>{" "}
          </div>
          {props.status === "Downloaded" && (
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
              onClick={() => {
                props.closeModal();
              }}
            >
              <IoMdClose className="w-[20px] h-[20px]" />
            </button>
          )}
        </div>

        <div className="p-4 md:p-5 text-center">
          <div className="flex justify-center items-center flex-col">
            {props.status !== "Accepted" && (
              <img
                src={
                  (props.status === "Pending" && uploadImg) ||
                  (props.status === "Rejected" && rejectedImg) ||
                  (props.status === "Downloading" && downloadingImg) ||
                  (props.status === "Downloaded" && downloadedImg)
                }
                //   src={
                //     (props.success === "pending" && loader) ||
                //     (props.success === "success" && success) ||
                //     (props.success === "error" && errorImg)
                //   }
                className="w-[80px] h-[80px]"
              />
            )}

            {props?.status === "Pending" &&
              props?.uploadingPercentage < 100 && (
                <>
                  <p>Uploading :</p>
                  <p className="font-semibold">
                    {props?.uploadingPercentage}
                    <span>%</span>
                  </p>
                </>
              )}
            {props.status === "Pending" &&
              props?.uploadingPercentage == 100 &&
              props?.downlaodingPercentage <= 100 && (
                <>
                  <p>Extracting :</p>
                  <p className="font-semibold">
                    {props?.downlaodingPercentage}
                    <span>%</span>
                  </p>
                </>
              )}
            {props.status === "Downloading" && (
              <div className="flex ">
                <p>Generating Result :</p>
                <p className="font-semibold">{props?.data.start}</p>
                <p>/</p>
                <p className="font-semibold"> {props?.data.end}</p>
              </div>
            )}
            {props.status === "Downloaded" && (
              <div className="flex ">
                <p>File downloaded SuccessFully</p>
              </div>
            )}
          </div>
          <div className="w-[100%] flex justify-start text-[.9rem] font-semibold pt-2 pb-4">
            <p
              className="w-[100%] text-[1.2rem] text-gray-600"
              style={{ textShadow: "2px 2px 8px gray" }}
            >
              {props?.message}
            </p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default SavingLoaderModal;
