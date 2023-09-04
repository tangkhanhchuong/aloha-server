const router = require('express').Router()

const fileController = require('../controllers/file.controller')
const { uploadToS3 } = require('../middleware/s3')

router.post('/upload', uploadToS3.array('files'), fileController.upload)

module.exports = router