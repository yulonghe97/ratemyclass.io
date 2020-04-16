// Password Hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// function to hash the password
function hashPassword(password, cb){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // pass back the hashed value
        cb(hash);
    });
}

// function to check the password
function checkPassword(password, hash, cb){
    bcrypt.compare(password, hash, function(err, result) {
        // pass back the result
        cb(result);
    });
}

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}


function getRandom() {
    const randomImgIndex = Math.floor(Math.random() * Math.floor(3));
    return {
        url: `/random/${randomImgIndex}.png`,
    };
}


//Grading Calculating

// This function recalculate the overall review and grade based on the new review and grade
function reCalculateReviewAndGrade(reviewNum,newQualityRate, newDifficultyRate, newGrade, oldOverallQualityRate, oldOverallDifficultyRate, oldOverallGrade){
    // First Review Case
    if(reviewNum === 0){
        return {"QualityRate": newQualityRate, "DifficultyRate":newDifficultyRate, "newAvgGrade":newGrade}
    }
    const newOverallQualityRate = ((oldOverallQualityRate * reviewNum) + newQualityRate) / (reviewNum + 1);
    const newOverallDifficultyRate = ((oldOverallDifficultyRate * reviewNum) + newDifficultyRate) / (reviewNum + 1);
    let newOverallGrade = 0;

    if(newGrade !== undefined) {
        // Calculate Numerical Grade
        newOverallGrade = ((oldOverallGrade * reviewNum) + newGrade) / (reviewNum + 1);
    }

    if(newOverallGrade !== 0){
        return {"QualityRate": roundNumber(newOverallQualityRate,4), "DifficultyRate": roundNumber(newOverallDifficultyRate,4), "newAvgGrade": newOverallGrade}
    }else{
        return {"QualityRate": roundNumber(newOverallQualityRate,4), "DifficultyRate": roundNumber(newOverallDifficultyRate,4), "newAvgGrade": oldOverallGrade}
    }
}


// This function takes a grade score and assign a number grade
function AssignLetterGrade(gradeScore) {
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

    // Assign Letter Grade
        if(gradeScore < 50 && gradeScore!==0){
            return 'F';
        }else{
            for (let [key, value] of Object.entries(gradingScale)) {
                if(gradeScore >= value){
                    return key.toString();
                }
            }
        }
}

function convertLetterGrade(letterGrade) {
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

    // Assign Numerical Grade
    return gradingScale[letterGrade];

}


function roundNumber(num, dec) {
    return Number(num.toFixed(dec));
}

function errHandle(e, req, res){
    console.log(e);
    req.flash('error', 'Server Error');
    res.redirect('/error');
    return e;
}





module.exports = {
    hashPassword: hashPassword,
    checkPassword: checkPassword,
    isValidPassword: isValidPassword,
    getRandom: getRandom,
    errHandle: errHandle,
    reCalculateReviewAndGrade: reCalculateReviewAndGrade,
    AssignLetterGrade: AssignLetterGrade,
    convertLetterGrade: convertLetterGrade,

};