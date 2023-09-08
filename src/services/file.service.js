const { getPresignedUrl } = require('../helpers/s3')

const fileService = {
	upload: async ({ uploadedFiles }) => {
		if (!uploadedFiles) {
			const err = new Error('Missing files !')
			err.status = 404
			throw err
		}
		const files = []
		for (let { key } of uploadedFiles) {
			const url = await getPresignedUrl(key)
			files.push({ key, url })
		}
		return { files }
	},
}

module.exports = fileService