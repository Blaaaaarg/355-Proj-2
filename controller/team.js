var express = require('express'),
    db = require('../models/db');

var router = express.Router();

console.log('Reached team.js');

// LEFT OF HERE: changing teams view to a get and changing team lister to post with responseHTML generator so it works with add project (wip).

router.get('/', function (req, res) {
    console.log('attempted teams');
    db.Teams( req.body, function (err, result) {
        if (err) throw err;
        if (result[0].TID != 'undefined') {
            console.log(result);
            res.render('teams.ejs', {rs: result});
        }
        else {
            res.send('No data found.');
        }
    });
});

router.get('/members', function (req, res) {
    console.log('attempted members');
    db.Members( req.body, function (err, result) {
        if (err) throw err;
        if (result[0].UID != 'undefined'){
            res.render('members.ejs', {rs: result});
        }
        else {
            res.send('No data found.');
        }
    });
});

router.get('/projects', function (req, res) {
    console.log('attempted projects');
    db.Projects( req.body, function (err, result) {
        if (err) throw err;
        if (result[0].PID != 'undefined'){
            res.render('projects.ejs', {rs: result});
        }
    });
});

router.post('/selectteam', function (req, res) {
    console.log('Attempted team select');
    db.TeamDropdown( req.body, function (err, result) {
            console.log(result);
            var responseHTML = '<select id="team-list">';
            if (result != 'undefined'){
                for (var i = 0; result.length > i; i++) {
                    var option = '<option value="' + result[i].TID + '">' + result[i].Name + '</option>';
                    responseHTML += option;
                }
                responseHTML += '</select>';
            }
            console.log(responseHTML);
            res.send(responseHTML);
       });
});

router.post('/selectuser', function (req, res) {
    console.log('Attempted user select');
    db.UserDropdown( req.body, function (err, result) {
            console.log(result);
            var responseHTML = '<select id="user-list2">';
            if (result != 'undefined'){
                for (var i = 0; result.length > i; i++) {
                    var option = '<option value="' + result[i].UID + '">' + result[i].Name + '</option>';
                    responseHTML += option;
                }
                responseHTML += '</select>';
            }
            console.log(responseHTML);
            res.send(responseHTML);
       });
});

router.post('/addproject', function(req, res) {
    console.log('attempted to add project');
    db.SaveProject(req.body, function (err, result) {
    });
    //res.render('teams.ejs', {rs: result});
    res.send('Project added successfully');
});

router.post('/update', function(req, res) {
    console.log('\n\nattempted to modify team');
    db.UpdateTeam(req.body, function(err, result) {
    });
    db.Teams( req.body, function (err, result2) {
        if (err) throw err;
        if (result2[0].TID != 'undefined') {
            console.log('\npart2 ');
            console.log(result2);
            res.render('teams.ejs', {rs: result2});
            console.log('made it');
        }
        else {
            res.send('No data found.');
        }
    });
});

/* changed from post to get
router.get('/backlog', function (req, res) {
    console.log('attempted backlog');
    db.Backlog( req.body, function (err, result) {
        if (err) throw err;
        if (result[0].EID != 'undefined') {
            var items = new Array();
            for (var i = 0; i < result.length; i++)
            {
                console.log(result);
                items[i] = {
                    entry: req.body.entry
                }
            }
            res.render('backlog.ejs', {rs: result})
        }
        else {
            res.send('No data found.');
        }
    });
});*/

module.exports = router;
