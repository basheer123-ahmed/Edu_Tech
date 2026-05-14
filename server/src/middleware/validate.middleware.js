const Joi = require('joi');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const object = {};
  const validSchema = {};
  Object.keys(schema).forEach((key) => {
    if (req[key]) {
      object[key] = req[key];
      validSchema[key] = schema[key];
    }
  });

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(400, errorMessage));
  }
  
  if (value.params) Object.assign(req.params, value.params);
  if (value.query) Object.assign(req.query, value.query);
  if (value.body) Object.assign(req.body, value.body);
  
  return next();
};

module.exports = validate;
