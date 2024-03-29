const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");
mongoose.set("useFindAndModify", false);

// class objects that records the information of each school-class
const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    classCode: { type: String, required: true, trim: true },
    classSemester: { type: [String], required: true },
    classSession: { type: [String], required: true },
    classSection: { type: String },
    classUnits: { type: String, trim: true },
    classUniversity: { type: String, required: true },
    classPrereq: { type: String },
    classWebsite: { type: String },
    classDescription: { type: String, required: true },
    professor: { type: String, required: true, trim: true },
    dateCreated: Date,
    overallClassQualityRate: { type: Number, min: 0.0, max: 5.0 },
    overallClassDifficultyRate: { type: Number, min: 0.0, max: 5.0 },
    overallGradeScore: { type: Number, default: 0.0 },
    overallGradeLetter: { type: String, default: "N/A" },
    popularity: Number,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    // default value for isApproved is set to true
    isApproved: { type: Boolean, default: true },
    relatedClass: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema({
  questionTitle: {type: String, required: true},
  questionContent: { type: String, required: true },
  answers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Answer"},
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  views:{type: Number, default: 0},
  lastActivityType: {type: String},
  lastActivity: {type: String},
  sort: {type: Number},
  isHidden: {type: Boolean, default: false},
  topRatedAnswer:{type: String},
  isEmailResponse: {type: Boolean, default: true},
});

const answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  respondTo: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
  likes: { type: Number, required: true },
  isHidden: {type: Boolean, default: false},
});

// Review class that contains the information of each review
const reviewSchema = new mongoose.Schema(
  {
    reviewUser: { type: String, required: true },
    reviewUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewDate: Date,
    reviewClass: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    reviewSemester: String,
    reviewGrade: String,
    qualityRating: { type: Number, min: 0.0, max: 5.0 },
    difficultyRating: { type: Number, min: 0.0, max: 5.0 },
    reviewContent: String,
    hwLoad: { type: String },
    exam: { type: String },
  },
  { _id: true }
);

// User Information
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    userEmail: String,
    userNickname: { type: String, required: true },
    userUniversity: { type: String, required: true },
    userDateCreated: Date,
    userAvatarUrl: {
      type: String,
      default: "https://miro.medium.com/max/360/1*W35QUSvGpcLuxPo3SRTH4w.png",
    },
    followedClass: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    questions:[{type: mongoose.Schema.Types.ObjectId, ref:"Question"}],
    answers:[{type: mongoose.Schema.Types.ObjectId, ref:"Answer"}]
  },
  { _id: true }
);

// University Information
const universitySchema = new mongoose.Schema(
  {
    universityName: { type: String, required: true },
    universityAbbr: { type: String, required: true },
    universityDateCreated: Date,
    universityClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    universityUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: true }
);

// Admin Information for management
const adminSchema = new mongoose.Schema({
  adminUsername: { type: String, required: true },
  adminPassword: { type: String, required: true },
  adminName: { type: String, required: true },
  userManage: { type: Boolean, required: true, default: true },
  reviewManage: { type: Boolean, required: true, default: true },
  tagsManage: { type: Boolean, required: true, default: true },
  classManage: { type: Boolean, required: true, default: true },
  universityManage: { type: Boolean, required: true, default: true },
});

// Search Settings
classSchema.plugin(mongoose_fuzzy_searching, {
  fields: [
    {
      name: "className",
      prefixOnly: true,
      minSize: 3,
    },
    {
      name: "classCode",
      minSize: 2,
    },
    {
      name: "professor",
      prefixOnly: true,
      minSize: 3,
    },
  ],
});

// Register Schema
const Class = mongoose.model("Class", classSchema);
const Review = mongoose.model("Review", reviewSchema);
const User = mongoose.model("User", userSchema);
const University = mongoose.model("University", universitySchema);
const Question = mongoose.model("Question", questionSchema);
const Answer = mongoose.model("Answer", answerSchema);

function connectDB() {
  mongoose.connect(
    process.env.MONGO,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error) => {
      if (!error) {
        console.log(`Cloud Database Connection success!`);
      } else {
        console.log(error);
      }
    }
  );
  mongoose.connection.on("error", (err) => {
    console.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  });
}

// connect Database
connectDB();

// export User module
module.exports = {
  User: User,
  Class: Class,
  Review: Review,
};
