import React, { useState, useEffect } from 'react';
import OptimizationResult from './OptimizationResult';

function MatrixForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        mode: 'compare',
        size: 500,
        threads: 4
    });

    const [optimizationResult, setOptimizationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const [algorithms, setAlgorithms] = useState([
        { id: 'compare', name: 'Compare All Algorithms' },
        { id: 'sequential', name: 'Sequential Algorithm' },
        { id: 'basic_parallel', name: 'Basic Parallel Algorithm' },
        { id: 'improved_parallel', name: 'Improved Parallel Algorithm' },
        { id: 'block_based', name: 'Block-Based Parallel Algorithm' },
        { id: 'async_parallel', name: 'Async Parallel Algorithm' }
    ]);

    useEffect(() => {
        // API'den algoritma listesini al
        fetch('/api/matrix/algorithms')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    // Karşılaştırma seçeneğini başa ekle
                    setAlgorithms([
                        { id: 'compare', name: 'Tüm Algoritmaları Karşılaştır' },
                        ...data
                    ]);
                }
            })
            .catch(error => console.error('Algoritma listesi alınamadı:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Thread sayısı girişini devre dışı bırakma kontrolü
        if (name === 'mode') {
            const isThreadInputDisabled = value === 'sequential';
            setFormData(prev => ({
                ...prev,
                threads: isThreadInputDisabled ? 1 : prev.threads
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleOptimize = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/Matrix/optimize?matrixSize=${formData.size}&maxThreadCount=16`);
            if (!response.ok) {
                throw new Error('Optimizasyon işlemi başarısız oldu');
            }
            const data = await response.json();
            setOptimizationResult(data);
        } catch (error) {
            console.error('Optimizasyon hatası:', error);
            alert('Optimizasyon işlemi sırasında bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="mode" className="form-label mb-1 fw-bold small">Algoritma Seçimi</label>
                    <select
                        id="mode"
                        name="mode"
                        className="form-select form-select-sm"
                        value={formData.mode}
                        onChange={handleChange}
                    >
                        {algorithms.map(alg => (
                            <option key={alg.id} value={alg.id}>
                                {alg.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label htmlFor="size" className="form-label mb-1 fw-bold small">
                        Matris Boyutu: {formData.size}x{formData.size}
                    </label>
                    <input
                        type="range"
                        className="form-range"
                        id="size"
                        name="size"
                        min="500"
                        max="1500"
                        step="100"
                        value={formData.size}
                        onChange={handleChange}
                    />
                    <div className="d-flex justify-content-between small">
                        <small>500</small>
                        <small>1000</small>
                        <small>1500</small>
                    </div>
                </div>

                <div className="mb-2">
                    <label htmlFor="threads" className="form-label mb-1 fw-bold small">
                        Thread Sayısı: {formData.threads}
                    </label>
                    <input
                        type="range"
                        className="form-range"
                        id="threads"
                        name="threads"
                        min="1"
                        max="16"
                        value={formData.threads}
                        onChange={handleChange}
                        disabled={formData.mode === 'sequential'}
                    />
                    <div className="d-flex justify-content-between small">
                        <small>1</small>
                        <small>8</small>
                        <small>16</small>
                    </div>
                </div>

                <div className="alert alert-info py-2 small mb-2">
                    <strong>Bilgi:</strong> Büyük matris boyutları (1000+) hesaplama süresini belirgin şekilde artırabilir.
                </div>

                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-sm">
                        {formData.mode === 'compare' ? 'Karşılaştır' : 'Hesapla'}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={handleOptimize}
                        disabled={loading}
                    >
                        {loading ? 'Optimizasyon Yapılıyor...' : 'Optimal Thread Sayısını Bul'}
                    </button>
                </div>
            </form>

            {optimizationResult && <OptimizationResult data={optimizationResult} />}
        </div>
    );
}

export default MatrixForm; 