var express = require('express');
var router = express.Router();

let userview_controller = require('../application/controller/user_view_controller');

/* GET home page. */
/* Authentication Pages */

/* User authentication pages */
router.route('/').get(userview_controller.index_page);

module.exports = router;