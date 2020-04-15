const mongoose = require("mongoose");
const University = mongoose.model("University");


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