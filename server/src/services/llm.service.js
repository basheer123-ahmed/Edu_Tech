const Groq = require('groq-sdk');
const { OpenAI } = require('openai');

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Helper to safely extract JSON arrays from LLM response text
 */
function extractJSONArray(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (e) {
    console.log("⚠️ Direct JSON parse failed, running fallback regex extraction...");
    // Find first '[' and last ']'
    const startIdx = trimmed.indexOf('[');
    const endIdx = trimmed.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonCandidate = trimmed.substring(startIdx, endIdx + 1);
      try {
        // Simple regex cleanup for common trailing commas before closing braces/brackets
        const cleaned = jsonCandidate
          .replace(/,\s*([\]}])/g, '$1')
          .trim();
        return JSON.parse(cleaned);
      } catch (innerErr) {
        console.error("❌ Fallback JSON candidate parsing failed:", innerErr);
        throw new Error("AI returned malformed JSON structure: " + innerErr.message);
      }
    }
    throw new Error("AI response did not contain a valid JSON array block: " + trimmed.substring(0, 150) + "...");
  }
}

/**
 * Validates question schema completeness
 */
function validateQuestionSchema(q, type) {
  if (type === 'MCQ') {
    if (!q.text || typeof q.text !== 'string') throw new Error("Question text is missing or invalid");
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error("MCQ options must be an array of at least 2 items");
    }
    if (!q.correctOption || typeof q.correctOption !== 'string') {
      throw new Error("MCQ correctOption is missing");
    }
    // Ensure correctOption is one of the options
    if (!q.options.includes(q.correctOption)) {
      q.options.push(q.correctOption); // Auto-recover
    }
  } else if (type === 'CODING') {
    if (!q.title || typeof q.title !== 'string') throw new Error("Coding problem title is missing");
    if (!q.text || typeof q.text !== 'string') throw new Error("Coding problem description text is missing");
    if (!q.starterCode || typeof q.starterCode !== 'object') {
      throw new Error("Coding starterCode object is missing");
    }
    if (!q.starterCode.javascript && !q.starterCode.python) {
      throw new Error("Coding starterCode must provide javascript or python templates");
    }
    if (!Array.isArray(q.testCases) || q.testCases.length === 0) {
      throw new Error("Coding testCases must be a non-empty array");
    }
    for (let tc of q.testCases) {
      if (tc.input === undefined || tc.output === undefined) {
        throw new Error("Each test case must define input and output fields");
      }
    }
  }
  return true;
}

/**
 * AI Question Generator (Orchestrator for batching, topic cycling, and deduplication)
 */
async function generateQuestions({ moduleName, topics, difficulty, questionCount, questionType, courseName }) {
  // Normalize topics to array
  let topicsList = [];
  if (Array.isArray(topics)) {
    topicsList = topics;
  } else if (typeof topics === 'string') {
    topicsList = topics.split(',').map(t => t.trim()).filter(Boolean);
  }
  if (topicsList.length === 0) {
    topicsList = ['General concepts'];
  }

  const normalizedCount = parseInt(questionCount) || 10;
  const batchSize = 10;
  const numBatches = Math.ceil(normalizedCount / batchSize);
  let allGenerated = [];

  console.log(`🚀 Starting Bulk AI Generation: Total Questions=${normalizedCount}, Batches=${numBatches}, Topics=`, topicsList);

  for (let b = 0; b < numBatches; b++) {
    const currentBatchCount = Math.min(batchSize, normalizedCount - (b * batchSize));
    const currentTopic = topicsList[b % topicsList.length];
    
    // Cycle question type if 'BOTH' is requested
    let currentType = questionType;
    if (questionType.toUpperCase() === 'BOTH') {
      currentType = (b % 2 === 0) ? 'MCQ' : 'CODING';
    }

    console.log(`📦 Batch ${b + 1}/${numBatches}: Generating ${currentBatchCount} questions of type ${currentType} for topic "${currentTopic}"`);

    try {
      const batchResult = await generateBatch({
        moduleName,
        topic: currentTopic,
        difficulty,
        questionCount: currentBatchCount,
        questionType: currentType,
        courseName
      });
      allGenerated = allGenerated.concat(batchResult);
    } catch (err) {
      console.error(`❌ Batch ${b + 1} failed:`, err.message);
      // If a batch fails, continue to next batches to get as many questions as possible
    }
  }

  // Deduplicate questions by text/title
  const seen = new Set();
  const uniqueQuestions = [];
  for (const q of allGenerated) {
    const key = (q.text || q.title || '').trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueQuestions.push(q);
    }
  }

  // Handle deficit if deduplication removed items
  let deficit = normalizedCount - uniqueQuestions.length;
  let attempts = 0;
  while (deficit > 0 && attempts < 2 && uniqueQuestions.length > 0) {
    attempts++;
    console.log(`⚠️ Deficit of ${deficit} questions detected due to deduplication. Generating filler questions...`);
    const fillerTopic = topicsList[attempts % topicsList.length];
    let fillerType = questionType;
    if (questionType.toUpperCase() === 'BOTH') {
      fillerType = Math.random() > 0.5 ? 'MCQ' : 'CODING';
    }

    try {
      const fillerResult = await generateBatch({
        moduleName,
        topic: fillerTopic,
        difficulty,
        questionCount: Math.min(deficit, 5),
        questionType: fillerType,
        courseName
      });

      for (const q of fillerResult) {
        const key = (q.text || q.title || '').trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueQuestions.push(q);
          deficit--;
        }
      }
    } catch (err) {
      console.error("❌ Filler batch generation failed:", err.message);
      break;
    }
  }

  console.log(`✅ Bulk AI Generation complete. Created ${uniqueQuestions.length} unique questions.`);
  return uniqueQuestions;
}

/**
 * Generates a single batch of questions focusing on a specific topic
 */
async function generateBatch({ moduleName, topic, difficulty, questionCount, questionType, courseName }) {
  const prompt = `You are an expert curriculum writer.
Generate exactly ${questionCount} unique questions of type "${questionType}" for the course "${courseName}" on the topic "${topic}" within the module "${moduleName || 'General'}".
The difficulty should be "${difficulty}".

Output MUST be a valid JSON array matching the schema, with NO markdown formatting, NO code blocks, and NO trailing commas.

Schema for MCQ:
[
  {
    "text": "Question text here?",
    "type": "MCQ",
    "points": 10,
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": "Option A"
  }
]

Schema for CODING:
[
  {
    "title": "Problem Title",
    "text": "Problem description with constraints, input, output details here.",
    "type": "CODING",
    "points": 20,
    "starterCode": {
      "javascript": "function solve(a, b) {\\n  // write code\\n}",
      "python": "def solve(a, b):\\n    pass",
      "cpp": "int solve(int a, int b) {\\n    return 0;\\n}",
      "java": "public class Solution {\\n    public static int solve(int a, int b) {\\n        return 0;\\n    }\\n}"
    },
    "testCases": [
      { "input": "2,3", "output": "5" },
      { "input": "-1,1", "output": "0" }
    ],
    "hiddenTestCases": [
      { "input": "10,15", "output": "25" }
    ]
  }
]`;

  let lastError = null;
  const retries = 2;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      let responseText = '';
      
      if (groq) {
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'llama-3.1-8b-instant',
          temperature: 0.3,
        });
        responseText = chatCompletion.choices[0].message.content;
      } else if (openai) {
        const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-3.5-turbo',
          temperature: 0.3,
        });
        responseText = chatCompletion.choices[0].message.content;
      } else {
        throw new Error('No AI API Keys configured in .env file.');
      }

      const parsedArray = extractJSONArray(responseText);
      
      // Validate schema items
      for (let item of parsedArray) {
        validateQuestionSchema(item, questionType);
      }

      return parsedArray;

    } catch (error) {
      console.error(`❌ Batch generation attempt ${attempt} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(`Batch generation failed: ${lastError.message}`);
}

module.exports = { generateQuestions };
