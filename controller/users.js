var express = require('express'),
    db = require('../models/db');

var router = express.Router();

router.get('/create', function (req, res) {
    res.render('userform.ejs', {action: '/users/create'});
});

router.post('/create', function (req, res) {
    db.Insert( req.body, function (err, result) {
            if (err) throw err;
            if (result.UID != 'undefined') {
                var userValues = {
                    Name: req.body.Name,
                    email: req.body.email,
                    Password: req.body.Password
                }
                res.render('userinfo.ejs', userValues);
            }
            else {
                res.send('User was not inserted.');
            }
        }
    );
});

router.get('/all', function (req, res) {
    db.GetAll(function (err, result) {
            if (err) throw err;
            res.render('usertable.ejs', {rs: result});
        }
    );
});

// add a function to view single user info (did this already in sample)

module.exports = router;
