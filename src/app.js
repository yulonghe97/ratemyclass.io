require('./config/pass');
require("./config/db");
const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    app = express(),
    passport = require('passport'),
    flash = require('connect-flash'),
    routes = require('./routes');

// enable sessions
const session = require("express-session");
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "hbs");
app.use(session({
    secret: "secret cookies",
    resave: true,
    saveUninitialized: true,
}));
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(routes);

function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
       res.status(500).send({ error: 'Server Error' })
     } else {
       next(err)
    }
 }
 
app.use(clientErrorHandler);
app.listen(3000);
