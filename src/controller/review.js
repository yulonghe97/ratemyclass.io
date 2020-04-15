// Reviews


const mongoose = require("mongoose"),
      User = mongoose.model('User'),
      Review = mongoose.model('Review')


exports.addReviewPost = (req, res) => {
  const review = req.body;
  const tags = review.tags.split(",");
  saveReview(
    req.user.userID,
    Date.now(),
    review.currentClass,
    parseFloat(review.classQuality),
    parseFloat(review.classDifficulty),
    tags,
    review.reviews
  )
  .then(()=>{
    res.redirect("/");
  })
};


async function saveReview(reviewUser, reviewDate, reviewClass, qualityRating, difficultyRating, tags, reviewContent){
    try{
        const newReview = new Review({
            reviewID: new mongoose.mongo.ObjectID(),
            reviewUser: reviewUser,
            reviewDate: reviewDate,
            reviewClass: reviewClass,
            qualityRating: qualityRating,
            difficultyRating: difficultyRating,
            tags: tags,
            reviewContent: reviewContent
        });
        console.log('Before Save.');
        const savedReview = await newReview.save();
        console.log(savedReview);
        console.log('Saved.')
    }catch(err){
        console.log(err);
    }

    

    // We want to save review to class, user, and review
    

}