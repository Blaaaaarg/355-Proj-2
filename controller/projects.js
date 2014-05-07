var express = require('express'),
    db = require('../models/db');

var router = express.Router();

console.log('Reached projects.js');

router.get('/backlog', function (req, res) {
    console.log('attempted sprints');
    res.render('backlog.ejs');
});

// changed from post to get
router.post('/backlog', function (req, res) {
    console.log('attempted backlog');
    db.Backlog( req.body.PID, function (err, result) {
        if (err) throw err;
        if (result[0].EID != 'undefined') {
            var responseHTML = '<table><tr><th>Entry</th></tr>';
            for (var i = 0; i < result.length; i++)
            {
                responseHTML += '<tr><td>' + result[i].entry + '</td></tr>';
            }
            responseHTML += '</table>';
            console.log(responseHTML);
            res.send(responseHTML);
        }
        else {
            res.send('No data found.');
        }
    });
});

/*router.get('/backlog', function (req, res) {
    console.log('viewing backlog');
    res.render('backlog.ejs', {rs: '/projects/backlog'});
});*/

// changed from post to get
router.get('/sprints', function (req, res) {
    console.log('attempted sprints');
                res.render('sprints.ejs');
});

router.post('/sprints', function (req, res) {
    console.log('attempted sprints post');
    console.log(req.body);
    db.Sprints( req.body.PID, function (err, result) {
        if (err) throw err;
        if (result[0].EID != 'undefined'){
            var planned = new Array();
            var inc1 = 0;
            var progress = new Array();
            var inc2 = 0;
            var finished = new Array();
            var inc3 = 0;
            for (var i = 0; i < result.length; i++)
            {
                if (result[i].category === 1) {
                    planned[inc1] = { entry: result[i].entry
                    }
                    inc1++;
                }
                else if (result[i].category === 2) {
                    progress[inc2] = { entry: result[i].entry
                    }
                    inc2++;
                }
                else {
                    finished[inc3] = { entry: result[i].entry
                    }
                    inc3++;
                }
            }
            var responseHTML = '<form name="save" action="/projects/sprints/save" method="POST"><div class="category" ondrop="drop(event)" ondragover="allowDrop(event)">';
            var text_id = 0;
            if(planned.length > 0) {
                for (var i=0; planned.length > i; i++) {
                    responseHTML += '<div id="' + text_id +  '" class="moves" onclick="load(this.id)">' + planned[i].entry + '</div>';
                    text_id++;
                }
            } else {
                responseHTML += 'No entries to list.';
            }
            responseHTML += '</div><div class="category" ondrop="drop(event)" ondragover="allowDrop(event)">';
            if(progress.length > 0) {
                for (var i=0; progress.length > i; i++) {
                    responseHTML += '<div id="' + text_id + '" class="moves" draggable="true" onclick="load(this.id)" ndragstart="drag(event)">' + progress[i].entry + '</div>';
                    text_id++;
                }
            } else {
                responseHTML += 'No entries to list.';
            }
            responseHTML += '</div><div class="category" ondrop="drop(event)" ondragover="allowDrop(event)">';
            if(finished.length > 0) {
                for (var i=0; finished.length > i; i++) {
                    responseHTML += '<div id="' + text_id + '" class="moves" draggable="true" onclick="load(this.id)" ondragstart="drag(event)">' + finished[i].entry + '</div>';
                    text_id++;
                }
            } else {
                responseHTML += 'No entries to list.';
            }
            responseHTML += '</div>';
            console.log(responseHTML);
            res.send(responseHTML);
        } 
        else {
            res.send('No data found.');
        }
    
    });
});

router.post('/sprints/save', function (req, res) {
    console.log('attempted save');
    console.log(req.body);
    for (var i = 0; i < req.body.length; i++)
    {
        db.Save( req.body[i], function (err, result) {
            if (err) throw err;
            if (result == true || result > 0) {
                console.log(result);
                res.send('saved');
            }
            else {
                res.render('unable to save');
            }
        });
    }
});

/*router.post('/usrlogin', function (req, res) {
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
});*/

router.post('/select', function (req, res) {
    console.log('Attempted select');
    db.ProjDropdown( req.body, function (err, result) {
            console.log(result);
            var responseHTML = '<select id="proj-list">';
            if (result != 'undefined'){
                for (var i = 0; result.length > i; i++) {
                    var option = '<option value="' + result[i].PID + '">' + result[i].Name + '</option>';
                    responseHTML += option;
                }
                responseHTML += '</select>';
            }
            console.log(responseHTML);
            res.send(responseHTML);
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
            var responseHTML = '<select id="user-list">';
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

module.exports = router;
