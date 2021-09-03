const Koa = require('koa')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const router = require('./routers/THRouter')
const app = new Koa()
mongoose
	.connect(process.env.DB + '?retryWrites=true&w=majority', {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('MongoDB Atlas connected!')
	})
	.catch((err) => {
		console.log('Error: ', err)
	})
app.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())
	.use(koaBody({ multipart: true }))
app.listen(process.env.PORT || 9000)
console.log('app started at port 9000...')
