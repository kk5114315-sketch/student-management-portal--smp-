// 404 for unknown routes
exports.notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });

// Central error handler -> consistent JSON errors
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';
  let errors;

  if (err.name === 'ValidationError') {
    status = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = `A student with this ${field === 'rollNo' ? 'roll number' : field} already exists`;
  } else if (err.name === 'CastError') {
    status = 400;
    message = err.path === '_id' ? 'Invalid student ID' : `Invalid value for ${err.path}`;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  if (status === 500) console.error(err);
  res.status(status).json({ success: false, message, ...(errors && { errors }) });
};
