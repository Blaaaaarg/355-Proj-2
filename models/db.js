var mysql = require('mysql');

// configure database connection
var connection = mysql.createConnection( {
    host: 'localhost',
    user: 'swalker',
    password: '3453273'
});

var userDB = 'swalker',
    createDB = 'CREATE DATABASE IF NOT EXISTS ' + userDB;

connection.query(createDB, function (err) {
    if (err) throw err;
    var useQuery = 'USE ' + userDB;
    
    connection.query(useQuery, function (err) {
        if (err) throw err;

        var createTable = 'CREATE TABLE IF NOT EXISTS p2_user('
            + 'UID int PRIMARY KEY AUTO_INCREMENT,'
            + 'Name varchar(100) NOT NULL,'
            + 'email varchar(255) NOT NULL,'
            + 'Password varchar(50) NOT NULL'
            + ');';

        connection.query(createTable, function (err) {
            if (err) throw err;
        });
    });
});

exports.SignIn = function(userInfo, callback) {
    console.log(userInfo);
    var query1 = "select UID, Name from p2_user where email = '" + userInfo.email + "' and Password = '" + userInfo.password + "'";
    console.log(query1);
    connection.query(query1,
            function (err, result) {
                if (err) {
                    callback(true);
                    return;
                }
                //console.log('\n\n\nLOGIN!\n\n\n');
                callback(false, result);
            }
    );
}

exports.Save = function(entryInfo, callback) {
    console.log(entryInfo);
    //var save_query = "INSERT INTO P2_ENTRY VALUES(null, '" + entryInfo.Entry + "', " + entryInfo.projectID + ", default, " + entryInfo.projectID + ")";
    var save_query = "UPDATE p2_entry entry='" + entryInfo.Entry + "' where EID="
    console.log(save_query);
    connection.query(save_query, entryInfo,
                    function (err, result) {
                        if (err) {
                            callback(true);
                            return;
                        }
                        callback(false, result);
                    }
    );

}

exports.GetProjects = function(userInfo, callback) {
    console.log(userInfo);
    connection.query('select * from p2_project where creatorID = ?', userInfo.UID,
                     function(err, result) {
                         if (err) {
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.SaveProject = function (projInfo, callback) {
    var save_proj = "INSERT INTO p2_projects values(null, '" + projInfo.Name + "', " + projInfo.leader + ", default)";
    var proj_num;
    console.log(save_proj);
    connection.query(save_proj, projInfo,
                     function (err, result) {
                         if (err) {
                             console.log('error');
                             callback(true);
                             return;
                         }
                    }
    );
    var find_proj = "select PID from p2_projects where Name='" + projInfo.Name + "' and creatorID=" + projInfo.leader;
    console.log(find_proj);
    connection.query(find_proj, projInfo,
                     function(err, result3) {
                         if (err) {
                             console.log('error2');
                             callback(true);
                             return;
                         }
                         console.log("\n\n");
                         console.log(result3[0]);
                         proj_num = result3[0].PID;
                         console.log("project number: " + proj_num);
            //}                 
    //);
    console.log('\n\nnext query');
    var update_team = "INSERT INTO p2_team_manage_proj VALUES(" + proj_num + ", " + projInfo.TID + ")";
     console.log("\n\nupdate 2: " + update_team);
     connection.query(update_team, projInfo,
                      function (err, result2) {
                            if (err) {
                                callback(true);
                                return;
                            }
                            callback(false, result2);
                        }
         );
         }
    );
}

exports.UpdateTeam = function(teamInfo, callback) {
    console.log('attempted update team');
    console.log(teamInfo);
    var up_team = "UPDATE p2_team SET name='" + teamInfo.Name + "', leader='" + teamInfo.leader + "', scrum_master='" + teamInfo.smaster + "' where TID=" + teamInfo.TID;
    console.log(up_team);
    connection.query(up_team, teamInfo,
                     function (err, result){
                         if (err) {
                             console.log('Error: ' + err);
                             callback(true);
                             return;
                         }
                         console.log('\n\nquery attempted: ');
                         console.log(result);
                         callback(false, result);
                     }
    );
}

exports.GetAll = function(callback) {
    connection.query('select UID, email, Name from p2_user',
                     function (err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.Insert = function(userInfo, callback) {
    connection.query('INSERT INTO p2_user SET ?', userInfo,
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            callback(true);
                            return;
                        }
                        callback(false, result);
                    }
    );
}

exports.Sprints = function(entries, callback) {
    //connection.query('SELECT * FROM p2_entry WHERE projectID = ?', entries,
    console.log('in db.sprints: ');
    console.log(entries);
    var sprint_query;
    if (entries == true || entries > 1) {
        sprint_query = 'SELECT * FROM p2_entry WHERE projectID = ' + entries;
        console.log('non-default');
        console.log(sprint_query);
    }
    else {
        console.log('default');
    }
    connection.query(sprint_query, entries,
                     function (err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.Backlog = function(entries, callback) {
    console.log('in backlog: ' + entries);
    var query2 = 'SELECT * FROM p2_entry WHERE projectID = ' + entries + ' ORDER BY creation_time';
    //var query2 = 'SELECT * FROM p2_entry WHERE projectID = 1 ORDER BY creation_time';
    connection.query(query2, entries,
                     function (err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.Teams = function(entries, callback) {
    //var query3 = 'SELECT * FROM p2_team t JOIN p2_user_on_team u ON u.teamID=t.TID where u.userID=1';
    //var query3 = 'select *, Name from p2_team t, p2_user u JOIN u ON t.leader=u.UID';
    var query3 = 'select * from p2_team';
    connection.query(query3, entries,
                     function(err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.TeamDropdown = function(entries, callback) {
    var team_dropdown = 'SELECT * from p2_team';
    connection.query(team_dropdown, entries.TID,
                     function (err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         //console.log(result);
                         callback(false, result);
                     }
    );
}

exports.Projects = function(entries, callback) {
    var query4 = 'SELECT * FROM p2_projects p JOIN p2_team_manage_proj t on p.PID=t.projectID where t.projectID=2';
    //var query4 = 'SELECT * FROM p2_projects';
    connection.query(query4, entries,
                     function(err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.Members = function(entries, callback) {
    //var query5 = 'SELECT * FROM p2_user join p2_user u on p2_user_on_team t where t.TID = ' + entries;
    var query5 = 'select * from p2_user';
    console.log(query5);
    connection.query(query5, entries,
                     function(err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         callback(false, result);
                     }
    );
}

exports.ProjDropdown = function (entries, callback) {
    console.log('Attempted db dropdown');
    var query6 = 'select * from p2_projects';
    connection.query(query6, entries.PID,
                     function (err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         //console.log(result);
                         callback(false, result);
                     }
    );
}

exports.UserDropdown = function (entries, callback) {
    console.log('attempted db user dropdown');
    var sel_users = 'select * from ListUsers';
    connection.query(sel_users, entries,
                     function (err, result) {
                         if (err) {
                             console.log(err);
                             callback(true);
                             return;
                         }
                         //console.log(result);
                         callback(false, result);
                     }
    );
}
