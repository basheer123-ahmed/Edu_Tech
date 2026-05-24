const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const hpp = require('hpp');

const cookieParser = require('cookie-parser');
const { rateLimit } = require('express-rate-limit');
const logger = require('./utils/logger');
const { errorConverter, errorHandler } = require('./middleware/error.middleware');
const ApiError = require('./utils/ApiError');

const app = express();

// --- Security Middleware ---
// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

// Enable CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

// Global Request Logger for Debugging
app.use((req, res, next) => {
  if (req.path.startsWith('/api/ai')) {
    console.log(`🤖 [AI REQUEST] ${req.method} ${req.path}`);
  }
  next();
});

// Rate Limiting (10000 requests per 15 minutes for development and testing robustness)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);



// Prevent HTTP Parameter Pollution
app.use(hpp());

// --- Performance Middleware ---
// Gzip compression
app.use(compression());

// Parsing body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api/dashboards', require('./routes/dashboard.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/profile', require('./routes/studentProfile.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/student', require('./routes/student.routes'));
app.use('/api/otp', require('./routes/otp.routes'));
app.use('/api/public', require('./routes/public.routes'));
app.use('/api/institutions', require('./routes/institution.routes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

// --- Error Handling ---
// Convert error to ApiError if needed
app.use(errorConverter);

// Global error handler
app.use(errorHandler);

module.exports = app;

