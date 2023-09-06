const errorHandler = (err, req, res, next) => {
	if (!err.status) {
		err.status = 500
	}
	return res.status(err.status).json({ msg: err.message })
}

module.exports = errorHandler