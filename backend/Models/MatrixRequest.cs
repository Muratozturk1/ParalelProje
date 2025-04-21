namespace backend.Models
{
    public class MatrixRequest
    {
        public int Size { get; set; }
        public int ThreadCount { get; set; }
        public string Algorithm { get; set; } = string.Empty;
    }
} 