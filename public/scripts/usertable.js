$(document).ready(function () {
    Usertable.init();
});

var dataTable;
let myData = {};
let id = "";
let Usertable = function () {
    dataTable = $('#kt_datatable').DataTable({
        "responsive": true,
        "searchDelay": 500,
        "processing":true,
        "serverSide":true,
        "ajax":{
            url:"api/user_list",
            type:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            data: function (d) {
                return $.extend(d, myData);
            }
        },
        columns: [
            {data: '_id'},
            {data: 'fname'},
            {data: 'created_date'},
            {data: 'status'},
            {data: '_id'},
        ],
        "columnDefs": [
            {
                targets: 0,
                className: 'text-center',
                orderable: true,
                render: function (data, type, full, meta) {
                    var no = meta.row + 1;
                    return no;
                }
            },
            {
                targets: 1,
                className: 'text-left',
                orderable: true,
                render: function (data, type, full, meta) {
                    return data + " " + full.lname;
                }
            },
            {
                targets: 2,
                className: 'text-left',
                orderable:true,
                render: function (data, type, full, meta) {
                    return moment(data).format('MMM, DD YYYY<br>hh:mm A');
                }
            },
            {
                targets: 3,
                className: 'text-left',
                orderable:false,
                render: function (data, type, full, meta) {
                    if(data == 1)
                    {
                        var status = ' <span class="switch switch-outline switch-icon switch-success align-middle justify-content-center">\n' +
                            '    <label>\n' +
                            '     <input type="checkbox" data-name="'+full._id+'" checked name="select" onchange="update_status(this)"/>\n' +
                            '     <span></span>\n' +
                            '    </label>\n' +
                            '   </span>';
                    }
                    else
                    {
                        var status = ' <span class="switch switch-outline switch-icon switch-success align-middle justify-content-center">\n' +
                            '    <label>\n' +
                            '     <input type="checkbox" data-name="'+full._id+'" name="select" onchange="update_status(this)"/>\n' +
                            '     <span></span>\n' +
                            '    </label>\n' +
                            '   </span>';
                    }
                    return status;
                }
            },
            {
                targets: 4,
                className: 'text-left',
                orderable:false,
                render: function (data, type, full, meta) {
                    var action = '<div class="row align-middle justify-content-center"><button title="Edit Customer" data-name="'+data+'" onclick="update_user(this)" class="btn btn-icon btn-light-primary btn-hover-primary btn-sm mx-3 text-center">'+
                        '<span class="svg-icon svg-icon-md svg-icon-primary">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">'+
                        '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
                        '<rect x="0" y="0" width="24" height="24"></rect>'+
                        '<path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953)"></path>'+
                        '<path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"></path>'+
                        '</g>'+
                        '</svg>'+
                        '</span>'+
                        '</button>'+
                        '<button title="Delete Customer" data-name="'+data+'" onclick="delete_user(this)" class="btn btn-icon btn-light-primary btn-hover-primary btn-sm mx-3 text-center">'+
                        '<span class="svg-icon svg-icon-md svg-icon-primary">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">'+
                        '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
                        '<rect x="0" y="0" width="24" height="24"></rect>'+
                        '<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>'+
                        '<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>'+
                        '</g>'+
                        '</svg>'+
                        '</span>'+
                        '</button></div>';
                    return action;
                }
            },
        ]
    });


    return {
        //main function to initiate the module
        init: function () {
            initTable();
        },

    };

}();


function update_status(e) {
    let _id = $(e).data('name');
    $.ajax({
        type: 'POST',
        url: '/api/user_status',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        data: {"id":_id},
        success: (result) => {
            try {
                if (typeof result === 'object' && result.status && result.status === 'success') {
                    Swal.fire({
                        position: "top-right",
                        icon: "success",
                        title: result.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        text: result.message,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light-primary"
                        }
                    });
                }
            } catch (e) {
                Swal.fire({
                    text: "Sorry, looks like there are some errors detected, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                })
            }
        }
    })
}



function delete_user(e) {
    let _id = $(e).data('name');
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: 'POST',
                url: '/api/user_delete',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                data: {"id": _id},
                success: (result) => {
                    try {
                        if (result && typeof result === 'object' && result.status && result.status === 'success') {
                            Swal.fire({
                                position: "top-right",
                                icon: "success",
                                title: result.message,
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function () {
                                dataTable.ajax.reload();
                            });
                        } else {
                            Swal.fire({
                                text: result.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            });
                        }
                    } catch (e) {
                        Swal.fire({
                            text: "Sorry, looks like there are some errors detected, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        });
                    }
                }
            })
        }
    })
}



function update_user(e) {
    let _id = $(e).data('name');
    $.ajax({
        type: 'post',
        data: {"id": _id},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        url: '/api/user_details',
        beforeSend: function () {
            KTApp.blockPage({
                overlayColor: '#000000',
                state: 'primary',
                message: 'Please Wait...'
            });
        },
        success: function (obj) {
            try {
                $('#modal_user .modal-title').html('<i class="flaticon-edit-1 mr-2 text-dark"></i>Update Customer');
                $("#form_user input[name=id]").val(obj.data._id);
                $("#form_user input[name=fname]").val(obj.data.fname);
                $("#form_user input[name=lname]").val(obj.data.lname);
                $("#form_user input[name=mno]").val(obj.data.mobile_no);
                $("#form_user input[name=email]").val(obj.data.email_id);
                $("#form_user input[name=city]").val(obj.data.location);
                $("#form_user input[name=address]").val(obj.data.address);
                $("#modal_user").modal("show");
            } catch (e) {
                Swal.fire({
                    text: "Sorry, looks like there are some errors detected, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                });
            }
            KTApp.unblockPage();
        }
    })
}



let formUser = function () {
    let _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';
    let _handleForm = function () {
        let form = KTUtil.getById('form_user');
        let formSubmitButton = $("#form_user button[type=submit]");
        if (!form) {
            return;
        }
        FormValidation
            .formValidation(
                form,
                {
                    fields: {
                        fname: {
                            validators: {
                                notEmpty: {
                                    message: 'First name is required!'
                                }
                            }
                        },
                        lname: {
                            validators: {
                                notEmpty: {
                                    message: 'Last name is required!'
                                }
                            }
                        },
                        email: {
                            validators: {
                                notEmpty: {
                                    message: 'Email address is required!'
                                },
                                emailAddress: {
                                    message: 'The value is not a valid email address!'
                                }
                            }
                        },
                        mno: {
                            validators: {
                                notEmpty: {
                                    message: 'Phone number is required!'
                                },
                                numeric: {
                                    message: 'Phone number invalid!'
                                },
                                stringLength: {
                                    message: 'Phone number is invalid!',
                                    min: 10,
                                },
                            }
                        },
                        city: {
                            validators: {
                                notEmpty: {
                                    message: 'City is required!'
                                }
                            }
                        },
                        address: {
                            validators: {
                                notEmpty: {
                                    message: 'Address is required!'
                                }
                            }
                        },
                        Gender: {
                            validators: {
                                notEmpty: {
                                    message: 'Gender is required!'
                                }
                            }
                        },
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        submitButton: new FormValidation.plugins.SubmitButton(),
                        bootstrap: new FormValidation.plugins.Bootstrap()
                    }
                }
            )
            .on('core.form.valid', function () {
                let api_state = 'new';
                if ($("#form_user input[name=id]").val() !== '') {
                    api_state = 'update';
                }
                let form_data = new URLSearchParams(new FormData($("#form_user")[0]));
                $.ajax({
                    method: 'post',
                    url: '/api/user-' + api_state,
                    data: form_data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    },
                    beforeSend: function () {
                        formSubmitButton.addClass(_buttonSpinnerClasses).attr('disabled', true);
                    },
                    success: function (obj) {
                        try {
                            if (obj.status === 'success') {
                                Swal.fire({
                                    allowOutsideClick: false,
                                    position: "top-right",
                                    icon: "success",
                                    title: obj.message,
                                    showConfirmButton: false,
                                    timer: 1000
                                }).then(function () {
                                    dataTable.ajax.reload();
                                    $("#modal_user").modal("hide");
                                    $("#modal_user").ajax.reload();
                                    $("#form_user").ajax.reload();
                                });
                            } else {
                                Swal.fire('Error', obj.message, 'error');
                            }
                        } catch (e) {
                            Swal.fire('Error', 'Something went wrong!', 'error')
                        }
                        formSubmitButton.removeClass(_buttonSpinnerClasses).attr('disabled', false);
                    }
                });
            })
            .on('core.form.invalid', function () {
                Swal.fire({
                    text: "Sorry, looks like there are some errors detected, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn font-weight-bold btn-light-primary"
                    }
                });
            });
    };

    // Public Functions
    return {
        init: function () {
            _handleForm();
        }
    };
}();

jQuery(document).ready(function () {
    formUser.init();
});

function new_customer_modal() {
    $('#form_user')[0].reset();
    $('#form_user input[name=user_id]').val('');
    $('#modal_user .modal-title').html('<i class="flaticon2-add-square mr-2 text-dark"></i>Create Customer');
    $('#modal_user').modal("show");
}
