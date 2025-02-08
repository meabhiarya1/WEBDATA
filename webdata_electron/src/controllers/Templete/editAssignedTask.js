const AssignData = require("../../models/TempleteModel/assigndata");

const editAssignedTask = async (req, res) => {
  const { assignedTaskId, userId } = req.body;

  try {
    // Update the userId for the record with the specified assignId
    const [updated] = await AssignData.update(
      { userId: userId }, // Update the userId
      { where: { id: assignedTaskId } } // Filter by assignId
    );

    if (updated) {
      // Fetch the updated task to return in the response
      const updatedTask = await AssignData.findOne({ where: { id: assignedTaskId } });
      res.status(200).json({ message: "Updated successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = editAssignedTask;
