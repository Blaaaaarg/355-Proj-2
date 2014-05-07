// Scott Walker

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', {title: 'Express'});
});

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/login', function(req, res) {
    res.render('login.ejs');
});

router.get('/welcome', function(req, res) {
    res.render('welcome.ejs', {action: '/welcome'});
});

router.get('/userform', function(req, res) {
    res.render('userform.ejs', {action: '/displayUserData'}); // probs need to change action
});

router.get('/about', function(req, res) {
    res.render('about.ejs');
});

router.post('/displayUserData', function(req, res) {
    res.render('displayUserData.ejs', req.body);
});

module.exports = router;
