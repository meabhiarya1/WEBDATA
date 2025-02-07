import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdDataSaverOn } from "react-icons/md";
import { REACT_APP_IP } from "../../services/common";
import { toast } from "react-toastify";

const CorrectionField = ({
  correctionData,
  setCorrectionData,
  currentIndex,
  imageFocusHandler,
  onNextHandler,
  maximum,
}) => {
  // const [inputValues, setInputValues] = useState("");
  const taskId = JSON.parse(localStorage.getItem("taskdata")).id;
  const token = JSON.parse(localStorage.getItem("userData"));
  const [filteredData, setFilterData] = useState(
    correctionData?.previousData?.DATA
  );

  // const filteredData = correctionData?.previousData?.DATA
  const PRIMARY = correctionData?.previousData?.PRIMARY;
  const PRIMARY_KEY = correctionData?.previousData?.PRIMARY_KEY;

  const [inputValue, setInputValue] = useState({});

  useEffect(() => {
    // When filteredData or PRIMARY changes, update the input values
    const initialValues = filteredData.reduce((acc, dataItem) => {
      const key = `${PRIMARY?.trim()}-${dataItem?.COLUMN_NAME?.trim()}`;
      acc[key] = dataItem.CORRECTED || ""; // Default to empty string if CORRECTED is undefined
      return acc;
    }, {});
    setInputValue(initialValues);
  }, [filteredData, PRIMARY]);
  useEffect(() => {
    setFilterData(correctionData?.previousData?.DATA);
  }, [correctionData?.previousData?.DATA]);
  useEffect(() => {}, []);
  // console.log(inputValue);
  const handleInputChange = (e, key) => {
    setInputValue((prevValues) => ({
      ...prevValues,
      [key]: e.target.value,
    }));
  };
  const onUpdateHandler = async () => {
    const updates = Object.entries(inputValue).map(([key, correctedValue]) => {
      const [primary, columnName] = key.split("-");
      return {
        PRIMARY: primary,
        PRIMARY_KEY,
        CORRECTED: correctedValue, // Allow empty values
        COLUMN_NAME: columnName,
      };
    });

    if (updates.length === 0) return; // Ensure there are values to update
    try {
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/csvUpdateData/${taskId}/batch`,
        updates,
        {
          headers: {
            token: token,
          },
        }
      );

      // Update the local state with the new corrected values
      setCorrectionData((prevState) => {
        const updatedData = prevState?.previousData?.DATA?.map((item) => {
          const update = updates.find(
            (u) =>
              u?.PRIMARY?.trim() === item?.PRIMARY?.trim() &&
              u?.COLUMN_NAME?.trim() === item?.COLUMN_NAME?.trim()
          );
          if (update) {
            return { ...item, CORRECTED: update?.CORRECTED };
          }
          return item;
        });

        return {
          ...prevState,
          previousData: {
            ...prevState?.previousData,
            DATA: updatedData,
          },
        };
      });
      if (currentIndex !== maximum) {
        setInputValue({});
      }
      console.log(response.data);
      toast.success("Corrected Value is Updated");
      onNextHandler("next", currentIndex);
    } catch (error) {
      console.error("Error updating data:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  // console.log(filteredData);
  const errorData = filteredData?.map((dataItem, index) => {
    const key = `${PRIMARY?.trim()}-${dataItem?.COLUMN_NAME?.trim()}`;
    // const updatedValue = dataItem.CORRECTED||"Null";

    return (
      <div key={index} className="flex">
        <div className="py-2 px-4 border-b w-1/5">
          {correctionData?.previousData?.PRIMARY}
        </div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.COLUMN_NAME}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.FILE_1_DATA}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.FILE_2_DATA}</div>
        <div className="py-2 px-4 border-b w-1/5 flex space-x-2">
          <input
            type="text"
            className="w-full border rounded-xl py-1 px-2 shadow"
            value={inputValue[key] || ""}
            onChange={(e) => handleInputChange(e, key)}
            onFocus={() => imageFocusHandler(dataItem.COLUMN_NAME)}
          />

          {/* <div className="flex justify-center items-center">
            <MdDataSaverOn
              className="text-2xl text-teal-600"
              onClick={() =>
                onUpdateHandler(
                  PRIMARY?.trim(),
                  dataItem?.COLUMN_NAME?.trim()
                )
              }
            />
          </div> */}
        </div>
      </div>
    );
  });

  return (
    <div className="mx-4 bg-white my-6 px-4 py-4 rounded-md">
      <div className="flex justify-between mb-6 mt-2">
        <h2 className="text-xl mx-4 font-bold pt-1 text-blue-500 ">{`${correctionData?.previousData?.PRIMARY_KEY} (Primary Key)`}</h2>
        <button
          className="px-6 py-2 bg-teal-600 rounded-lg text-white"
          onClick={onUpdateHandler}
        >
          Update
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white">
          <div>
            <div className="flex text-center">
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Serial no.
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Field name
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                File 1
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                File 2
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Corrected Data
              </div>
            </div>
          </div>
          <div className="h-[160px] overflow-y-auto text-center">
            {errorData}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionField;
