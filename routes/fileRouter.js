const router = require('express').Router()

const fileCtrl = require('../controllers/fileCtr')
const { uploadToS3 } = require('../middleware/s3')

router.post('/file/upload', uploadToS3.array('files'), fileCtrl.upload)

module.exports = router