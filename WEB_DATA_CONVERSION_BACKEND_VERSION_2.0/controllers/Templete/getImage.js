const fs = require("fs").promises;
const path = require("path");
const Assigndata = require("../../models/TempleteModel/assigndata");

const getImage = async (req, res, next) => {
  const userPermission = req.permissions;
  if (!userPermission.dataEntry) {
    return res.status(403).json({ message: "User not authorized" });
  }

  //this getimage controller only updating the currentindex not responding the images it is served as staticallly

  try {
    const { imageNameArray, id, rowIndex } = req.body;

    // if (
    //   !imageNameArray ||
    //   !Array.isArray(imageNameArray) ||
    //   imageNameArray.length === 0
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: "ImageNameArray is missing or empty" });
    // }

    const assigndataInstance = await Assigndata.findOne({ where: { id } });

    if (!assigndataInstance) {
      return res.status(400).json({ error: "CurrentIndex mismatched with ID" });
    }

    assigndataInstance.currentIndex = rowIndex;
    await assigndataInstance.save();

    const errors = [];
    // const imageReadPromises = imageNameArray.map(async (imageName) => {
    //   if (!imageName) {
    //     errors.push("ImageName is missing");
    //     return null; // Handle missing image name
    //   }

    //   const sourceFilePath = path.join(
    //     __dirname,
    //     "..",
    //     "..",
    //     "extractedFiles",
    //     imageName
    //   );
    //   return sourceFilePath;
    //   // console.log(sourceFilePath)

    //   // try {
    //   //   return await fs.access(sourceFilePath); // Check if the file exists
    //   // const image = await fs.readFile(sourceFilePath); // Read the file
    //   // return { base64Image: image.toString("base64") }; // Convert to Base64
    //   // } catch (error) {
    //   //   errors.push(`File not found: ${imageName}`);
    //   //   return null; // Handle file not found
    //   // }
    // });

    // const arrayOfImages = await Promise.all(imageReadPromises);

    // Filter out any null values (failed reads)
    // const filteredImages = arrayOfImages.filter(image => image !== null);

    if (errors.length > 0) {
      return res.status(404).json({ errors });
    }
    res.status(200).json({ message: "CurrentIndex Updated Successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getImage;
