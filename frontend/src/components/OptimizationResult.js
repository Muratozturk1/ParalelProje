import React from 'react';

function OptimizationResult({ data }) {
    if (!data) return null;

    return (
        <div className="card mt-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Optimizasyon Sonuçları</h5>
            </div>
            <div className="card-body">
                <div className="alert alert-info">
                    <h6 className="alert-heading">En İyi Performans/Enerji Dengesi</h6>
                    <p className="mb-0">
                        {data.matrixSize} x {data.matrixSize} boyutundaki matris için optimal thread sayısı: <strong>{data.optimalThreadCount}</strong>
                    </p>
                </div>
                
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title">Çalışma Süresi</h6>
                                <p className="card-text">{data.minExecutionTime.toFixed(6)} saniye</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="card-title">Enerji Tüketimi</h6>
                                <p className="card-text">{data.minEnergyConsumption.toFixed(2)} Joule</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <small className="text-muted">
                        Not: Bu sonuçlar, çalışma süresi ve enerji tüketimi arasında en iyi dengeyi sağlayan thread sayısını göstermektedir.
                        Daha yüksek thread sayıları daha hızlı çalışma süresi sağlayabilir, ancak enerji tüketimini artırabilir.
                    </small>
                </div>
            </div>
        </div>
    );
}

export default OptimizationResult; 