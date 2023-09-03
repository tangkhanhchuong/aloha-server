const fs = require("fs")
const multer = require("multer")
const AWS = require("aws-sdk")

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY

//multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "storage/")
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + ".png")
  },
})
const upload = multer({ dest: "storage/", storage })

// uploads a file to s3
const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
})

function uploadFileToS3(file, directory = '') {
  const fileStream = fs.createReadStream(file.path)

  let key = file.filename
  if (directory !== '') {
    key = directory + key
  }
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: key
  }

  return s3.upload(uploadParams).promise()
}

async function getFileStreamFromS3(fileKey) {
  try {
    const params = {
      Key: fileKey,
      Bucket: bucketName,
    }
    await s3.headObject(params).promise()
    const s3Obj = s3.getObject(params)
    return s3Obj.createReadStream()
  } catch (err) {
    return null
  }
}

const uploadSingleFile = upload.single("files")

module.exports = {
  uploadSingleFile,
  uploadFileToS3,
  getFileStreamFromS3,
}
