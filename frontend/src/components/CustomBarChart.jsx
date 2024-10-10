import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomBarChart = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>;
        }

    return (
        <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="rgba(75, 192, 192, 0.6)" />
        </BarChart>
    );
};

export default CustomBarChart;
