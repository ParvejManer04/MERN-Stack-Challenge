import React, { useEffect, useState } from 'react';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import { Container, Typography, AppBar, Toolbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const App = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [dataInitialized, setDataInitialized] = useState(false);

    const initializeDatabase = async () => {
        try {
            await axios.get('/api/transactions/initialize');
            setDataInitialized(true);
        } catch (error) {
            console.error('Error initializing database:', error);
        }
    };

    useEffect(() => {
        if (!dataInitialized) {
            initializeDatabase();
        }
    }, [dataInitialized]);

    const handleMonthChange = (event) => {
        setMonth(event.target.value); // Update the month state
    };

    return (
        <Container maxWidth="lg">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Product Transactions</Typography>
                </Toolbar>
            </AppBar>
            <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select value={month} onChange={handleMonthChange}>
                    {[...Array(12)].map((_, index) => (
                        <MenuItem key={index + 1} value={index + 1}>
                            {new Date(0, index).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TransactionTable month={month} />
            <Statistics month={month} />
        </Container>
    );
};

export default App;
