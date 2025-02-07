const File = require("../../models/TempleteModel/files")


const getCsvInfoData = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await File.findAll({ where: { templeteId: id } })
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = getCsvInfoData
