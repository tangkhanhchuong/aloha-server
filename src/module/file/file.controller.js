const fileService = require('./file.service');

const fileController = {
  upload: async (req, res, next) => {
    try {
      const { files } = await fileService.upload({
        uploadedFiles: req.files,
      });

      return res.json({
        msg: 'Files uploaded !',
        files,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = fileController;
