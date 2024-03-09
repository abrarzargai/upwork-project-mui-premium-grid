const express = require('express');
const routes = require('./api/api');
const globalErrHandler = require('./utils/errorController');
const AppError = require('./utils/appError');
const app = express();
const cors = require('cors')

app.use(express.json());

// Allow Cross-Origin requests
app.use(cors());

// Routes
app.use('/api', routes);

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;