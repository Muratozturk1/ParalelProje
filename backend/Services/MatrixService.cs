using backend.Models;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Threading;

namespace backend.Services
{
    public class MatrixService
    {
        private readonly Random _random = new();
        private const double CPU_POWER_CONSUMPTION = 0.1; // Her çekirdek için saniyede 0.1 Watt
        private const double MEMORY_POWER_CONSUMPTION = 0.05; // Bellek için saniyede 0.05 Watt

        public async Task<MatrixResult> MultiplyMatrices(MatrixRequest request)
        {
            try
            {
                var result = new MatrixResult
                {
                    Size = request.Size,
                    ThreadCount = request.ThreadCount,
                    Algorithm = request.Algorithm
                };

                // Matrisleri oluştur
                var matrixA = GenerateRandomMatrix(request.Size);
                var matrixB = GenerateRandomMatrix(request.Size);
                var resultMatrix = new double[request.Size, request.Size];

                // Zaman ölçümü başlat
                var stopwatch = Stopwatch.StartNew();

                // Algoritma seçimi ve çarpım işlemi
                switch (request.Algorithm.ToLower())
                {
                    case "sequential":
                        SequentialMultiply(matrixA, matrixB, resultMatrix);
                        break;
                    case "basic_parallel":
                        BasicParallelMultiply(matrixA, matrixB, resultMatrix, request.ThreadCount);
                        break;
                    case "improved_parallel":
                        ImprovedParallelMultiply(matrixA, matrixB, resultMatrix, request.ThreadCount);
                        break;
                    case "block_based":
                        BlockBasedMultiply(matrixA, matrixB, resultMatrix, request.ThreadCount);
                        break;
                    case "async_parallel":
                        await AsyncParallelMultiply(matrixA, matrixB, request.ThreadCount);
                        break;
                    default:
                        throw new ArgumentException("Invalid algorithm selection");
                }

                // Zaman ölçümünü durdur ve sonucu kaydet
                stopwatch.Stop();
                result.ExecutionTime = stopwatch.Elapsed.TotalSeconds;
                result.ResultMatrix = resultMatrix;

                // Enerji kullanımını hesapla
                result.EnergyConsumption = CalculateEnergyConsumption(
                    result.ExecutionTime,
                    request.ThreadCount,
                    request.Size
                );

                return result;
            }
            catch (Exception ex)
            {
                return new MatrixResult
                {
                    Error = ex.Message,
                    Size = request.Size,
                    ThreadCount = request.ThreadCount,
                    Algorithm = request.Algorithm
                };
            }
        }

        private double CalculateEnergyConsumption(double executionTime, int threadCount, int matrixSize)
        {
            // CPU enerji tüketimi (thread başına)
            double cpuEnergy = threadCount * CPU_POWER_CONSUMPTION * executionTime;

            // Bellek kullanımı (GB cinsinden)
            double memoryUsageGB = (matrixSize * matrixSize * sizeof(double) * 3) / (1024.0 * 1024.0 * 1024.0);

            // Bellek enerji tüketimi
            double memoryEnergy = memoryUsageGB * MEMORY_POWER_CONSUMPTION * executionTime;

            // Toplam enerji tüketimi (Joule)
            return cpuEnergy + memoryEnergy;
        }

        private double[,] GenerateRandomMatrix(int size)
        {
            var matrix = new double[size, size];
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    matrix[i, j] = _random.NextDouble() * 100;
                }
            }
            return matrix;
        }

        private void SequentialMultiply(double[,] a, double[,] b, double[,] result)
        {
            int size = a.GetLength(0);
            for (int i = 0; i < size; i++)
            {
                for (int j = 0; j < size; j++)
                {
                    double sum = 0;
                    for (int k = 0; k < size; k++)
                    {
                        sum += a[i, k] * b[k, j];
                    }
                    result[i, j] = sum;
                }
            }
        }

        private void BasicParallelMultiply(double[,] a, double[,] b, double[,] result, int threadCount)
        {
            int size = a.GetLength(0);
            Parallel.For(0, size, new ParallelOptions { MaxDegreeOfParallelism = threadCount }, i =>
            {
                for (int j = 0; j < size; j++)
                {
                    double sum = 0;
                    for (int k = 0; k < size; k++)
                    {
                        sum += a[i, k] * b[k, j];
                    }
                    result[i, j] = sum;
                }
            });
        }

        private void ImprovedParallelMultiply(double[,] a, double[,] b, double[,] result, int threadCount)
        {
            int size = a.GetLength(0);

            // B matrisini transpoz et - cache dostu erişim için
            double[,] bTransposed = new double[size, size];
            Parallel.For(0, size, i =>
            {
                for (int j = 0; j < size; j++)
                {
                    bTransposed[i, j] = b[j, i];
                }
            });

            // Paralel çarpım işlemi
            Parallel.For(0, size, new ParallelOptions { MaxDegreeOfParallelism = threadCount }, i =>
            {
                for (int j = 0; j < size; j++)
                {
                    double sum = 0;
                    // Cache dostu erişim: her iki matris de sıralı erişiliyor
                    for (int k = 0; k < size; k++)
                    {
                        sum += a[i, k] * bTransposed[j, k];
                    }
                    result[i, j] = sum;
                }
            });
        }

        private void BlockBasedMultiply(double[,] a, double[,] b, double[,] result, int threadCount)
        {
            int size = a.GetLength(0);
            int blockSize = 32; // Blok boyutunu artırdık
            int numBlocks = (size + blockSize - 1) / blockSize;

            // Sonuç matrisini sıfırla
            Array.Clear(result, 0, result.Length);

            // Thread başına düşen blok sayısını hesapla
            int blocksPerThread = (numBlocks + threadCount - 1) / threadCount;

            Parallel.For(0, threadCount, new ParallelOptions { MaxDegreeOfParallelism = threadCount }, threadId =>
            {
                int startBlock = threadId * blocksPerThread;
                int endBlock = Math.Min(startBlock + blocksPerThread, numBlocks);

                for (int blockI = startBlock; blockI < endBlock; blockI++)
                {
                    int startI = blockI * blockSize;
                    int endI = Math.Min(startI + blockSize, size);

                    for (int blockK = 0; blockK < numBlocks; blockK++)
                    {
                        int startK = blockK * blockSize;
                        int endK = Math.Min(startK + blockSize, size);

                        // B matrisinin bloğunu önbelleğe al
                        double[] bBlock = new double[(endK - startK) * size];
                        for (int k = startK; k < endK; k++)
                        {
                            for (int j = 0; j < size; j++)
                            {
                                bBlock[(k - startK) * size + j] = b[k, j];
                            }
                        }

                        for (int blockJ = 0; blockJ < numBlocks; blockJ++)
                        {
                            int startJ = blockJ * blockSize;
                            int endJ = Math.Min(startJ + blockSize, size);

                            // A matrisinin bloğunu önbelleğe al
                            double[] aBlock = new double[(endI - startI) * (endK - startK)];
                            for (int i = startI; i < endI; i++)
                            {
                                for (int k = startK; k < endK; k++)
                                {
                                    aBlock[(i - startI) * (endK - startK) + (k - startK)] = a[i, k];
                                }
                            }

                            // Blok çarpımı
                            for (int i = startI; i < endI; i++)
                            {
                                for (int j = startJ; j < endJ; j++)
                                {
                                    double sum = 0;
                                    for (int k = 0; k < endK - startK; k++)
                                    {
                                        sum += aBlock[(i - startI) * (endK - startK) + k] * bBlock[k * size + j];
                                    }
                                    result[i, j] += sum;
                                }
                            }
                        }
                    }
                }
            });
        }

        public async Task<double[,]> AsyncParallelMultiply(double[,] a, double[,] b, int threadCount)
        {
            int size = a.GetLength(0);
            var result = new double[size, size];

            // Thread havuzu ayarlarını optimize et
            ThreadPool.SetMinThreads(Environment.ProcessorCount, Environment.ProcessorCount);
            ThreadPool.SetMaxThreads(Environment.ProcessorCount * 2, Environment.ProcessorCount * 2);

            // İş yükünü daha iyi dağıtmak için chunk size hesapla
            int chunkSize = Math.Max(1, size / (Environment.ProcessorCount * 2));
            var tasks = new List<Task>();

            // Her chunk için bir task oluştur
            for (int i = 0; i < size; i += chunkSize)
            {
                int startRow = i;
                int endRow = Math.Min(i + chunkSize, size);

                tasks.Add(Task.Run(() =>
                {
                    for (int row = startRow; row < endRow; row++)
                    {
                        for (int col = 0; col < size; col++)
                        {
                            double sum = 0;
                            // Bellek erişimini optimize et
                            for (int k = 0; k < size; k++)
                            {
                                sum += a[row, k] * b[k, col];
                            }
                            result[row, col] = sum;
                        }
                    }
                }));
            }

            await Task.WhenAll(tasks);
            return result;
        }

        public async Task<OptimizationResult> FindOptimalThreadCount(int matrixSize, int maxThreadCount = 32)
        {
            var optimalResult = new OptimizationResult
            {
                MatrixSize = matrixSize,
                OptimalThreadCount = 1,
                MinExecutionTime = double.MaxValue,
                MinEnergyConsumption = double.MaxValue,
                TimeEnergyRatio = double.MaxValue
            };

            // İlk olarak sıralı (sequential) algoritma ile baseline ölçüm yapalım
            var baselineRequest = new MatrixRequest
            {
                Size = matrixSize,
                ThreadCount = 1,
                Algorithm = "sequential"
            };

            var baselineResult = await MultiplyMatrices(baselineRequest);
            double baselineTime = baselineResult.ExecutionTime;
            double baselineEnergy = baselineResult.EnergyConsumption;

            // Thread sayısını 1'den maxThreadCount'a kadar test et
            for (int threadCount = 1; threadCount <= maxThreadCount; threadCount++)
            {
                var request = new MatrixRequest
                {
                    Size = matrixSize,
                    ThreadCount = threadCount,
                    Algorithm = "block_based"
                };

                var result = await MultiplyMatrices(request);

                double normalizedTime = result.ExecutionTime / baselineTime;
                double normalizedEnergy = result.EnergyConsumption / baselineEnergy;

                double timeWeight = 0.99;
                double energyWeight = 0.01;

                double score = (timeWeight * normalizedTime) + (energyWeight * normalizedEnergy);

                if (score < optimalResult.TimeEnergyRatio)
                {
                    optimalResult.OptimalThreadCount = threadCount;
                    optimalResult.MinExecutionTime = result.ExecutionTime;
                    optimalResult.MinEnergyConsumption = result.EnergyConsumption;
                    optimalResult.TimeEnergyRatio = score;
                }
            }

            return optimalResult;
        }
    }
}