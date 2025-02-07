const UpdatedData = require("../../models/TempleteModel/updatedData");

const updatedDetails = async (req, res) => {
  try {
    const { taskData } = req.body;

    const minIndex = parseInt(taskData.min);
    const maxIndex = parseInt(taskData.max);

    if (!taskData.userId) {
      return res.status(400).json({ error: "User ID not provided" });
    }

    let userData;
    try {
      userData = await UpdatedData.findAll({
        where: {
          userId: taskData.userId,
          fileId: taskData.fileId,
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Database error occurred" });
    }

    if (!userData || userData.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the given user ID" });
    }

    // Structure the response data
    const response = {
      updatedColumn: [],
      previousData: [],
      currentData: [],
      rowIndex: [],
      imageNames: [],
      updatedIds: [],
      isVerified: [],
    };

    userData.forEach((data) => {
      try {
        if (
          data.updatedColumn &&
          data.previousData &&
          data.currentData &&
          data.rowIndex &&
          data.imageNames &&
          data.id 
        ) {
          response.updatedColumn.push(data.updatedColumn);
          response.previousData.push(data.previousData);
          response.currentData.push(data.currentData);
          response.rowIndex.push(data.rowIndex);
          response.imageNames.push(data.imageNames);
          response.updatedIds.push(data.id);
          response.isVerified.push(data.verified);
        }
      } catch (error) {
        return res.status(500).json({ error: "Incomplete data entry found" });
      }
    });
   
    if (response.updatedColumn.length === 0) {
      return res.status(500).json({ error: "No complete data entries found" });
    }

    // Filter the response based on minIndex and maxIndex
    const filteredResponse = {
      updatedColumn: [],
      previousData: [],
      currentData: [],
      rowIndex: [],
      imageNames: [],
      updatedIds: [],
      isVerified: [],
    };
    for (let i = 0; i < response.rowIndex.length; i++) {
      const rowIndexValue = Number(response.rowIndex[i]); // Convert each element to a number

      const adjustedIndex = rowIndexValue + 1;
      if (adjustedIndex >= minIndex && adjustedIndex <= maxIndex) {
        filteredResponse.updatedColumn.push(response.updatedColumn[i]);
        filteredResponse.previousData.push(response.previousData[i]);
        filteredResponse.currentData.push(response.currentData[i]);
        filteredResponse.rowIndex.push(response.rowIndex[i]);
        filteredResponse.imageNames.push(response.imageNames[i]);
        filteredResponse.updatedIds.push(response.updatedIds[i]);
        filteredResponse.isVerified.push(response.isVerified[i]);
      }
    }

    if (filteredResponse.updatedColumn.length === 0) {
      return res
        .status(404)
        .json({ error: "No data entries found within the specified range" });
    }
    return res.json(filteredResponse);
  } catch (error) {
    console.error("Error fetching updated details:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

module.exports = updatedDetails;
