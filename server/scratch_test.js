require('dotenv').config();
const { generateQuestions } = require('./src/services/llm.service');

async function test() {
  try {
    console.log("Starting generation test...");
    const result = await generateQuestions({
      topic: 'Java arrays',
      difficulty: 'BEGINNER',
      questionCount: 1,
      questionType: 'MCQ',
      courseName: 'Java programming'
    });
    console.log("Success! Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Test Error:", err);
  }
}

test();
