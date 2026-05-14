const Groq = require('groq-sdk');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('express-async-handler');

// Check if Groq API key exists
if (!process.env.GROQ_API_KEY) {
  console.error('❌ [AI ERROR] GROQ_API_KEY is missing from .env');
} else {
  console.log('✅ [AI SUCCESS] GROQ_API_KEY loaded successfully');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const { prisma } = require('../config/db');

/**
 * Handle AI chat requests using Groq (Llama-3.3-70b)
 */
const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  const systemPrompt = `
    You are SkillStation AI, a helpful and friendly learning assistant for the SkillStation EdTech platform.
    SkillStation is a premium AI-powered platform for students, institutions, and companies.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...(history || []).map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";

    res.status(200).json({
      status: 'success',
      reply
    });
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message,
      reply: `AI temporarily unavailable: ${error.message}`
    });
  }
});

/**
 * Generate AI Resume content based on student profile
 */
const generateResume = asyncHandler(async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { userId: req.user.id },
    include: {
      user: true,
      education: true,
      projects: true,
      skills: true,
      certifications: true
    }
  });

  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }

  const prompt = `
    Generate a professional, ATS-optimized resume for the following student:
    Name: ${student.user.name}
    Headline: ${student.headline || 'Aspiring Professional'}
    Bio: ${student.user.bio}
    Skills: ${student.skills.map(s => s.name).join(', ')}
    Education: ${student.education.map(e => `${e.degree} from ${e.institution} (${e.startYear}-${e.endYear})`).join('; ')}
    Projects: ${student.projects.map(p => `${p.title}: ${p.description}`).join('; ')}
    Certifications: ${student.certifications.map(c => c.title).join(', ')}

    Output should be in professional Markdown format.
    Include Sections: SUMMARY, EXPERIENCE (use projects if work exp is empty), EDUCATION, SKILLS, CERTIFICATIONS.
    Focus on impact and action verbs.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
    });

    const resumeMarkdown = completion.choices[0]?.message?.content || "";

    // Save resume data and update ATS score (randomized for demo)
    await prisma.student.update({
      where: { id: student.id },
      data: {
        resumeData: { markdown: resumeMarkdown },
        atsScore: Math.floor(Math.random() * (95 - 75 + 1) + 75) // 75-95
      }
    });

    res.json({
      status: 'success',
      resume: resumeMarkdown
    });
  } catch (error) {
    throw new ApiError(500, 'AI Resume generation failed: ' + error.message);
  }
});

module.exports = {
  chat,
  generateResume
};
