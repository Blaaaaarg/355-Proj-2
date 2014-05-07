// Import the required packages
var express = require('express'),
    ejs = require('ejs'),
    connect = require('connect');

// Load the MVC files
var routes = require('./controller/index'),
    users = require('./controller/users'),
    login = require('./controller/login');
    projects = require('./controller/projects');
    teams = require('./controller/team');

var app = express();

app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.set('subtitle', 'Project 2');

app.set('port', 8027);
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/projects', projects);
app.use('/teams', teams);
app.listen(app.get('port'));
console.log('Express server listening on port', app.get('port'));
