let express = require('express');
let router = express.Router();

let userfunc_controller = require('../application/models/user_table_model');



router.route('/user_list').post(userfunc_controller.userlist);
router.route('/user_delete').post(userfunc_controller.userdelete);
router.route('/user-update').post(userfunc_controller.userupdate);
router.route('/user_status').post(userfunc_controller.userstatus);
router.route('/user_details').post(userfunc_controller.userindex);
router.route('/user-new').post(userfunc_controller.usercreate);
router.route('/get_users').get(userfunc_controller.getusers);



module.exports = router;