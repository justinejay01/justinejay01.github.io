//const http = require('http');
//const axios = require('axios');
//const HttpsProxyAgent = require('https-proxy-agent');
//const jwt = require('jsonwebtoken');
const { Pool, Client } = require("pg");
const path = require("path");
const parser = require("body-parser");
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
const app = express();
var userRole = null;
var userName = null;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

var portaccess = process.env.PORT || 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    resave: false,
    secret: "secret",
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  if (req.session.loggedin) {
    res.render("index", {title: "Home", uname: req.session.username, name: userName});
  } else {
    res.redirect("/auth/");
  }
});

app.get("/programs", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/programs/index.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/programs/csharp", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/programs/csharp/index.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/programs/csharp/lesson-6", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/programs/csharp/lesson-6.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/programs/csharp/lesson-7", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/programs/csharp/lesson-7.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/programs/csharp/lesson-9", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/programs/csharp/lesson-9.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/tools", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/tools/index.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/tools/gdrive-linkgen", function (req, res) {
  if (req.session.loggedin) {
    res.sendFile("/tools/gdrive-linkgen.html", { root: __dirname });
  } else {
    res.redirect("/auth/");
  }
});

app.get("/auth/", function (req, res) {
  if (req.session.loggedin) {
    res.redirect("/");
  } else {
    res.render("auth", {title: "Authentication"});
  }
});

app.get("/logout", function (req, res) {
  var uname = req.session.username;
  req.session.destroy(function(err) {
    console.log(uname + ": Logout!");
  });
  res.redirect("/auth/");
})

app.post("/auth/login", function (req, res) {
  var uname = req.body.uname;
  var pword = req.body.pword;

  if (uname && pword) {
    var sha256Hash = crypto.createHash('sha256');
    var pwordData = sha256Hash.update(pword, 'utf-8');
    var pwordHash = pwordData.digest('hex');
    pool
      .query("SELECT fname, lname, role FROM users.auth where uname = $1 and pword = $2", [
        uname,
        pwordHash,
      ])
      .then((resu) => {
        if (resu.rows[0] != null) {
          
          var jsonStr = JSON.stringify(resu.rows[0]);
          var obj = JSON.parse(jsonStr);
          var objFname = obj.fname.toString();
          var objLname = obj.lname.toString();
          var objRole = obj.role.toString();
          userRole = objRole;
          userName = objFname + " " + objLname;
          
          req.session.loggedin = true;
          req.session.username = uname;
          console.log(uname + ": Login!");
          res.send("1");
        } else {
          res.send("0");
        }
      })
      .catch((err) =>
        setImmediate(() => {
          throw err;
        })
      );
  } else {
    res.send("Please enter username and/or password!");
    res.end();
  }
});

app.post("/auth/reg", function (req, res) {
  var uname = req.body.uname;
  var email = req.body.email;
  var pword = req.body.pword;

  if (uname && pword && email) {
    pool
      .query("SELECT count(uname) FROM users.auth where uname = $1", [uname])
      .then(resu => {
        var jsonStr = JSON.stringify(resu.rows[0]);
        var obj = JSON.parse(jsonStr);
        var result = obj.count.toString();
        if (result == "1") {
          console.log(result);
          res.send(result);
        } else {
          var sha256Hash = crypto.createHash('sha256');
          var pwordData = sha256Hash.update(pword, 'utf-8');
          var pwordHash = pwordData.digest('hex');
          pool
            .query("INSERT INTO users.auth (id,uname,pword,email,role) values (0,$1,$2,$3,$4)",
              [uname, pwordHash, email, "user"])
            .then(resul => {
              console.log(uname + ": Register!");
              res.send("2");
            })
            .catch(err =>
              setImmediate(() => {
                res.send("0");
                throw err
              })
            );
        }
      })
      .catch(err =>
        setImmediate(() => {
          throw err
        })
      );
  } else {
    res.send("Please enter username and/or password!");
    res.end();
  }
});

app.listen(portaccess);

/*
app.get('/t', function(req,res){
  var q = req.query.q;
  var token = jwt.sign({videoId: q}, prv, {expiresIn: '3hr', algorithm: 'RS256'});
  res.send(token);
});

function getToken(q){
  return jwt.sign({videoId: q}, prv, {expiresIn: '3hr', algorithm: 'RS256'});
};

app.get('/vt', function(req,res){
  var q = req.query.q;
  jwt.verify(q, pub, function (err, dec){
    if(err) res.send('Invalid token!');
    else res.send('True');
  });
});


pool
      .query("SELECT count(uname) FROM users.auth where uname = $1", [uname])
      .then((resu) => {
        var jsonStr = JSON.stringify(resu.rows[0]);
        console.log(jsonStr);
        /*
        var jsonObj = rparser.stringToJson(resu.rows);
        parseJsonAsync(JSON.stringify(jsonObj)).then(jsonData => console.log(jsonData.count[0]));

       if (resu.rowCount != 0) {
        res.send(jsonStr);
      } else {
        pool
          .query(
            "INSERT INTO users.auth (id,uname,pword,email,role) values (0,$1,$2,$3,$4)",
            [uname, pword, email, "user"]
          )
          .then((resul) => {
            var jsonStrfy = JSON.stringify(resul.rows[0]);
            //console.log("A"+jsonStrfy);
            res.send(jsonStrfy);
          })
          .catch((err) =>
            setImmediate(() => {
              console.log(err);
              throw err;
            })
          );
      }
    })
    .catch((err) =>
      setImmediate(() => {
        console.log(err);
        throw err;
      })
    );
*/
