const { getPresignedUrl } = require("../middleware/s3")

const fileCtrl = {
  upload: async (req, res) => {
    if (!req.files) {
      res.status(404).json({msg: 'Files not found !'})
    }
    const uploadedFiles = []
    for (let { key } of req.files) {
      const url = await getPresignedUrl(key)
      uploadedFiles.push({ key, url })
    }
    res.json({
      msg: 'Files uploaded !',
      files: uploadedFiles
    })
  },
}

module.exports = fileCtrl