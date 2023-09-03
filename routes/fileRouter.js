const router = require('express').Router()
const fileCtrl = require('../controllers/fileCtr')
const { uploadSingleFile } = require('../middleware/upload')

router.post('/upload', uploadSingleFile, fileCtrl.upload)

module.exports = router