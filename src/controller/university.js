const mongoose = require("mongoose");
const University = mongoose.model("University");
const utils = require('../utils/utils');


function saveUniversity(universityName, universityAbbr,cb) {
    const newUniversity = new University({
        universityName: universityName,
        universityAbbr: universityAbbr,
        universityDateCreated: Date.now(),
        universityClasses: [],
        universityUsers: [],
    });
    newUniversity.save((err, university)=>{
        if(err){
            console.log(err);
            return err;
        }
        cb(university);
        console.log(`University ID ${university._id} Saved.`);
    });
}

function findUniversity(university, cb) {
    University.findOne({ universityName: university }, (err, university) => {
        if(university!=null){
            cb(err,university);
        }else{
            const error = 'unable to find the university';
            cb(error, university);
        }
    })
}

module.exports = {
    University: University,
    saveUniversity: saveUniversity,
    findUniversity: findUniversity,
};