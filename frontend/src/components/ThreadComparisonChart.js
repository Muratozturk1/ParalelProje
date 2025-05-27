import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ThreadComparisonChart({ data }) {
    if (!data) return null;

    return (
        <div className="chart-wrapper">
            <div className="alert alert-secondary mt-3 small">
                <strong>Matris Boyutu:</strong> {data.matrixSize} x {data.matrixSize} <br />
                <strong>Kullanılabilir Thread Sayısı:</strong> {data.availableThreads} <br />
            </div>
        </div>
    );
}

export default ThreadComparisonChart; 