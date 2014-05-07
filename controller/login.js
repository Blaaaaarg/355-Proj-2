// Scott Walker

var express = require('express'),
    db = require('../models/db');

var router = express.Router();

console.log('Reached login.js');

router.get('/welcome', function (req, res) {
    res.render('welcome.ejs', {action: '/login/usrlogin'});
});

router.post('/usrlogin', function (req, res) {
    console.log('login req: ');
    console.log(req.body);
    db.SignIn( req.body, function (err, result) {
        console.log(result);
            if (err) throw err;
            if (result != 'undefined') {
                console.log(result.UID);
            }
            else {
                res.render('Username or password do not match.');
            }
            res.render('welcome.ejs', {rs: result});
        }
    );
});

/*router.get('/all', function (req, res) {
    db.GetAll(function (err, result) {
            if (err) throw err;
            res.render('usertable.ejs', {rs: result});
        }
    );
});*/

// add a function to view single user info (did this already in sample)

module.exports = router;
