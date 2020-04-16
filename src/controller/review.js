// Reviews


const mongoose = require("mongoose"),
    utils = require('../utils/utils'),
    User = mongoose.model('User'),
    Review = mongoose.model('Review'),
    Class = mongoose.model('Class');


exports.addReviewPost = (req, res) => {
    const review = req.body;
    const tags = review.tags.split(",");
    saveReview(
        req.user.userNickname,
        req.user._id,
        Date.now(),
        review.currentClass,
        review.semester,
        review.grade,
        parseFloat(review.classQuality),
        parseFloat(review.classDifficulty),
        tags,
        review.reviews,
        req,
        res
    )
        .then((err) => {
            if (err) return utils.errHandle(err, req, res);
            // Redirect back to the class page after 2s
            setTimeout(() => res.redirect(req.get('referer')), 2000);
        })
};

exports.getReview = async (req, res, classID)=>{
    try{
        // get the lean version so that we can modify the object later
        const review = await Class
            .findById(classID)
            .populate('reviews')
            .lean()
            .exec();
        return review;
    }catch (e) {
        return utils.errHandle(e, req, res);
    }

};

async function saveReview(reviewUser, reviewUserId, reviewDate, reviewClass, reviewSemester, reviewGrade, qualityRating, difficultyRating, tags, reviewContent) {
    try {
        const newReview = new Review({
            reviewUser: reviewUser,
            reviewUserId: reviewUserId,
            reviewDate: reviewDate,
            reviewClass: reviewClass,
            reviewSemester: reviewSemester,
            reviewGrade: reviewGrade,
            qualityRating: qualityRating,
            difficultyRating: difficultyRating,
            tags: tags,
            reviewContent: reviewContent
        });
        // Save Review to database
        const savedReview = await newReview.save();
        console.log(savedReview);
        console.log('Saved.');
        // Find the related Class
        const currentClass = await Class.findById(savedReview.reviewClass);
        // Recalculate the Scores
        const reCalculated = utils.reCalculateReviewAndGrade(
            currentClass.reviews.length,
            savedReview.qualityRating,
            savedReview.difficultyRating,
            utils.convertLetterGrade(savedReview.reviewGrade),
            currentClass.overallClassQualityRate,
            currentClass.overallClassDifficultyRate,
            currentClass.overallGradeScore
        );
        // console.log(reCalculated);
        // console.log(utils.convertLetterGrade(reCalculated.newAvgGrade));
        // Save the scores to the class
        const savedClass = await Class.findOneAndUpdate(
            //update the overall rating as well
            {_id: currentClass._id},
            {$push: {reviews: savedReview._id},
                    $set: {
                        overallClassQualityRate: reCalculated.QualityRate,
                        overallClassDifficultyRate: reCalculated.DifficultyRate,
                        overallGradeScore: reCalculated.newAvgGrade,
                        overallGradeLetter: utils.AssignLetterGrade(reCalculated.newAvgGrade),
                    }
            }
        );
        // console.log(savedClass);
        console.log(`Class: ${savedClass.className} Saved.`);
        // Find the related User
        const savedUser = await User.findOneAndUpdate(
            {_id: savedReview.reviewUserId},
            {$push: {reviews: savedReview._id}}
        );
        console.log(`User ${savedUser.username} Saved.`);
    } catch (err) {
        return err;
    }

    // We want to save review to class, user, and review
}


// This function gets user info from array of reviews, and return a JSON with user info added, and Date for display.
exports.getReviewUserInfo = async function(reviews){
    let result = reviews;
    // loop through each review
    try{
        for(let i=0; i<result.length; i++){
            const user = await User.findById(result[i].reviewUserId).lean().exec();
            result[i].userAvatarUrl = user.userAvatarUrl;
            result[i].userNickname = user.userNickname;
            // convert date for display
            result[i].reviewDate = result[i].reviewDate.toDateString();
        }
        return result;
    }catch (e) {
        console.log(e);
        return e;
    }
};


// Calculate the overall rating and Grade based on an array of reviews.
exports.calculateOverallRate = function (reviews) {
  let qualityRate=0, difficultyRate=0, averageGrade=0;

  // Grading Scale
  const gradingScale = {
      "A+":96,
      "A":93,
      "A-":90,
      "B+":87,
      "B": 83,
      "B-":80,
      "C+":77,
      "C":73,
      "C-":70,
      "D":66,
      "D-":60,
      "F":50,
  };

  try{
    reviews.forEach(ele =>{
        // calculate overall rating
        qualityRate += ele.qualityRating;
        difficultyRate += ele.difficultyRating;
        // calculate grading
        if(ele.reviewGrade !== 'P/F'){
            averageGrade += gradingScale[ele.reviewGrade];
        }
    });
    return {
        "overallClassQuality": qualityRate/reviews.length,
        "overallClassDifficulty": difficultyRate/reviews.length,
        "averageGrade":averageGrade/reviews.length
    }
  }catch (e) {
      console.log(e);
      return e;
  }
};





