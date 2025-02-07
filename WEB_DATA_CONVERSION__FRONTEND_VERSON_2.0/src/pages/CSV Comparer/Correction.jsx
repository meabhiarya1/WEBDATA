import React, { useContext, useEffect, useState } from "react";
import dataContext from "../../Store/DataContext";
import classes from "./Correction.module.css";
import { Button, Tooltip } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Table from "../../UI/Table";
import { useNavigate } from "react-router";
import DownloadIcon from "@mui/icons-material/Download";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { REACT_APP_IP } from "../../services/common";
import axios from "axios";
const Correction = () => {
  const [currIndex, setCurrIndex] = useState(1);
  const [tableData, setTableData] = useState({});
  const [minimum, setMinimum] = useState();
  const [maximum, setMaximum] = useState(0);
  const location = useLocation();
  const [taskId, setTaskId] = useState(
    location.state !== null
      ? location.state.id
      : JSON.parse(localStorage.getItem("taskdata")).id
  );
  const state = 1;
  const token = JSON.parse(localStorage.getItem("userData"));

  const navigate = useNavigate();
  const taskdata = location.state;
  const { imageURL, data } = tableData;

  useEffect(() => {
    const req = async () => {
      const response = await axios.get(
        `http://${REACT_APP_IP}:4000/compareAssigned/${taskId}`,
        {
          headers: {
            token: token,
            currIndex,
          },
        }
      );
      console.log(response,"--------------------")
      setTableData(response.data);
    };
    req();
  }, [currIndex]);
  useEffect(() => {
    const req = async () => {
      const response = await axios.get(
        `http://${REACT_APP_IP}:4000/compareAssigned/${taskId}`,
        {
          headers: {
            token: token,
            currIndex,
          },
        }
      );
  
      setTableData(response.data);
      setMaximum(parseInt(response.data.max));
      setMinimum(parseInt(response.data.min));
      setCurrIndex(parseInt(response.data.currentIndex));
    };
    req();
  }, []);

  useEffect(() => {
    const confirmExit = (e) => {
      // Display a confirmation message
      const confirmationMessage =
        "Are you sure you want to leave this page? Please download corrected CSV before closing this page.";
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    };

    // Add event listener when the component mounts
    window.addEventListener("beforeunload", confirmExit);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", confirmExit);
    };
  }, []); // Empty dependency array to run effect only once on mount

  useEffect(() => {
    const handlePopstate = (e) => {
      // Display a confirmation message
      window.confirm();
      const confirmationMessage = "Are you sure you want to leave this page?";
      if (!window.confirm(confirmationMessage)) {
        // Prevent navigation if the user cancels
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Add event listener when the component mounts
    window.addEventListener("popstate", handlePopstate);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [location]); // Empty dependency array to run effect only once on mount
  // Empty dependency array to run effect only once on mount

  useEffect(() => {
    document.body.style.userSelect = "none";
    return () => {
      // Cleanup function to reset the style when the component unmounts
      document.body.style.userSelect = "auto";
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        const btn = document.getElementById("nextBtn");
        btn.click();
      } else if (event.key === "ArrowLeft") {
        const btn = document.getElementById("prevBtn");
        btn.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const prevHandler = () => {
    setCurrIndex((prev) => {
      if (prev == minimum) {
        return prev;
      } else {
        return prev - 1;
      }
    });
  };

  const nextHandler = () => {
    setCurrIndex((prev) => {
      if (prev == maximum) {
        return prev;
      } else {
        return prev + 1;
      }
    });
  };
  // const convertToCsv = (jsonData) => {
  //   const headers = Object.keys(jsonData[0]);
  //   const csvHeader = headers.join(",") + "\n";
  //   const csvData = jsonData
  //     .map((obj) => {
  //       return headers.map((key) => obj[key]).join(",");
  //     })
  //     .join("\n");
  //   return csvHeader + csvData;
  // };
  const submitHandler = () => {
    const req = async () => {
      const response = await axios.get(
        `http://${REACT_APP_IP}:4000/submitTask/${taskId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      console.log(response);
      toast.success("Downloaded the corrected csv file", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    };
    const result = window.confirm("Are you sure to submit the assigned task ?");
    if (result) {
      req();
    } else {
      return; 
    }
  };

  return (
    <>
      <div
        className={`flex xs:flex-col md:flex-col lg:flex-row  animate-slide-left-to-right ${classes.correction} `}
      >
        {state.length !== 0 && (
          <div className="w-1/3 pt-20">
            <div className={`flex justify-center  ${classes.imgdiv}`}>
              <h1
                className={`font-bold lg:text-2xl md:text-xl sm:text-lg ${classes.imgHead}`}
              >
                Image Name : {data && data["IMAGE_NAME"]}
              </h1>
              <Tooltip
                title="Use mouse scroll wheel to zoom in and zoom out"
                className="cursor-pointer float-right ml-3"
                arrow
              >
                <InfoRoundedIcon />
              </Tooltip>
            </div>
            <div className="overflow-hidden flex justify-center pt-2 ">
              <TransformWrapper defaultScale={1}>
                <TransformComponent>
                  <img
                    src={imageURL}
                    className={`object-contain  ${classes.imgContainer} zoomable-image rounded`}
                    alt="omr sheet"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        )}
        {state.length !== 0 && (
          <div className="w-2/3 pt-20 pr-5">
            <h1 className="text-center text-3xl font-bold m-5">
              {currIndex} of {maximum}
            </h1>
            <div className="pt-5 pl-4 pr-4 pb-3 h-2/3  bg-opacity-15 bg-black rounded mb-5 mr-5">
              {data && <Table data={data} index={currIndex} taskId={taskId} />}
            </div>

            <div className="flex justify-around">
              <Button
                variant="contained"
                startIcon={<ArrowBackIosIcon />}
                onClick={prevHandler}
                id="prevBtn"
              >
                PREV
              </Button>
              <Button
                variant="contained"
                onClick={submitHandler}
                color="secondary"
              >
                SUBMIT TASK
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIosIcon />}
                onClick={nextHandler}
                id="nextBtn"
              >
                NEXT
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Correction;
