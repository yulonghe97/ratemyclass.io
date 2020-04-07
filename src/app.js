const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const db = require("./db/dbop");
const utils = require("./utils");

// enable sessions
const session = require("express-session");
const sessionOptions = {
  secret: "secret cookie thang (store this elsewhere!)",
  resave: true,
  saveUninitialized: true,
};

const name = ["Jack Ma", "Adam Liu", "Niubi"];

app.use(session(sessionOptions));
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Index Page
app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.get("/userLogin", (req, res) => {
  res.render("userLogin.hbs");
});

app.get("/userReg", (req, res) => {
  res.render("userReg.hbs");
});

app.post("/reg", (req, res) => {
  const userData = req.body;
  let univeristyID;
  // find the university ID
  db.findUniversity(userData.userUniversity, (err, university) => {
    if (err) {
      res.render("error.hbs", {
        Error: err,
      });
    } else {
      univeristyID = university.universityID;
      // Save user after getting the ID
      // Hash the password
      utils.hashPassword(userData.password, (hashedPassword) => {
        db.regUser(
          userData.username,
          hashedPassword,
          userData.userEmail,
          userData.userNickname,
          univeristyID,
          userData.avatarURL
        ).then(() => {
          res.redirect("/");
        });
      });
    }
  });
});

app.get("/profile", (req, res) => {
  res.render("profile.hbs");
});

app.get("/random", (req, res) => {
  res.json(getRandom());
});

// APIs
app.get("/api/items", (req, res) => {
  db.findClass().then((data) => {
    res.json(data);
  });
});

/*
  API used to find the existance of user
*/
app.get("/api/user", (req, res) => {
  const user = req.query.username;
  db.checkUserExistance(user, (result) => {
    res.json({
      exist: result,
    });
  });
});

app.get("/saveRev", (req, res) => {
  db.saveReview().then(() => {
    res.send("saved.");
  });
});

// app.get("/saveU", (req, res)=>{
//     db.saveUniversity('New York University', 'NYU')
//     .then(()=>{
//         res.send('University Saved.');
//     });
// });

app.get("/findU", (req, res) => {});

function getRandom() {
  const randomNameIndex = Math.floor(Math.random() * Math.floor(name.length));
  const randomImgIndex = Math.floor(Math.random() * Math.floor(3));
  return {
    name: name[randomNameIndex],
    url: `/random/${randomImgIndex}.png`,
  };
}

app.listen(3000);
