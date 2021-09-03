const { Schema, model } = require('mongoose')
const THSchema = new Schema({
	temperature: Number,
	humidity: Number,
	date: Date,
})

const THData = model("THData", THSchema)

module.exports = THData