const express = require('express');
const transactionRouter = express.Router();
const transactionController = require('../controllers/transactionController');
const { check, validationResult } = require('express-validator');

const validateQueryParams = [
    check('month').isInt({ min: 0, max: 11 }).withMessage('Month must be an integer between 0 and 11'),
];

transactionRouter.get('/initialize', transactionController.initializeDatabase);

transactionRouter.get('/list', transactionController.listTransactions);

transactionRouter.get('/statistics', validateQueryParams, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    transactionController.getStatistics(req, res, next);
});

transactionRouter.get('/bar-chart', validateQueryParams, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    transactionController.getBarChartData(req, res, next);
});

transactionRouter.get('/pie-chart', validateQueryParams, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    transactionController.getPieChartData(req, res, next);
});

transactionRouter.get('/combined', transactionController.getCombinedData);

module.exports = transactionRouter;
