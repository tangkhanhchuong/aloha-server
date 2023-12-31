const { StatusCodes } = require('http-status-codes');

const { getPresignedUrl } = require('../../core/aws/s3');
const { FILE } = require('../../shared/message');

const fileService = {
  upload: async ({ uploadedFiles }) => {
    if (!uploadedFiles) {
      const err = new Error(FILE.FILE_MISSED);
      err.status = StatusCodes.BAD_REQUEST;
      throw err;
    }
    const files = [];
    for (let { key } of uploadedFiles) {
      const url = await getPresignedUrl(key);
      files.push({ key, url });
    }
    return { files };
  },
};

module.exports = fileService;
