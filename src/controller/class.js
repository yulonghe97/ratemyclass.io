// user.js will contain the methods for user operation.
const mongoose = require("mongoose"),
    Class = mongoose.model("Class"),
    utils = require('../utils/utils'),
    review = require('../controller/review'),
    university = require("./university");

// Routing

// CLASSPAGE
exports.getViewClass = (req, res) => {
  // Store last page visited in session
  req.session.redirectTo = req.originalUrl;

  // If there is a query
  if (req.params.classId) {
    Class.findOne({_id: req.params.classId}, async (err, course)=>{
      // Error Handling
      if(err || course === null){
        req.flash('error', 'Unable to Find the Class');
        res.redirect('/error');
        return errHandle(err)
      }
      // Get Reviews
      const classReview = await review.getReview(req, res, req.params.classId);
      // We want to get user info as well, merge into the review
      const mergedReviews = await review.getReviewUserInfo(classReview.reviews);
      if (req.user) {
        // User Signed In
        res.render("Class/classPage", {
          userNickname: req.user.userNickname,
          signedOut: false,
          avatar: req.user.userAvatarUrl,
          course: course,
          reviews: mergedReviews,
          reviewNum: mergedReviews.length
        });
      } else {
        res.render("Class/classPage", {
          signedOut: true,
          course: course,
          reviews: mergedReviews,
          reviewNum: mergedReviews.length
        });
      }      
    });
  }else{
    // If there is no query
    req.flash('error', 'Unable to Find the Class');
    res.redirect('/error');
  }
};





// ADD CLASS FUNCTIONS
exports.getAddClass = (req, res) => {
  if (req.user) {
    // User Signed In
    res.render("Class/addClass", {
      userNickname: req.user.userNickname,
      signedOut: false,
      avatar: req.user.userAvatarUrl,
    });
  } else {
    res.render("Class/addClass", { signedOut: true });
  }
};

exports.postAddClass = (req, res) => {
  const classData = req.body;
  console.log(classData);
  // check and cast the classSession type.
  let classSession;
  if (typeof classData.courseSession === "string") {
    classSession = [classData.courseSession];
  } else {
    // then the classData must be array type, with multiple inputs
    classSession = classData.courseSession;
  }

  try {
    addClass(
      classData.courseName.trim(),
      classData.courseCode.trim(),
      classData.courseSemester.trim(),
      classSession,
      classData.courseSection.trim(),
      classData.courseUnit.trim(),
      classData.courseUniversity.trim(),
      classData.coursePrereq,
      classData.courseWebsite,
      classData.courseDescription,
      classData.professor.trim(),
      Date.now(),
      0.0,
      0.0,
      0.0,
      "N/A",
      0,
      [],
      true,
      // Callback after Class Added.
      (currentClass) => {
        setTimeout(() => {
            res.redirect(`/addSuccess/${currentClass._id}`)
        }, 2000);
      }
    );
  } catch (e) {
    return utils.errHandle(e, req, res)
  }
};

// DB Operation
function addClass(
  className,
  classCode,
  classSemester,
  classSession,
  classSection,
  classUnits,
  classUniversity,
  classPrereq,
  classWebsite,
  classDescription,
  professor,
  dateCreated,
  overallClassQualityRate,
  overallClassDifficultyRate,
  overallGradeScore,
  overallGradeLetter,
  popularity,
  reviews,
  isApproved,
  cb
) {
  const newClass = new Class({
    className: className,
    classCode: classCode,
    classSemester: classSemester,
    classSession: classSession,
    classSection: classSection,
    classUnits: classUnits,
    classUniversity: classUniversity,
    classPrereq: classPrereq,
    classWebsite: classWebsite,
    classDescription: classDescription,
    professor: professor,
    dateCreated: dateCreated,
    overallClassQualityRate: overallClassQualityRate,
    overallClassDifficultyRate: overallClassDifficultyRate,
    overallGradeScore: overallGradeScore,
    overallGradeLetter: overallGradeLetter,
    popularity: popularity,
    reviews: reviews,
    isApproved: isApproved,
  });

  newClass.save((err, currentClass) => {
    if(err){
      return errHandle(err)
    }else{
      console.log(`Class ID ${currentClass._id} Saved.`);
    }
    // Update the university
    university.University.findOneAndUpdate(
      { universityName: currentClass.classUniversity },
      { $push: { universityClasses: currentClass._id } },
      (err, res) => {
        if(err){
          return errHandle(err)
        }else{
          console.log(`Class Added to the ${res.universityName}`);
        }
      }
    );
    cb(currentClass);
  });
}


exports.getAddSuccess = (req, res)=>{
  if(req.params.classId){
    res.render('Class/addSuccess',{id: req.params.classId});
  }else{
    res.redirect('/redirect');
  }
};

// Class Search

exports.searchClass = function (query, cb) {
    Class.fuzzySearch(query, function (err, classes) {
      if(err) return errHandle(err);
      cb(classes);
    });
};


// Error handling helper function
function errHandle(e){
  console.log(e);
  return e;
}