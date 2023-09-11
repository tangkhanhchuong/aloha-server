const router = require('express').Router()

const fileController = require('../controllers/file.controller')
const { uploadToS3 } = require('../helpers/s3')
const auth = require('../middleware/auth')

router.post('/upload', auth, uploadToS3.array('files'), fileController.upload)

module.exports = router