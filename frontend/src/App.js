import React, { useState } from 'react';
import './App.css';
import MatrixForm from './components/MatrixForm';
import PerformanceChart from './components/PerformanceChart';
import ResultTable from './components/ResultTable';
import ThreadComparisonChart from './components/ThreadComparisonChart';
import EnergyChart from './components/EnergyChart';

function App() {
    const [results, setResults] = useState(null);
    const [pastResults, setPastResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Zaman değerlerini formatlamak için yardımcı fonksiyon
    const formatTime = (value) => {
        if (value === 0) return '0.000000';
        return value.toFixed(6);
    };

    // Tek algoritma sonucunu karşılaştırma formatına dönüştüren fonksiyon
    const convertToComparisonFormat = (singleResult) => {
        const comparisonData = {
            matrixSize: singleResult.size,
            availableThreads: singleResult.threadCount,
            sequential: { time: 0, speedup: 0, efficiency: 0, energy: 0 },
            parallel: { time: 0, speedup: 0, efficiency: 0, energy: 0 },
            improved: { time: 0, speedup: 0, efficiency: 0, energy: 0 },
            blocked: { time: 0, speedup: 0, efficiency: 0, energy: 0 },
            async: { time: 0, speedup: 0, efficiency: 0, energy: 0 }
        };

        if (singleResult.algorithm === 'sequential') {
            comparisonData.sequential = {
                time: singleResult.executionTime,
                speedup: 1.0,
                efficiency: 100.0,
                energy: singleResult.energyConsumption
            };
        }
        else if (singleResult.algorithm === 'basic_parallel') {
            comparisonData.parallel = {
                time: singleResult.executionTime,
                speedup: singleResult.executionTime > 0 ? comparisonData.sequential.time / singleResult.executionTime : 1.0,
                efficiency: singleResult.executionTime > 0 ? (comparisonData.sequential.time / singleResult.executionTime) / singleResult.threadCount * 100 : 0,
                energy: singleResult.energyConsumption
            };
        }
        else if (singleResult.algorithm === 'improved_parallel') {
            comparisonData.improved = {
                time: singleResult.executionTime,
                speedup: singleResult.executionTime > 0 ? comparisonData.sequential.time / singleResult.executionTime : 1.0,
                efficiency: singleResult.executionTime > 0 ? (comparisonData.sequential.time / singleResult.executionTime) / singleResult.threadCount * 100 : 0,
                energy: singleResult.energyConsumption
            };
        }
        else if (singleResult.algorithm === 'block_based') {
            comparisonData.blocked = {
                time: singleResult.executionTime,
                speedup: singleResult.executionTime > 0 ? comparisonData.sequential.time / singleResult.executionTime : 1.0,
                efficiency: singleResult.executionTime > 0 ? (comparisonData.sequential.time / singleResult.executionTime) / singleResult.threadCount * 100 : 0,
                energy: singleResult.energyConsumption
            };
        }
        else if (singleResult.algorithm === 'async_parallel') {
            comparisonData.async = {
                time: singleResult.executionTime,
                speedup: singleResult.executionTime > 0 ? comparisonData.sequential.time / singleResult.executionTime : 1.0,
                efficiency: singleResult.executionTime > 0 ? (comparisonData.sequential.time / singleResult.executionTime) / singleResult.threadCount * 100 : 0,
                energy: singleResult.energyConsumption
            };
        }

        return comparisonData;
    };

    const handleSubmit = async (params) => {
        setLoading(true);
        setError(null);

        try {
            let results = [];

            if (params.mode === 'compare') {
                // Tüm algoritmaları sırayla çalıştır
                const algorithms = ['sequential', 'basic_parallel', 'improved_parallel', 'block_based', 'async_parallel'];
                for (const algorithm of algorithms) {
                    const response = await fetch('/api/matrix/multiply', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            size: params.size,
                            threadCount: params.threads,
                            algorithm: algorithm
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`API request failed: ${algorithm}`);
                    }

                    const data = await response.json();
                    results.push(data);
                }

                // Sonuçları birleştir
                const comparisonData = {
                    matrixSize: params.size,
                    availableThreads: params.threads,
                    sequential: {
                        time: results[0].executionTime,
                        speedup: 1.0,
                        efficiency: 100.0,
                        energy: results[0].energyConsumption
                    },
                    parallel: {
                        time: results[1].executionTime,
                        speedup: results[0].executionTime / results[1].executionTime,
                        efficiency: (results[0].executionTime / results[1].executionTime) / params.threads * 100,
                        energy: results[1].energyConsumption
                    },
                    improved: {
                        time: results[2].executionTime,
                        speedup: results[0].executionTime / results[2].executionTime,
                        efficiency: (results[0].executionTime / results[2].executionTime) / params.threads * 100,
                        energy: results[2].energyConsumption
                    },
                    blocked: {
                        time: results[3].executionTime,
                        speedup: results[0].executionTime / results[3].executionTime,
                        efficiency: (results[0].executionTime / results[3].executionTime) / params.threads * 100,
                        energy: results[3].energyConsumption
                    },
                    async: {
                        time: results[4].executionTime,
                        speedup: results[0].executionTime / results[4].executionTime,
                        efficiency: (results[0].executionTime / results[4].executionTime) / params.threads * 100,
                        energy: results[4].energyConsumption
                    }
                };

                setResults(comparisonData);
                setPastResults(prev => [...prev, {
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString(),
                    data: comparisonData
                }]);
            } else {
                // Tek algoritma çalıştır
                const response = await fetch('/api/matrix/multiply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        size: params.size,
                        threadCount: params.threads,
                        algorithm: params.mode
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'API request failed.');
                }

                const data = await response.json();
                const formattedData = convertToComparisonFormat(data);
                setResults(formattedData);
                setPastResults(prev => [...prev, {
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString(),
                    data: formattedData
                }]);
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResult = (id) => {
        setPastResults(prev => prev.filter(result => result.id !== id));
    };

    // Geçmiş Sonuç Kartı Bileşeni
    const ResultCard = ({ result, onDelete }) => {
        const { data, timestamp, id } = result;

        return (
            <div className="card mb-3 result-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <strong>
                            {data.sequential
                                ? "Karşılaştırma"
                                : `${data.algorithm.toUpperCase()} Algoritması`}
                        </strong>
                        <span className="text-muted ms-2 small">{timestamp}</span>
                    </div>
                    <button
                        className="btn btn-sm btn-outline-danger py-0 px-2"
                        onClick={() => onDelete(id)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
                <div className="card-body">
                    {data.sequential ? (
                        <div>
                            <p className="mb-1">Matris Boyutu: {data.matrixSize} x {data.matrixSize}</p>
                            <p className="mb-1">Thread Sayısı: {data.availableThreads}</p>
                            <div className="row small text-muted">
                                <div className="col">
                                    <div>Sequential: {formatTime(data.sequential.time)} s</div>
                                    <div className="text-primary">Enerji: {data.sequential.energy?.toFixed(2) || '0.00'} J</div>
                                </div>
                                <div className="col">
                                    <div>Basic Parallel: {formatTime(data.parallel.time)} s</div>
                                    <div className="text-primary">Enerji: {data.parallel.energy?.toFixed(2) || '0.00'} J</div>
                                </div>
                                <div className="col">
                                    <div>Improved Parallel: {formatTime(data.improved.time)} s</div>
                                    <div className="text-primary">Enerji: {data.improved.energy?.toFixed(2) || '0.00'} J</div>
                                </div>
                                <div className="col">
                                    <div>Block-Based: {formatTime(data.blocked.time)} s</div>
                                    <div className="text-primary">Enerji: {data.blocked.energy?.toFixed(2) || '0.00'} J</div>
                                </div>
                                <div className="col">
                                    <div>Async Parallel: {formatTime(data.async.time)} s</div>
                                    <div className="text-primary">Enerji: {data.async.energy?.toFixed(2) || '0.00'} J</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-1">Matris Boyutu: {data.matrixSize} x {data.matrixSize}</p>
                            <p className="mb-1">Çalışma Süresi: {formatTime(data.executionTime)} s</p>
                            <p className="mb-1">Hızlanma (Speedup): {data.speedup ? data.speedup.toFixed(2) : '1.00'}x</p>
                            <p className="mb-1">Enerji Tüketimi: {data.energyConsumption?.toFixed(2) || '0.00'} J</p>
                            <p className="mb-0">Thread Sayısı: {data.threads || "Varsayılan"}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <header className="text-center my-5">
                <h1 className="display-4">Paralel Matris Çarpımı Performans Analizi</h1>
                <p className="lead">
                    Matris çarpımı için sıralı ve paralel algoritmaların performans karşılaştırması
                </p>
            </header>

            <div className="row">
                <div className="col-md-5">
                    <div className="section">
                        <h2 className="title">Ayarlar</h2>
                        <MatrixForm onSubmit={handleSubmit} />
                    </div>

                    {pastResults.length > 0 && (
                        <div className="section mt-4">
                            <h2 className="title">Geçmiş Sonuçlar</h2>
                            <div className="past-results">
                                <div className="row">
                                    {pastResults.map(result => (
                                        <div className="col-md-6 col-lg-6 mb-3" key={result.id}>
                                            <ResultCard
                                                result={result}
                                                onDelete={handleDeleteResult}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-7">
                    {loading && (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Yükleniyor...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {results && (
                        <div className="section">
                            <h2 className="title">Sonuçlar</h2>
                            <ResultTable data={results} />
                            <div className="mt-4">
                                <PerformanceChart data={results} />
                            </div>
                            <div className="mt-4">
                                <ThreadComparisonChart data={results} />
                            </div>
                            <div className="mt-4">
                                <EnergyChart data={results} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="text-center mt-5 mb-4 text-muted">
                <p>
                    Paralel Hesaplama Dersi Projesi &copy; {new Date().getFullYear()}
                </p>
            </footer>
        </div>
    );
}

export default App; 