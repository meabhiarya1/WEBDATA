const AssignData = require("../../models/TempleteModel/assigndata");

const errorData = async (req, res) => {
  const assignId = req.params.id;  

  try {
    const data = await AssignData.findOne({ where: { id: assignId } }); // Corrected query

    if (!data) {
      return res.status(404).json({ error: "Data not found" }); // Handle case where no data is found
    }

    return res.status(200).json({ data }); // Send the found data
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = errorData;
