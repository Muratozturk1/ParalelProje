using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatrixController : ControllerBase
    {
        private readonly MatrixService _matrixService;

        public MatrixController(MatrixService matrixService)
        {
            _matrixService = matrixService;
        }

        [HttpPost("multiply")]
        public IActionResult Multiply([FromBody] MatrixRequest request)
        {
            try
            {
                if (request.Size <= 0)
                {
                    return BadRequest("Matris boyutu 0'dan büyük olmalıdır.");
                }

                if (request.ThreadCount <= 0)
                {
                    return BadRequest("Thread sayısı 0'dan büyük olmalıdır.");
                }

                var result = _matrixService.MultiplyMatrices(request);

                if (!string.IsNullOrEmpty(result.Error))
                {
                    return BadRequest(result.Error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Sunucu hatası: {ex.Message}");
            }
        }

        [HttpGet("algorithms")]
        public IActionResult GetAlgorithms()
        {
            return Ok(new[]
            {
                new { id = "sequential", name = "Sequential Algorithm" },
                new { id = "basic_parallel", name = "Basic Parallel Algorithm" },
                new { id = "improved_parallel", name = "Improved Parallel Algorithm" },
                new { id = "block_based", name = "Block-Based Parallel Algorithm" }
            });
        }
    }
} 