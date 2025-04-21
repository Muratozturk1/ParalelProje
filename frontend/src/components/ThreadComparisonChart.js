import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ThreadComparisonChart({ data }) {
    // Veriyi grafikte kullanılacak formata dönüştür
    const chartData = data.map(item => ({
        threads: item.threads,
        'Basic Parallel': item.basicTime,
        'Improved Parallel': item.improvedTime,
        'Block-Based Parallel': item.blockedTime
    }));

    // Hızlanma verilerini oluştur
    const speedupData = data.map(item => ({
        threads: item.threads,
        'Basic Parallel': item.basicSpeedup,
        'Improved Parallel': item.improvedSpeedup,
        'Block-Based Parallel': item.blockedSpeedup
    }));

    // Verimlilik verilerini oluştur (Hızlanma / Thread Sayısı)
    const efficiencyData = data.map(item => ({
        threads: item.threads,
        'Basic Parallel': item.basicSpeedup / item.threads,
        'Improved Parallel': item.improvedSpeedup / item.threads,
        'Block-Based Parallel': item.blockedSpeedup / item.threads
    }));

    return (
        <div className="chart-wrapper">
            <h5 className="text-center mb-3">Thread Sayısına Göre Çalışma Süresi</h5>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threads" />
                    <YAxis />
                    <Tooltip formatter={(value) => value.toFixed(6)} />
                    <Legend />
                    <Line type="monotone" dataKey="Basic Parallel" stroke="#0d6efd" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Improved Parallel" stroke="#198754" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Block-Based Parallel" stroke="#dc3545" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>

            <h5 className="text-center mb-3 mt-5">Thread Sayısına Göre Hızlanma (Speedup)</h5>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={speedupData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threads" />
                    <YAxis />
                    <Tooltip formatter={(value) => value.toFixed(2)} />
                    <Legend />
                    <Line type="monotone" dataKey="Basic Parallel" stroke="#0d6efd" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Improved Parallel" stroke="#198754" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Block-Based Parallel" stroke="#dc3545" activeDot={{ r: 8 }} />
                    {/* İdeal (lineer) hızlanma çizgisi */}
                    <Line
                        type="monotone"
                        dataKey="threads"
                        name="İdeal Hızlanma"
                        stroke="#6c757d"
                        strokeDasharray="5 5"
                    />
                </LineChart>
            </ResponsiveContainer>

            <h5 className="text-center mb-3 mt-5">Thread Sayısına Göre Verimlilik</h5>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={efficiencyData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threads" />
                    <YAxis domain={[0, 1]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="Basic Parallel" stroke="#0d6efd" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Improved Parallel" stroke="#198754" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Block-Based Parallel" stroke="#dc3545" activeDot={{ r: 8 }} />
                    {/* İdeal verimlilik çizgisi (100%) */}
                    <Line
                        type="monotone"
                        dataKey={() => 1}
                        name="İdeal Verimlilik"
                        stroke="#6c757d"
                        strokeDasharray="5 5"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ThreadComparisonChart; 