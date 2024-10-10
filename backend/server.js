const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

const transactionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

const app = express();
app.use(cors()); 
app.use(express.json()); 
app.get('/api/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.deleteMany(); 
        await Transaction.insertMany(transactions); 
        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
});

app.get('/api/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    const query = {
        dateOfSale: { $gte: startDate, $lte: endDate },
    };

    if (search) {
        const regex = new RegExp(search, 'i');
        query.$or = [
            { title: regex },
            { description: regex },
            { price: regex }
        ];
    }

    try {
        const total = await Transaction.countDocuments(query);
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        res.status(200).json({ total, transactions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
});

app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month parameter. It must be between 1 and 12.' });
    }

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: '$price' }, soldItems: { $sum: 1 } } }
        ]);

        const totalNotSold = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lte: endDate },
            sold: false
        });

        res.status(200).json({
            totalSales: totalSales[0]?.total || 0,
            totalSoldItems: totalSales[0]?.soldItems || 0,
            totalNotSoldItems: totalNotSold,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
});

app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    try {
        const barChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $bucket: {
                groupBy: "$price",
                boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                default: "901-above",
                output: { count: { $sum: 1 } }
            }}
        ]);

        res.status(200).json(barChartData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
});

app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json(pieChartData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
});

// Combined API
app.get('/api/combined-data', async (req, res) => {
    const { month } = req.query;

    if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid month parameter. It must be between 1 and 12.' });
    }

    const startDate = new Date(new Date().getFullYear(), month - 1, 1);
    const endDate = new Date(new Date().getFullYear(), month, 0);

    try {
        const statistics = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: null, total: { $sum: '$price' }, soldItems: { $sum: 1 } } }
        ]);

        const barChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $bucket: {
                groupBy: "$price",
                boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                default: "901-above",
                output: { count: { $sum: 1 } }
            }}
        ]);

        const pieChartData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json({ statistics, barChartData, pieChartData });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
