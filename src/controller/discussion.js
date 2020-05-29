const mongoose = require("mongoose");
const Question = mongoose.model("Question");
const User = require("./user");
const calcDate = require("../utils/calcDate");

exports.getDiscussionPage = (req, res) => {
  res.render("Class/Discussion/question");
};

exports.getQuestionPage = (req, res) => {
  res.render("Class/Discussion/questionPage");
};

exports.postQuestion = async (req, res) => {
  const response = req.body;
  const isEmail = checkIsEmail(response);
  const saveQuestion = await addNewQuestion(
    req.body.questionTitle,
    req.body.questionContent,
    isEmail,
    req.user
  );
  console.log(saveQuestion);
};

const checkIsEmail = (response) => {
  return !response.isEmail === "on";
};

const createLastActivity = (type, time, user) => {
  if (type === "new") {
    return {
      type: "new",
      activity: `${user.userNickname} started at ${time.toLocaleDateString()}`,
    };
  } else {
    const timeDiff = calcDate.timeDiffCalc(new Date(), time);
    const dateString = calcDate.dateToString(timeDiff);
    return {
      type: "update",
      activity: `${user.userNickname} replied ${dateString} ago`,
    };
  }
};

const addNewQuestion = async (
  questionTitle,
  questionContent,
  isEmail,
  user
) => {
  const lastActivity = createLastActivity("new", new Date(), user);
  const newQuestion = new Question({
    questionTitle: questionTitle,
    questionContent: questionContent,
    user: user,
    date: new Date(),
    lastActivityType: lastActivity.type,
    lastActivity: lastActivity.activity,
    isEmailResponse: isEmail,
  });
  try {
    const saved = await newQuestion.save();
    console.log("Question " + saved._id + "saved.");
    return saved;
  } catch (e) {
    throw e;
  }
};
