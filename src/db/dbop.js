require("./db");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
// Schema Modeling
const Class = mongoose.model("Class");
const Review = mongoose.model("Review");
const User = mongoose.model("User");
const University = mongoose.model("University");

let classData;

async function findAllClass() {
  classData = await Class.find();
  return classData;
}

async function saveClass() {
  const newID = new mongoose.mongo.ObjectID();
  console.log(newID);
  const newClass = new Class({
    className: "Intro to Programming1",
    classCode: "CSCA-UA-001",
    classSemester: "Fall",
    classID: newID,
    classUniversity: newID,
    professor: "Prof. Goldberg",
    dateCreated: Date.now(),
    overallClassQualityRate: 10.0,
    overallClassDifficultyRate: 10.0,
    overallGrade: "A",
    popularity: 10,
    reviews: [newID],
  });
  await newClass.save((err, classData) => {
    err
      ? console.log(err)
      : console.log(`Class ID ${classData.classID} Saved.`);
  });
}

async function saveReview() {
  const ReviewID = new mongoose.mongo.ObjectID();
  const newReview = new Review({
    reviewID: ReviewID,
    reviewUser: [ReviewID],
    reviewDate: Date.now(),
    reviewClass: "5e8650b76cdde67badbe80e9",
    qualityRating: 8.0,
    difficultyRating: 10.0,
    sentiment: "excellent",
    tags: ["best"],
    reviewContent: "Its ok!",
  });
  await newReview.save((err, reviewData) => {
    err
      ? console.log(err)
      : console.log(`Review ID ${reviewData.reviewID} Saved.`);
  });
}

async function regUser(
  username,
  password,
  userEmail,
  userNickname,
  userUniversity,
  userAvatarUrl
) {
  const newUser = new User({
    username: username,
    password: password,
    userEmail: userEmail || "",
    userID: new mongoose.mongo.ObjectID(),
    userNickname: userNickname,
    userUniversity: userUniversity,
    userDateCreated: Date.now(),
    userAvatarUrl: userAvatarUrl,
    followedClass: [],
    reviews: [],
  });
  await newUser.save((err, user) => {
    err ? console.log(err) : console.log(`User ID ${user.userID} Saved.`);
    // update the related university with new user
    University.findOneAndUpdate({universityID: userUniversity}, {$push: {universityUsers: user.userID}}, (err, res)=>{
      err ? console.log(err) : console.log(`User Added to the ${res.universityName}`);
    });
  });
}

async function saveUniversity(universityName, universityAbbr) {
  const id = new mongoose.mongo.ObjectID();
  const newUniversity = new University({
    universityID: id,
    universityName: universityName,
    universityAbbr: universityAbbr,
    universityDateCreated: Date.now(),
    universityClasses: [],
    universityUsers: [],
  });
  await newUniversity.save((err, university)=>{
    err ? console.log(err) : console.log(`University ID ${university.universityID} Saved.`);
  });
}

function findUniversity(university, cb) {
   University.findOne({ universityName: university }, (err, university) => {    
    if(university!=null){
      cb(err,university);
    }else{
      const error = 'unable to find the university'
      cb(error, university);
    }
   })
}

function checkUserExistance(user, cb){
    User.findOne({username: user}, (err, user)=>{
      // If the user exsit, return 1s, else return 0
        user !== null ? cb('1') : cb('0')
    });
}

function done(err) {
  console.log(err);
}

module.exports = {
  findAllClass: findAllClass,
  saveClass: saveClass,
  saveReview: saveReview,
  regUser: regUser,
  saveUniversity: saveUniversity,
  findUniversity: findUniversity,
  checkUserExistance: checkUserExistance,
  done: done
};
