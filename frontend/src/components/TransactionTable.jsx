import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/transactions'); 
             setTransactions(response.data || []);
             } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(transactions) && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>No transactions available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TransactionTable;
