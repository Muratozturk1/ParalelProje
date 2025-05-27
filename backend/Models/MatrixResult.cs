using System.Text.Json.Serialization;

namespace backend.Models
{
    public class MatrixResult
    {
        [JsonIgnore]
        public double[,]? ResultMatrix { get; set; }

        public double ExecutionTime { get; set; }
        public double EnergyConsumption { get; set; } // Joule cinsinden enerji tüketimi
        public string Algorithm { get; set; } = string.Empty;
        public int Size { get; set; }
        public int ThreadCount { get; set; }
        public string Error { get; set; } = string.Empty;

        // Sonuç matrisini JSON'a dönüştürülebilir formatta sunmak için
        public double[][]? MatrixData
        {
            get
            {
                if (ResultMatrix == null) return null;

                int size = ResultMatrix.GetLength(0);
                var result = new double[size][];
                for (int i = 0; i < size; i++)
                {
                    result[i] = new double[size];
                    for (int j = 0; j < size; j++)
                    {
                        result[i][j] = ResultMatrix[i, j];
                    }
                }
                return result;
            }
        }
    }
}