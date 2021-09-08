const THData = require('../models/THData')

class THController {
	async getAll(ctx) {
		const data = await THData.find()
		data.sort((a, b) => {
			return a.date.getTime() - b.date.getTime()
		})
		const result = {
			code: 200,
			data,
		}
		ctx.body = result
	}

	async getDataByDate(ctx) {
		var init = new Date(ctx.request.body.date)
		var start = new Date()
		start.setTime(init.getTime())
		var end = new Date()
		end.setTime(start.getTime() + 24 * 60 * 60 * 1000)
		const data = await THData.find({
			date: {
				$gte: start,
				$lte: end,
			},
		}).sort({ date: 'asc' })
		console.log(data)
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
