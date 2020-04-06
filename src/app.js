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

const name = ['Jack Ma', 'Adam Liu', 'Niubi'];


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

app.post('/reg', (req, res)=>{
    console.log(req.body);
    res.redirect('/');
});

app.get('/profile',(req, res)=>{
    res.render('profile.hbs');
});

app.get('/random', (req, res)=>{
    res.json(getRandom())
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


function getRandom(){
    const randomNameIndex = Math.floor(Math.random() * Math.floor(name.length));
    const randomImgIndex = Math.floor(Math.random() * Math.floor(3));
    return ({name: name[randomNameIndex], url: `/random/${randomImgIndex}.png` });
}

app.listen(3000);