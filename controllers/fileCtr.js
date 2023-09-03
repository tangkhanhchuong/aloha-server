const fileCtrl = {
  upload: async (req, res) => {
    console.log("Upload")
    console.log(req.files)
    console.log(req.file)
  },
}

module.exports = fileCtrl