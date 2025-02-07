const MappedData = require("../../models/TempleteModel/mappedData");

const getMappedData = async (req, res) => {
  const templateId = req.params.id;

  try {
    const alldata = await MappedData.findAll({
      where: { templeteId: templateId },
    });

    // Transform the data into a key-value object
    const transformedData = alldata.reduce((acc, item) => {
      const { key, value } = item.dataValues;
      acc[key] = value;
      return acc;
    }, {});

    // console.log(transformedData);
    res.status(200).json(transformedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getMappedData;
