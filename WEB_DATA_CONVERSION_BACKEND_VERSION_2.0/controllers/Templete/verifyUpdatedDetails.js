const UpdatedDetails = require("../../models/TempleteModel/updatedData");

const verifyUpdatedDetails = async (req, res) => {
  try {
    const { updatedId } = req.body;

    // Check if updatedId is provided
    if (!updatedId) {
      return res.status(400).json({ error: "Updated ID is required" });
    }

    // Find the record by primary key
    const updateInfo = await UpdatedDetails.findByPk(updatedId);

    // If the record is not found, send a 404 response
    if (!updateInfo) {
      return res.status(404).json({ error: "Updated details not found" });
    }

    // Mark as verified and save the changes
    updateInfo.verified = true;
    await updateInfo.save();

    // Send a success response
    res.status(200).json({ message: "Updated details verified successfully" });
  } catch (error) {
    console.error("Error verifying updated details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = verifyUpdatedDetails;
