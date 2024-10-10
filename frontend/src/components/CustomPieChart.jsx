import React from 'react';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';

const CustomPieChart = ({ data }) => {
    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>; 
        
    }

    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                dataKey="value"
                nameKey="name" 
                
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="rgba(75, 192, 192, 0.6)"
                label
                
                
            />
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default CustomPieChart;
