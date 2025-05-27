namespace backend.Models
{
    public class OptimizationResult
    {
        public int MatrixSize { get; set; }
        public int OptimalThreadCount { get; set; }
        public double MinExecutionTime { get; set; }
        public double MinEnergyConsumption { get; set; }
        public double TimeEnergyRatio { get; set; }
    }
}