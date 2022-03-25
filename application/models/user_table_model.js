let mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {exec} = require("child_process");

let User = require('../schema/user_schema');

exports.userlist = (req, res, next) => {
    const pipelines = [];
    const draw = req.body.draw;
    const order = req.body.order;
    const start = req.body.start;
    const length = req.body.length;
    const search = req.body.search;

    let valid_col = [];
    valid_col[0] = '_id';
    valid_col[1] = 'fname';
    valid_col[2] = 'created_date';
    valid_col[3] = 'status';
    valid_col[4] = '_id';

    let order_col = order[0]['column'];
    let order_dir = order[0]['dir'];
    if (order_dir === 'asc') {
        order_dir = 1;
    } else {
        order_dir = -1;
    }
    pipelines.push({
        $match: {
            'is_deleted': 0,
        }
    });

    let sort = {};
    sort[valid_col[order_col]] = order_dir;
    pipelines.push({
        $sort: sort
    });
    if (search.value !== '') {
        let search_tx = [];
        for (let x = 0; x < valid_col.length; x++) {
            let search_ele = {};
            search_ele['$regex'] = search.value;
            search_ele['$options'] = 'i';
            let search_ele2 = {};
            search_ele2[valid_col[x]] = search_ele;
            search_tx.push(search_ele2);
        }
        pipelines.push({
            $match: {
                $or: search_tx
            }
        });
    }
    const aggr_array_data = [];
    const aggr_array_total = [];

    for (let i = 0; i < pipelines.length; i++) {
        aggr_array_data.push(pipelines[i]);
        aggr_array_total.push(pipelines[i]);
    }

    aggr_array_data.push({
        $skip: parseInt(start)
    });
    aggr_array_data.push({
        $limit: parseInt(length)
    });

    let facet_aggr_array = [
        {
            $facet: {
                "data_set": aggr_array_data,
                "data_total": aggr_array_total,
            }
        }
    ];

    User.aggregate(facet_aggr_array).exec(function (err, user) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        } else {
            res.json({
                status: "success",
                message: "Data retrieved successfully",
                data: user[0].data_set,
                draw: draw,
                recordsTotal: user[0].data_total.length,
                recordsFiltered: user[0].data_total.length,
            });
        }
    });
};


exports.userdelete = (req, res, next) => {
    try {
        User.findById(req.body.id, (err, user) => {
            if (!err) {
                user.is_deleted = 1;
                user.save((err) => {
                    if (!err) {
                        res.json({
                            status: "success",
                            message: "User Deleted Successfully!"
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.userstatus = async (req, res, next) => {
    try {
        User.findById(req.body.id, (err, user) => {
            if (!err) {
                status = user.status;
                if(status == 1)
                {
                    user.status = 0;
                }
                else
                {
                    user.status = 1;
                }
                user.save((err) => {
                    if (!err) {
                        res.json({
                            status: 'success',
                            message: "Status Updated"
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: err
                        })
                    }
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.userupdate = async (req, res) => {
        try{
            User.findById(req.body.id,async (err, user) => {
                if(user.mobile_no == req.body.mno) {
                    user.fname = req.body.fname;
                    user.lname = req.body.lname;
                    user.email_id = req.body.email;
                    user.mobile_no = req.body.mno;
                    user.location = req.body.city;
                    user.address = req.body.address;
                    user.gender = req.body.gender;

                    user.save((err) => {
                        if (!err) {
                            res.json({
                                status: 'success',
                                message: 'Account successfully Updated!',
                                data: user,
                            })
                        } else {
                            res.json({
                                status: 'error',
                                message: 'Account failed to Create!',
                                data: err
                            })
                        }
                    });
                }
                else
                {
                    try {
                        const phone_number = req.body.mno;
                        let chkPhone = await User.findOne({mobile_no: phone_number});
                        if (chkPhone !== null) {
                            throw new Error("Phone Number Already Register!");
                        }
                        User.findById(req.body.id, async (err, user) => {
                            user.fname = req.body.fname;
                            user.lname = req.body.lname;
                            user.email_id = req.body.email;
                            user.mobile_no = req.body.mno;
                            user.location = req.body.city;
                            user.address = req.body.address;
                            user.gender = req.body.gender;

                            user.save((err) => {
                                if (!err) {
                                    res.json({
                                        status: 'success',
                                        message: 'Account successfully Updated!',
                                        data: user,
                                    })
                                } else {
                                    res.json({
                                        status: 'error',
                                        message: 'Account failed to Create!',
                                        data: err
                                    })
                                }
                            });
                        })
                    } catch (e){
                        res.json({
                            status: 'error',
                            message: e.message
                        })
                    }
                }
            })
        } catch (e){
            res.json({
                status: 'error',
                message: e.message
            })
        }
};


exports.userindex = (req, res) => {
    try {
        User.findById(req.body.id, (err, user) => {
            if (!err) {
                res.json({
                    status: 'success',
                    message: 'User data retrieved!',
                    data: user
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.usercreate = async (req, res) => {
    try{
        const phone_number = req.body.mno;
        let chkPhone = await User.findOne({mobile_no: phone_number});
        if (chkPhone !== null) {
            throw new Error("Phone Number Already Register!");
        }
        let user = new User;
        user.fname = req.body.fname;
        user.lname = req.body.lname;
        user.email_id = req.body.email;
        user.mobile_no = req.body.mno;
        user.location = req.body.city;
        user.address = req.body.address;
        user.gender = req.body.gender;

        user.save((err) => {
            if (!err) {
                console.log("Success");
                res.json({
                    status: 'success',
                    message: 'Account created successfully!',
                    data: user,
                })
            } else {
                console.log(err);
                res.json({
                    status: 'error',
                    message: 'Account failed to register! Contact administration!',
                    data: err
                })
            }
        })
    } catch (e) {
        console.log(e);
        res.json({
            status: 'error',
            message: e.message
        })
    }
};


exports.getusers = (req, res) => {
    try {
        User.find({is_deleted: 0}, (err, user) => {
            if (!err) {
                res.json({
                    status: 'success',
                    message: 'User data retrieved!',
                    data: user
                })
            } else {
                res.json({
                    status: 'error',
                    message: err
                })
            }
        })
    } catch (e) {
        res.json({
            status: 'error',
            message: e.message
        })
    }
};