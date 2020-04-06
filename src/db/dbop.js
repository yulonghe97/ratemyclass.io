require('./db');
const mongoose = require('mongoose');
// Schema Modeling
const Class = mongoose.model('Class');
const Review = mongoose.model('Review');
const User = mongoose.model('User');
const University = mongoose.model('University');

let classData;

async function findClass(){
    classData = await Class.find();
    return classData;
}

async function saveClass(){
    const newID = new mongoose.mongo.ObjectID();
    console.log(newID);
    const newClass = new Class({
        className: 'Intro to Programming1',
        classCode: 'CSCA-UA-001',
        classSemester:'Fall',
        classID: newID,
        classUniversity: newID,
        professor: 'Prof. Goldberg',
        dateCreated: Date.now(),
        overallClassQualityRate: 10.0,
        overallClassDifficultyRate: 10.0,
        overallGrade: 'A',
        popularity: 10,
        reviews: [newID]
    });
    await newClass.save((err, classData) =>{
        err ? console.log(err) : console.log(`Class ID ${classData.classID} Saved.`);
    });
}

async function saveReview(){
    const ReviewID = new mongoose.mongo.ObjectID();
    const newReview = new Review({
        reviewID: ReviewID,
        reviewUser: [ReviewID],
        reviewDate: Date.now(),
        reviewClass: '5e8650b76cdde67badbe80e9',
        qualityRating: 8.0,
        difficultyRating: 10.0,
        sentiment: 'excellent',
        tags: ['best'],
        reviewContent:'Its ok!'
    });
    await newReview.save((err, reviewData)=>{
        err ? console.log(err) : console.log(`Review ID ${reviewData.reviewID} Saved.`);
    });
}

async function testPopulate(reviewQuery){
    Review
        .findOne(reviewQuery)
        .populate('reviewClass')
        .exec((err, classname)=>{
           if(err) console.log(err);
           console.log(classname);
        });
}

module.exports = {
    findClass: findClass,
    saveClass: saveClass,
    saveReview: saveReview,
    testPopulate: testPopulate,
};