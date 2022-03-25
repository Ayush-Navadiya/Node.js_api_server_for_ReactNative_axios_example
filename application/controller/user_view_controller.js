let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {exec} = require("child_process");

const baseurl = 'http://localhost:3000/';


exports.index_page = async (req, res, next) => {
        let page_data = {};
        page_data.title = 'Login';
        page_data.base_url = baseurl;
        res.render('index', page_data);
};
