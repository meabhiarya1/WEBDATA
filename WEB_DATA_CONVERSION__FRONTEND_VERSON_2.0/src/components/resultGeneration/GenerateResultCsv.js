import React, { useContext, useState } from "react";

import { toast } from "react-toastify";
import ResultGenerationContext from "../../Store/ResultGenerationContext";
import SavingLoaderModal from "./SavingLoaderModal";

const GenerateResultCsv = (props) => {
  const ctx = useContext(ResultGenerationContext);
  const [statusType, setStatusType] = useState("Downloading");
  const [downloadingModalOpen, setDownloadingModalOpen] = useState(false);
  const [downloadingFileData, setDownloadingFileData] = useState({
    start: 0,
    end: 0,
  });
  const dataHeaders = ctx.dataHeaders;
  const keyHEaders = ctx.keyHeaders;
  const mappedKey = ctx.paperMappedKey;
  const subjectWiseMarking = ctx.subjectMarkings;
  let subjectHeaders = [];
  let finalAnswers = [];
  let headers = [];

  const resultGenerator = () => {
    subjectHeaders = [];
    finalAnswers = [];
    headers = [];
    if (subjectWiseMarking == 0) {
      headers = [
        "notAttempted",
        "wrongAnswer",
        "correctAnswer",
        "total_Score",
        "remark",
      ];
    } else {
      headers = ["total", "remark"];
    }

    // setKeyVisble(true);
    if (mappedKey == null) {
      toast.error("please select mapped key");
      return;
    }
    if (ctx.paperMarkings.start === null && subjectWiseMarking.length == 0) {
      toast.error("please select start question");
      return;
    }
    if (ctx.paperMarkings.end <= 0) {
      toast.error("please select valid value for total questions");
      return;
    }
    if (ctx.paperMarkings.correctPoint < 0) {
      toast.error("correct marks value should be positive number ");
      return;
    }
    if (ctx.paperMarkings.wrongPoint < 0) {
      toast.error("wrong marks value should be positive number ");
      return;
    }
    setDownloadingModalOpen(true);
    setDownloadingFileData({
      start: 0,
      end: dataHeaders?.length - 1 || "null",
    });
    setStatusType("Downloading");
    // const keyHEadersLength = keyHEaders.length;
    // const dataHeaderLength = dataHeaders.length;
    const myWorker = new Worker(
      new URL("ResultGeneratorWorker.js", import.meta.url)
    );

    myWorker.onmessage = function (e) {
      const { type, processedData, headersData, finalAnswers } = e.data;

      if (type === "progress") {
        setDownloadingFileData({
          start: processedData,
          end: dataHeaders?.length - 1 || "null",
        });
      } else {
        const data = finalAnswers;
        let fileNAme = `${ctx.uploadFiles[0].replace(".csv", "")}_result.csv`;
        headers = [...props.headers,  ...headersData];

        const csvData = convertArrayOfObjectsToCSV(data, headers);
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileNAme);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setStatusType("Downloaded");
        myWorker.terminate();
      }
    };
    myWorker.onerror = function (error) {
      console.error("error in result error:", error);
      toast.error("An error occurred during result generation.");
      setDownloadingModalOpen(false);
      myWorker.terminate();
    };
    myWorker.postMessage({
      ctx: {
        paperMarkings: ctx.paperMarkings, // Only pass required fields
      },
      dataHeaders,
      keyHEaders,
      mappedKey,
      subjectWiseMarking,
      props,
      headers,
    });
  };
  const convertArrayOfObjectsToCSV = (data, headersData) => {
    const headerLine = headersData.join(",");
    const csv = data.map((item) => {
      return headersData
        .map((header) => {
          return item[header];
        })
        .join(",");
    });
    return [headerLine, ...csv].join("\n");
  };
  return (
    <>
      {" "}
      <div className="text-center mt-2 flex flex-row min-[1103px]:flex-col  justify-center">
        <div className="text-center mt-4 ">
          <button
            className="animate__animated animate__bounceInLeft animate__delay-4s group inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 mx-4 shadow-md shadow-blue-300"
            onClick={resultGenerator}
          >
            <span className="block rounded-full bg-white px-8 py-3 text-md font-bold group-hover:bg-transparent hover:text-white text-black">
              Generate Result
            </span>
          </button>
        </div>
        {/* <div className="text-center mt-4 ">
        <a
          className="animate__animated animate__bounceInLeft animate__delay-5s group inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75 mx-4 shadow-md shadow-blue-300"
          href="#"
        >
          <span className="block rounded-full bg-white px-8 py-3 text-sm font-bold group-hover:bg-transparent hover:text-white text-black">
            cancel
          </span>
        </a>
      </div> */}
      </div>
      {downloadingModalOpen && (
        <SavingLoaderModal
          status={statusType}
          data={downloadingFileData}
          closeModal={() => {
            setDownloadingModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default GenerateResultCsv;
