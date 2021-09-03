const Router = require('koa-router')
const THController = require('../controllers/THController')

const router = new Router({
	prefix: '/api',
})

router.get('/all', THController.getAll)
router.get('/latest', THController.getLatest)
router.post('/insert', THController.insertData)

module.exports = router
