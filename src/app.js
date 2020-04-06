const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const db = require('./db/dbop');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};


app.use(session(sessionOptions));
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Index Page
app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/userLogin', (req, res)=>{
   res.render('userLogin.hbs');
});

app.get('/userReg', (req, res)=>{
    res.render('userReg.hbs');
});

app.get('/profile',(req, res)=>{
    res.render('profile.hbs');
});

app.get('/custom-search/', (req, res)=>{
    console.log(`requested! ${req.query.name}`);
    res.json(a);
});

// GET API
app.get("/api/items", (req, res)=>{
    db.findClass()
        .then((data)=>{
            res.json(data);
        });
});

app.get('/saveRev', (req, res)=>{
    db.saveReview()
        .then(()=>{
            res.send('saved.');
        });
});

app.get('/testpop',(req,res)=>{
   db.testPopulate({})
       .then(()=>{
          res.send('popped.');
       });
});

app.listen(3000);