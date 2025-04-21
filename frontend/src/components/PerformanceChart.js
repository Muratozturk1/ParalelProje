import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

function PerformanceChart({ data }) {
    // Veriyi ReCharts için uygun formata dönüştür
    const chartData = [
        {
            name: 'Sıralı Algoritma',
            süre: data.sequential.time,
            hızlanma: data.sequential.speedup
        },
        {
            name: 'Temel Paralel',
            süre: data.parallel.time,
            hızlanma: data.parallel.speedup
        },
        {
            name: 'Geliştirilmiş Paralel',
            süre: data.improved.time,
            hızlanma: data.improved.speedup
        },
        {
            name: 'Block-Based',
            süre: data.blocked.time,
            hızlanma: data.blocked.speedup
        }
    ];

    const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'];

    return (
        <div className="chart-wrapper">
            <h5 className="text-center mb-3">Çalışma Süresi Karşılaştırması</h5>
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
                    <YAxis label={{ value: 'Çalışma Süresi (sn)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => value.toFixed(6)} />
                    <Legend />
                    <Bar dataKey="süre" name="Çalışma Süresi">
                        {
                            chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <h5 className="text-center mb-3 mt-5">Hızlanma (Speedup) Karşılaştırması</h5>
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
                    <YAxis label={{ value: 'Hızlanma (Speedup)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Legend />
                    <Bar dataKey="hızlanma" name="Hızlanma">
                        {
                            chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PerformanceChart; 