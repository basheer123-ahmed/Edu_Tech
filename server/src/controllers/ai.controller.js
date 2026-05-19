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
  const userId = req.user?.id || req.user?.userId;

  console.log(`[AI Chat DEBUG] Request received from User ID: ${userId}, Email: ${req.user?.email || 'N/A'}`);
  console.log('[AI Chat DEBUG] Message snippet:', message ? message.slice(0, 50) : 'none');
  console.log('[AI Chat DEBUG] History length:', history?.length || 0);

  if (!userId) {
    console.warn('[AI Chat DEBUG] Unauthorized access attempt (user context missing)');
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: User context is missing.'
    });
  }

  if (!message) {
    console.warn('[AI Chat DEBUG] Bad Request: Message is required');
    return res.status(400).json({
      status: 'error',
      message: 'Message is required'
    });
  }

  const systemPrompt = `
    You are SkillStation AI, a helpful and friendly learning assistant for the SkillStation EdTech platform.
    SkillStation is a premium AI-powered platform for students, institutions, and companies.
  `;

  try {
    console.log('[AI Chat DEBUG] Calling Groq API...');
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
    console.log('[AI Chat DEBUG] Groq API success. Reply length:', reply.length);

    res.status(200).json({
      status: 'success',
      reply
    });
  } catch (error) {
    console.error('[AI Chat DEBUG] Groq API Error:', error.message);
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
  const userId = req.user?.id || req.user?.userId;
  console.log(`[AI Resume DEBUG] Request received from User ID: ${userId}, Email: ${req.user?.email || 'N/A'}`);

  if (!userId) {
    console.warn('[AI Resume DEBUG] Unauthorized access attempt (user context missing)');
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: User context is missing.'
    });
  }

  const student = await prisma.student.findUnique({
    where: { userId: userId },
    include: {
      user: true,
      education: true,
      project: true,
      skill: true,
      certification: true
    }
  });

  if (!student) {
    console.warn(`[AI Resume DEBUG] Student profile not found for userId: ${userId}`);
    return res.status(404).json({
      status: 'error',
      message: 'Student profile not found'
    });
  }

  const prompt = `
    Generate a professional, ATS-optimized resume for the following student:
    Name: ${student.user.name}
    Headline: ${student.headline || 'Aspiring Professional'}
    Bio: ${student.user.bio}
    Skills: ${student.skill.map(s => s.name).join(', ')}
    Education: ${student.education.map(e => `${e.degree} from ${e.institution} (${e.startYear}-${e.endYear})`).join('; ')}
    Projects: ${student.project.map(p => `${p.title}: ${p.description}`).join('; ')}
    Certifications: ${student.certification.map(c => c.title).join(', ')}

    Output should be in professional Markdown format.
    Include Sections: SUMMARY, EXPERIENCE (use projects if work exp is empty), EDUCATION, SKILLS, CERTIFICATIONS.
    Focus on impact and action verbs.
  `;

  try {
    console.log('[AI Resume DEBUG] Calling Groq API for resume generation...');
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
    });

    const resumeMarkdown = completion.choices[0]?.message?.content || "";
    console.log('[AI Resume DEBUG] Groq API success. Resume length:', resumeMarkdown.length);

    // Save resume data and update ATS score (randomized for demo)
    console.log('[AI Resume DEBUG] Saving resume to database and updating ATS score...');
    await prisma.student.update({
      where: { id: student.id },
      data: {
        resumeData: { markdown: resumeMarkdown },
        atsScore: Math.floor(Math.random() * (95 - 75 + 1) + 75) // 75-95
      }
    });
    console.log('[AI Resume DEBUG] Resume database update complete.');

    res.status(200).json({
      status: 'success',
      resume: resumeMarkdown
    });
  } catch (error) {
    console.error('[AI Resume DEBUG] Groq API or Database Error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'AI Resume generation failed: ' + error.message
    });
  }
});

module.exports = {
  chat,
  generateResume
};
