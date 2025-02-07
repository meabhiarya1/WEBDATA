import React from "react";

const ButtonCsvSection = ({
  currentIndex,
  csvData,
  max,
  correctionData,
  zoomInHandler,
  onInialImageHandler,
  zoomOutHandler,
  currentImageIndex,
  imageUrls,
}) => {

  return (
    <div className="flex justify-between ">
      <h3 className="px-5 text-lg font-semibold py-3 text-white">
        Data No : {currentIndex} out of {max}
      </h3>
      <div className="flex justify-center my-3">
        <button
          onClick={zoomInHandler}
          className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-500"
        >
          Zoom In
        </button>

        <button
          onClick={onInialImageHandler}
          className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-500"
        >
          Initial
        </button>
        <button
          onClick={zoomOutHandler}
          className="px-6 py-2 bg-blue-400 text-white rounded-3xl mx-2 hover:bg-blue-500"
        >
          Zoom Out
        </button>
      </div>
      <h3 className=" text-lg font-semibold py-3 text-white px-4">
        Image Name - {correctionData?.previousData?.IMAGE_NAME}
      </h3>
    </div>
  );
};

export default ButtonCsvSection;
