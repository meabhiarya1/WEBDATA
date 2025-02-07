import React from "react";

const   ImageSectionCSV = ({
  imageContainerRef,
  currentImageIndex,
  imageUrls,
  imageRef,
  correctionData,
  zoomLevel,
  selectedCoordintes,
  templateHeaders,
}) => {
  return (
    <div
      ref={imageContainerRef} 
      className="mx-auto bg-white"
      style={{
        position: "relative",
        border: "2px solid gray", 
        width: "48rem",
        height: "23rem",
        overflow: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <img
        src={`http:\\\\localhost:4000\\images\\${correctionData?.imageDirectoryPath}\\${correctionData?.previousData.IMAGE_NAME}`}
        alt="Selected"
        ref={imageRef}
        style={{
          width: "48rem",
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
        }}
        draggable={false}
      />

      {!selectedCoordintes &&
        templateHeaders?.templetedata?.map(
          (data, index) =>
            data.pageNo === currentImageIndex && (
              <div
                key={index}
                style={{
                  border: "3px solid #007bff",
                  position: "absolute",
                  backgroundColor: "rgba(0, 123, 255, 0.2)",
                  left: `${data.coordinateX}px`,
                  top: `${data.coordinateY}px`,
                  width: `${data.width}px`,
                  height: `${data.height}px`,
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              ></div>
            )
        )}
    </div>
  );
};

export default ImageSectionCSV;
