// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// class objects that records the information of each school-class
const Class = new mongoose.Schema({
    className: {type: String, required:true},
    classCode: {type: String, required:true},
    classSemester:{type: String, required:true},
    classID: mongoose.Schema.Types.ObjectID,
    classUniversity: {type: mongoose.Schema.Types.ObjectID, ref:'University'},
    professor: {type: String, required:true},
    dateCreated: Date,
    overallClassQualityRate: {type: Number, min: 0.0, max: 10.0},
    overallClassDifficultyRate: {type: Number, min: 0.0, max: 10.0},
    overallGrade: {type: Number, min: 0.0, max: 10.0},
    popularity: Number,
    reviews: [{type: mongoose.Schema.Types.ObjectID, ref:'Review'}]	// Or reviews: Review ??
},{_id:true});

// Review class that contains the information of each review
const Review = new mongoose.Schema({
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
const User = new mongoose.Schema({
    username:{type: String, required:true, index:{unique: true}},
    password:{type: String, required:true},
    userEmail: String,
    userID: mongoose.Schema.Types.ObjectID,
    userNickName: {type:String, required:true},
    userUniversity: {type: mongoose.Schema.Types.ObjectID, ref:'University'},
    userDateCreated: Date,
    userAvatarUrl:{type:String, required:true, default: "https://miro.medium.com/max/360/1*W35QUSvGpcLuxPo3SRTH4w.png"},
    followedClass: [{type: mongoose.Schema.Types.ObjectID, ref:'Class'}],
    reviews: [{type: mongoose.Schema.Types.ObjectID, ref:'Review'}]
}, {_id:true});

// University Information
const University = new mongoose.Schema({
    universityID:mongoose.Schema.Types.ObjectID,
    universityName:{type: String, required:true},
    universityAbbr:{type: String, required:true},
    universityDateCreated:Date,
    universityClasses:[{type: mongoose.Schema.Types.ObjectID, ref:'Class'}],
    universityUsers:[{type: mongoose.Schema.Types.ObjectID, ref:'User'}]
}, {_id:true});

// Admin Information for management
const Admin = new mongoose.Schema({
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
