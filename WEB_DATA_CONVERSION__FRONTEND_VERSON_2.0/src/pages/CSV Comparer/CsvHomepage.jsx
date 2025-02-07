import Customselect from "../../UI/Customselect";
import Input from "../../UI/Input";
import { Fab, CircularProgress, cardActionsClasses } from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import OptimisedList from "../../UI/OptimisedList";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import dataContext from "../../Store/DataContext";
import axios from "axios";
import { useNavigate } from "react-router";
import classes from "./CSVHompage.module.css";
import { REACT_APP_IP } from "../../services/common";
import LoadingButton from "@mui/lab/LoadingButton";
import ModalWithLoadingBar from "../../UI/Modal";
import MultList from "../../UI/MultList";

import NewSelect from "../../UI/NewSelect";

const CsvHomepage = () => {
  const [loading, setLoading] = useState(false);
  const dataCtx = useContext(dataContext);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const token = JSON.parse(localStorage.getItem("userData"));
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    dataCtx.addToCsvHeader([]);
  }, []);
  
  useEffect(() => {
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = "auto";
    };
  }, []);
  


  const compareHandler = () => {
    const {
      primaryKey = "",
      skippingKey = "",
      firstInputFileName = "",
      secondInputFileName = "",
      uploadZipImage = [],
      fileId = "",
      firstInputCsvFiles = [],
      imageColName = "",
      formFeilds = [],
    } = dataCtx;

    if (secondInputFileName.length === 0) {
      alert("Please Select template then select second CSV file");
      return;
    }

    if (dataCtx.uploadZipImage.length === 0) {
      alert("Please select template then select image zip file");
      return;
    }
    
    if (firstInputCsvFiles.length === 0) {
      alert("Choose first CSV file");
      return;
    }
    
    if (primaryKey === "") {
      alert("Please select primary key");
      return;
    }

    if (imageColName === "") {
      alert("Please select image column name");
      return;
    }

    const sendRequest = async () => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("firstInputCsvFile", firstInputCsvFiles);
        formData.append("zipImageFile", uploadZipImage);
        formData.append("fileId", fileId);
        formData.append("firstInputFileName", firstInputFileName);
        formData.append("secondInputFileName", secondInputFileName);
        formData.append("primaryKey", primaryKey);
        formData.append("skippingKey", skippingKey);
        formData.append("imageColName", imageColName);
        formData.append("formFeilds", formFeilds);

        const response = await axios.post(
          `http://${REACT_APP_IP}:4000/compareData`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: token,
            },
            onUploadProgress: (progressEvent) => {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentage);
            },
          }
        );
        setLoading(false);
        navigate(`/comparecsv/assign_operator/${selectedTemplate}`, {
          state: response.data,
        });
      } catch (err) {
        if (err.response && err.response.data) {
          const alertmsg = err.response.data.err;
          alert(`Error Occured : ${alertmsg}`);
          console.log(err.response.data.err);
        }
       setLoading(false)
      }
    };
    sendRequest();
  };

  return (
    <>
      <main
        className={`flex flex-col gap-5 bg-white rounded-md bg-gradient-to-r from-blue-500 to-blue-500 ${classes.homepage}`}
      >
        <div
          className={`flex flex-col border-dashed pt-24 px-5 rounded-md xl:w-5/6 justify-center self-center ${classes.innerBox}`}
        >
          <h1 className="text-center mb-6 text-white text-2xl font-bold">
            MATCH AND COMPARE DATA
          </h1>
          <div className="flex flex-row justify-between  gap-10 mb-6">
            <NewSelect
              label="Select Template"
              onTemplateSelect={setSelectedTemplate}
            />
            <NewSelect
              label="Select Csv Files 2"
              state="second"
              selectedTemplate={selectedTemplate}
            />
          </div>
          <div className="flex flex-row justify-between  gap-10 mb-6">
            <NewSelect
              label="Select Zip Files"
              state="third"
              selectedTemplate={selectedTemplate}
            />
            <Input label="Select Csv Files 1" state="first" type="text/csv" />
          </div>
          <div className="flex flex-row justify-between  gap-10 mb-6">
            <div className="w-1/2 text-white">
              <Customselect label="Select Primary Key" className="text-white" />
            </div>
            <div className="w-1/2">
              <Customselect label="Select Image Column" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center  gap-10">
            <div className="bg-opacity-95 border pl-2 pb-2  bg-white rounded sm:w-1/3 ">
              <div className="flex flex-row pt-2 pb-2 justify-between self-center ">
                <p className="text-sm font-semibold align-bottom self-center ">
                  Select Key For Skipping Comparison
                </p>
                <Button>Select All</Button>
              </div>
              <OptimisedList />
            </div>
            <div className="bg-opacity-95 border pl-2 pb-2  bg-slate-100 rounded sm:w-1/3 ">
              <div className="flex flex-row  pt-2 pb-2 justify-between self-center ">
                <p className="text-sm font-semibold align-bottom self-center ">
                  Select Form Feilds For Mult or Blank
                </p>
                <Button>Clear All</Button>
              </div>
              <MultList />
            </div>
            <div className="flex self-end">
              <LoadingButton
                color="primary"
                onClick={compareHandler}
                loading={loading}
                loadingPosition="start"
                startIcon={
                  <CompareArrowsIcon size={24} sx={{ marginRight: "8px" }} />
                }
                variant="contained"
              >
                Compare And Match
              </LoadingButton>
            </div>
          </div>
          <ModalWithLoadingBar
            isOpen={loading}
            onClose={() => {}}
            progress={progress}
            message="Comparing and matching the files..."
          />
        </div>
      </main>
    </>
  );
};

export default CsvHomepage;
