import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CustomBarChart from './CustomBarChart'; 
import CustomPieChart from './CustomPieChart'; 

const Statistics = () => {
    const [statistics, setStatistics] = useState({}); 
    const [barChartData, setBarChartData] = useState([]); 
    const [pieChartData, setPieChartData] = useState([]); 
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); 
    const [products, setProducts] = useState([]); 

    const months = [
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' },
    ];

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/statistics?month=${selectedMonth}`);
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error.response ? error.response.data : error.message);
        }
    };

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/bar-chart?month=${selectedMonth}`);
            setBarChartData(response.data);
        } catch (error) {
            console.error('Error fetching bar chart data:', error.response ? error.response.data : error.message);
        }
    };

    const fetchPieChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/transactions/pie-chart?month=${selectedMonth}`);
            setPieChartData(response.data);
        } catch (error) {
            console.error('Error fetching pie chart data:', error.response ? error.response.data : error.message);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://fakestoreapi.com/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchStatistics();
        fetchBarChartData();
        fetchPieChartData();
        fetchProducts();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        event.preventDefault();
        setSelectedMonth(event.target.value);
    };

    return (
        <Paper style={{ padding: '16px' }}>
            <Typography variant="h5">Statistics for Month: {months[selectedMonth + 1].label}</Typography>
            <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                >
                    {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                            {month.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography>Total Sales: {statistics.totalSales || 0}</Typography>
            <Typography>Total Sold Items: {statistics.totalSoldItems || 0}</Typography>
            <Typography>Total Not Sold Items: {statistics.totalNotSoldItems || 0}</Typography>
            
            <Typography variant="h6" style={{ marginTop: '16px' }}>Products:</Typography>
            {products.map((product) => (
                <Paper key={product.id} style={{ padding: '8px', margin: '8px 0' }}>
                    <Typography variant="subtitle1">{product.title}</Typography>
                    <Typography variant="body2">Price: ${product.price}</Typography>
                    <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                </Paper>
            ))}
            
            <CustomBarChart data={barChartData} />
            <CustomPieChart data={pieChartData} />
        </Paper>
    );
};

export default Statistics;
