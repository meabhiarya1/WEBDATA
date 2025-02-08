const MetaData = require("../../models/TempleteModel/metadata");
const Templete = require("../../models/TempleteModel/templete");
const ImageData = require("../../models/TempleteModel/templeteImages");
const fs = require("fs").promises;
const path = require("path");

const editTemplateData = async (req, res) => {
  const templateId = req.params.id;

  const userRole = req.role;
  // console.log(userRole);
  if (userRole !== "Admin") {
    return res
      .status(500)
      .json({ message: "You don't have access for performing this action" });
  }

  try {
    const template = await Templete.findByPk(templateId, {
      include: [ImageData, MetaData],
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const imagesDir = path.join(__dirname, "..", "..", "TempleteImages");

    const imagePaths = await Promise.all(
      template.imagedatapaths.map(async (imageData) => {
        const imagePath = path.join(imagesDir, imageData.imagePath);
        try {
          const imageBuffer = await fs.readFile(imagePath);
          const base64Image = Buffer.from(imageBuffer).toString("base64");
          return `data:image/jpeg;base64,${base64Image}`;
        } catch (error) {
          console.error("Error reading image file:", error);
          return null; // Return null for images that couldn't be read
        }
      })
    );

    // Filter out null values from imagePaths (images that couldn't be read)
    const filteredImagePaths = imagePaths.filter((path) => path !== null);

    res.status(200).json({ imagePaths: filteredImagePaths, template });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = editTemplateData;
