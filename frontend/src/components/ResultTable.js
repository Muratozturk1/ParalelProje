import React, { useState } from 'react';

function ResultTable({ data }) {
    const [showDetails, setShowDetails] = useState(false);

    const formatTime = (value) => {
        if (value === 0 || value === undefined) return '0.000000';
        return value.toFixed(6);
    };

    const formatEnergy = (value) => {
        if (value === 0 || value === undefined) return '0.00';
        return value.toFixed(2);
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Algoritma</th>
                        <th>Çalışma Süresi (s)</th>
                        <th>Hızlanma (Speedup)</th>
                        <th>Verimlilik (%)</th>
                        <th>Enerji Tüketimi (Joule)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className="algorithm-badge sequential-badge">Sequential</span>
                        </td>
                        <td>{formatTime(data.sequential?.time)}</td>
                        <td>{data.sequential?.speedup?.toFixed(2) || '1.00'}x</td>
                        <td>{data.sequential?.efficiency?.toFixed(2) || '100.00'}</td>
                        <td>{formatEnergy(data.sequential?.energy)}</td>
                    </tr>
                    <tr>
                        <td>
                            <span className="algorithm-badge parallel-badge">Basic Parallel</span>
                        </td>
                        <td>{formatTime(data.parallel?.time)}</td>
                        <td>{data.parallel?.speedup?.toFixed(2) || '0.00'}x</td>
                        <td>{data.parallel?.efficiency?.toFixed(2) || '0.00'}</td>
                        <td>{formatEnergy(data.parallel?.energy)}</td>
                    </tr>
                    <tr>
                        <td>
                            <span className="algorithm-badge improved-badge">Improved Parallel</span>
                        </td>
                        <td>{formatTime(data.improved?.time)}</td>
                        <td>{data.improved?.speedup?.toFixed(2) || '0.00'}x</td>
                        <td>{data.improved?.efficiency?.toFixed(2) || '0.00'}</td>
                        <td>{formatEnergy(data.improved?.energy)}</td>
                    </tr>
                    <tr>
                        <td>
                            <span className="algorithm-badge blocked-badge">Block-Based Parallel</span>
                        </td>
                        <td>{formatTime(data.blocked?.time)}</td>
                        <td>{data.blocked?.speedup?.toFixed(2) || '0.00'}x</td>
                        <td>{data.blocked?.efficiency?.toFixed(2) || '0.00'}</td>
                        <td>{formatEnergy(data.blocked?.energy)}</td>
                    </tr>
                    <tr>
                        <td>
                            <span className="algorithm-badge async-badge">Async Parallel</span>
                        </td>
                        <td>{formatTime(data.async?.time)}</td>
                        <td>{data.async?.speedup?.toFixed(2) || '0.00'}x</td>
                        <td>{data.async?.efficiency?.toFixed(2) || '0.00'}</td>
                        <td>{formatEnergy(data.async?.energy)}</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-3">
                <h6>Performans Metrikleri:</h6>
                <ul className="small">
                    <li><strong>Çalışma Süresi:</strong> Algoritmanın tamamlanması için gereken süre (saniye)</li>
                    <li><strong>Hızlanma (Speedup):</strong> Sıralı algoritma süresinin paralel algoritma süresine oranı</li>
                    <li><strong>Verimlilik:</strong> Hızlanmanın kullanılan thread sayısına oranı (ideal değer: 100%)</li>
                    <li><strong>Enerji Tüketimi:</strong> Algoritmanın çalışması sırasında harcanan enerji (Joule)</li>
                </ul>

                <button
                    className="btn btn-sm btn-outline-secondary mt-2"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    {showDetails ? "Algoritma Detaylarını Gizle" : "Algoritma Detaylarını Göster"}
                </button>

                {showDetails && (
                    <div className="algorithm-details mt-3">
                        <h6>Algoritma Mantıkları:</h6>
                        <div className="accordion small" id="algorithmAccordion">
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sequential">
                                        <span className="algorithm-badge sequential-badge me-2">Sequential</span> Algoritması
                                    </button>
                                </h2>
                                <div id="sequential" className="accordion-collapse collapse">
                                    <div className="accordion-body">
                                        <p>Klasik matris çarpımı algoritması, üç iç içe geçmiş döngüden oluşur:</p>
                                        <pre className="bg-light p-2 rounded">
                                            <code>
                                                {'for (int i = 0; i < N; i++) {'}<br />
                                                {'  for (int j = 0; j < N; j++) {'}<br />
                                                {'    C[i][j] = 0.0;'}<br />
                                                {'    for (int k = 0; k < N; k++) {'}<br />
                                                {'      C[i][j] += A[i][k] * B[k][j];'}<br />
                                                {'    }'}<br />
                                                {'  }'}<br />
                                                {'}'}
                                            </code>
                                        </pre>
                                        <p>Bu algoritma tamamen sıralı çalışır ve paralelleştirme içermez. Referans performans olarak kullanılır.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#basicParallel">
                                        <span className="algorithm-badge parallel-badge me-2">Basic Parallel</span> Algoritması
                                    </button>
                                </h2>
                                <div id="basicParallel" className="accordion-collapse collapse">
                                    <div className="accordion-body">
                                        <p>Temel paralel algoritma, OpenMP'nin en basit şekilde uygulanmasıdır. Sadece en dıştaki döngü paralelleştirilir:</p>
                                        <pre className="bg-light p-2 rounded">
                                            <code>
                                                {'#pragma omp parallel for'}<br />
                                                {'for (int i = 0; i < N; i++) {'}<br />
                                                {'  for (int j = 0; j < N; j++) {'}<br />
                                                {'    C[i][j] = 0.0;'}<br />
                                                {'    for (int k = 0; k < N; k++) {'}<br />
                                                {'      C[i][j] += A[i][k] * B[k][j];'}<br />
                                                {'    }'}<br />
                                                {'  }'}<br />
                                                {'}'}
                                            </code>
                                        </pre>
                                        <p>Her thread, sonuç matrisinin farklı satırlarını hesaplar. İş yükü paralelleştirilir ancak iç döngüler hala sıralıdır.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#improvedParallel">
                                        <span className="algorithm-badge improved-badge me-2">Improved Parallel</span> Algoritması
                                    </button>
                                </h2>
                                <div id="improvedParallel" className="accordion-collapse collapse">
                                    <div className="accordion-body">
                                        <p>İyileştirilmiş paralel algoritma, OpenMP'nin collapse direktifini kullanarak hem i hem de j döngülerini paralelleştirir:</p>
                                        <pre className="bg-light p-2 rounded">
                                            <code>
                                                {'#pragma omp parallel for collapse(2)'}<br />
                                                {'for (int i = 0; i < N; i++) {'}<br />
                                                {'  for (int j = 0; j < N; j++) {'}<br />
                                                {'    C[i][j] = 0.0;'}<br />
                                                {'    for (int k = 0; k < N; k++) {'}<br />
                                                {'      C[i][j] += A[i][k] * B[k][j];'}<br />
                                                {'    }'}<br />
                                                {'  }'}<br />
                                                {'}'}
                                            </code>
                                        </pre>
                                        <p>Collapse direktifi, iki döngüyü düzleştirerek daha iyi iş dağıtımı sağlar ve thread'lerin daha verimli kullanılmasını sağlar. Bu, özellikle yüksek thread sayılarında daha iyi performans sunar.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#blockedParallel">
                                        <span className="algorithm-badge blocked-badge me-2">Block-Based Parallel</span> Algoritması
                                    </button>
                                </h2>
                                <div id="blockedParallel" className="accordion-collapse collapse">
                                    <div className="accordion-body">
                                        <p>Blok tabanlı paralel algoritma, önbellek dostu bir yaklaşım benimser. Matrisler bloklar halinde işlenir:</p>
                                        <pre className="bg-light p-2 rounded">
                                            <code>
                                                {'#pragma omp parallel for collapse(2)'}<br />
                                                {'for (int i = 0; i < N; i += BLOCK_SIZE) {'}<br />
                                                {'  for (int j = 0; j < N; j += BLOCK_SIZE) {'}<br />
                                                {'    for (int k = 0; k < N; k += BLOCK_SIZE) {'}<br />
                                                {'      // Bir blok işle'}<br />
                                                {'      for (int ii = i; ii < i + BLOCK_SIZE && ii < N; ii++) {'}<br />
                                                {'        for (int jj = j; jj < j + BLOCK_SIZE && jj < N; jj++) {'}<br />
                                                {'          if (k == 0) {'}<br />
                                                {'            C[ii][jj] = 0.0; // İlk blok için sıfırla'}<br />
                                                {'          }'}<br />
                                                {'          for (int kk = k; kk < k + BLOCK_SIZE && kk < N; kk++) {'}<br />
                                                {'            C[ii][jj] += A[ii][kk] * B[kk][jj];'}<br />
                                                {'          }'}<br />
                                                {'        }'}<br />
                                                {'      }'}<br />
                                                {'    }'}<br />
                                                {'  }'}<br />
                                                {'}'}
                                            </code>
                                        </pre>
                                        <p>Blok yaklaşımı, önbellek yerelliliğini (cache locality) artırarak veri erişim desenlerini iyileştirir. BLOCK_SIZE genellikle CPU önbellek hattına göre seçilir (örn. 32, 64 veya 128). Bu algoritma, büyük matrisler için özellikle etkilidir çünkü önbellekte daha iyi performans sağlar.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#asyncParallel">
                                        <span className="algorithm-badge async-badge me-2">Async Parallel</span> Algoritması
                                    </button>
                                </h2>
                                <div id="asyncParallel" className="accordion-collapse collapse">
                                    <div className="accordion-body">
                                        <p>Asenkron paralel algoritma, Task Parallel Library (TPL) kullanarak asenkron işlemleri yönetir:</p>
                                        <pre className="bg-light p-2 rounded">
                                            <code>
                                                {'var tasks = new List<Task>();'}<br />
                                                {'for (int t = 0; t < threadCount; t++) {'}<br />
                                                {'  int threadId = t;'}<br />
                                                {'  tasks.Add(Task.Run(() => {'}<br />
                                                {'    int rowsPerThread = size / threadCount;'}<br />
                                                {'    int startRow = threadId * rowsPerThread;'}<br />
                                                {'    int endRow = (threadId == threadCount - 1) ? size : startRow + rowsPerThread;'}<br />
                                                {'    for (int i = startRow; i < endRow; i++) {'}<br />
                                                {'      for (int j = 0; j < size; j++) {'}<br />
                                                {'        double sum = 0;'}<br />
                                                {'        for (int k = 0; k < size; k++) {'}<br />
                                                {'          sum += a[i, k] * b[k, j];'}<br />
                                                {'        }'}<br />
                                                {'        result[i, j] = sum;'}<br />
                                                {'      }'}<br />
                                                {'    }'}<br />
                                                {'  }));'}<br />
                                                {'}'}<br />
                                                {'await Task.WhenAll(tasks);'}
                                            </code>
                                        </pre>
                                        <p>Bu algoritma, her thread için ayrı bir Task oluşturur ve Task.WhenAll ile tüm işlemlerin tamamlanmasını bekler. Asenkron yapı sayesinde thread havuzu daha verimli kullanılır ve sistem kaynakları daha iyi yönetilir.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="alert alert-secondary mt-3 small">
                    <strong>Matris Boyutu:</strong> {data.matrixSize} x {data.matrixSize} <br />
                    <strong>Kullanılabilir Thread Sayısı:</strong> {data.availableThreads} <br />
                </div>
            </div>
        </div>
    );
}

export default ResultTable; 