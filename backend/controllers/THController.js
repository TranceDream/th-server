const THData = require('../models/THData')

class THController {
	async getAll(ctx) {
		const data = await THData.find()
		const result = {
			code: 200,
			data,
		}
		ctx.body = result
	}

	async getLatest(ctx) {
		const data = await THData.find().sort({ date: 'desc' }).limit(1)
		const result = {
			code: 200,
			data,
		}
		ctx.body = result
	}

	async insertData(ctx) {
		var datetime = new Date()
		var requestBody = ctx.request.body
		requestBody.date = datetime
		const data = await new THData(requestBody).save()
		const result = {
			code: 200,
			data,
		}
		console.log(ctx.request.body)
		ctx.body = result
	}
}

module.exports = new THController()
