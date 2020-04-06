const mongoose = require('mongoose');

// class objects that records the information of each school-class
const classSchema = new mongoose.Schema({
    className: {type: String, required:true},
    classCode: {type: String, required:true},
    classSemester:{type: String, required:true},
    classID: mongoose.Schema.Types.ObjectID,
    classUniversity: {type: mongoose.Schema.Types.ObjectID, ref:'University'},
    professor: {type: String, required:true},
    dateCreated: Date,
    overallClassQualityRate: {type: Number, min: 0.0, max: 10.0},
    overallClassDifficultyRate: {type: Number, min: 0.0, max: 10.0},
    overallGrade: String,
    popularity: Number,
    reviews: [{type: mongoose.Schema.Types.ObjectID, ref:'Review'}]	// Or reviews: Review ??
},{_id:true});

// Review class that contains the information of each review
const reviewSchema = new mongoose.Schema({
    reviewID: mongoose.Schema.Types.ObjectID,
    reviewUser: {type: mongoose.Schema.Types.ObjectID, ref:'User'},
    reviewDate: Date,
    reviewClass: {type: mongoose.Schema.Types.ObjectID, ref:'Class'},
    qualityRating: {type: Number, min: 0.0, max: 10.0},
    difficultyRating: {type: Number, min: 0.0, max: 10.0},
    sentiment: String,
    tags: [String],
    reviewContent:String
},{_id:true});

// User Information
const userSchema = new mongoose.Schema({
    username:{type: String, required:true, index:{unique: true}},
    password:{type: String, required:true},
    userEmail: String,
    userID: mongoose.Schema.Types.ObjectID,
    userNickname: {type:String, required:true},
    userUniversity: {type: mongoose.Schema.Types.ObjectID, ref:'University'},
    userDateCreated: Date,
    userAvatarUrl:{type:String, default: "https://miro.medium.com/max/360/1*W35QUSvGpcLuxPo3SRTH4w.png"},
    followedClass: [{type: mongoose.Schema.Types.ObjectID, ref:'Class'}],
    reviews: [{type: mongoose.Schema.Types.ObjectID, ref:'Review'}]
}, {_id:true});

// University Information
const universitySchema = new mongoose.Schema({
    universityID:mongoose.Schema.Types.ObjectID,
    universityName:{type: String, required:true},
    universityAbbr:{type: String, required:true},
    universityDateCreated:Date,
    universityClasses:[{type: mongoose.Schema.Types.ObjectID, ref:'Class'}],
    universityUsers:[{type: mongoose.Schema.Types.ObjectID, ref:'User'}]
}, {_id:true});

// Admin Information for management
const adminSchema = new mongoose.Schema({
    adminID:mongoose.Schema.Types.ObjectID,
    adminUsername:{type: String, required:true},
    adminPassword:{type: String, required:true},
    adminName:{type: String, required:true},
    userManage: {type: Boolean, required:true, default: true},
    reviewManage: {type: Boolean, required:true, default: true},
    tagsManage: {type: Boolean, required:true, default: true},
    classManage: {type: Boolean, required:true, default: true},
    universityManage: {type: Boolean, required:true, default: true}
});

const movieSchema = new mongoose.Schema({
    id: String,
    name: String,
    genre: String
});


// Register Schema
const Movie = mongoose.model('Movie', movieSchema);
const Class = mongoose.model('Class', classSchema);
const Review = mongoose.model('Review', reviewSchema);
const User = mongoose.model('User', userSchema);
const University = mongoose.model('University', reviewSchema);

// mongodb driver
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configuration from a file
    // use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '/config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // connection string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    console.log(`Mode Error.`)
}

async function connectDB(){
    await mongoose.connect(dbconf, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
        if(!error){
            console.log(`Cloud Database Connection success!`);
        }else {
            console.log(error);
        }
    });
    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error: ${err}`);
        process.exit(1);
    });
}

connectDB().then(()=>{
});


