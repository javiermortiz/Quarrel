const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    question: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "answer"
        }
		],
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "comment"
			}
		]
});

QuestionSchema.statics.findMatches = (question) => {
    const Question = mongoose.model("question");
    return Question.find({ question: { $regex: new RegExp(question, 'i') } });
};

QuestionSchema.statics.findRelatedQuestions = (questionId) => {
    const Question = mongoose.model("question");
    return Question.findById(questionId)
        .then(foundQuestion => {
            const questionText = findLongestWord(foundQuestion.question)
            console.log(questionText);
            return Question.find({ question: { $regex: new RegExp(questionText, 'i') } });
        });
}

const findLongestWord = (sentence) => {
    let words = sentence.slice(0, -1).split(" ");
    let longestWord = words[0];
    for(i = 0; i < words.length; i++) {
        let currentWord = words[i];
        if (currentWord.length > longestWord.length) {
            longestWord = currentWord;
        }
    }
    return longestWord;
}

module.exports = mongoose.model("question", QuestionSchema);