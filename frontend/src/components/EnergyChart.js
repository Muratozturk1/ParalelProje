import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

function EnergyChart({ data }) {
    if (!data) {
        console.log('Data is null or undefined');
        return null;
    }

    console.log('Received data:', data);

    const chartData = [
        {
            name: 'Sequential',
            'Enerji Tüketimi': data.sequential?.energy || 0
        },
        {
            name: 'Basic Parallel',
            'Enerji Tüketimi': data.parallel?.energy || 0
        },
        {
            name: 'Improved Parallel',
            'Enerji Tüketimi': data.improved?.energy || 0
        },
        {
            name: 'Block-Based',
            'Enerji Tüketimi': data.blocked?.energy || 0
        },
        {
            name: 'Async Parallel',
            'Enerji Tüketimi': data.async?.energy || 0
        }
    ];

    console.log('Chart data:', chartData);

    return (
        <div className="chart-wrapper">
            <h5 className="text-center mb-3">Enerji Tüketimi Karşılaştırması</h5>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toFixed(2)} Joule`} />
                    <Legend />
                    <Bar dataKey="Enerji Tüketimi" fill="#0d6efd" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default EnergyChart; 