using Microsoft.AspNetCore.Mvc;
using UrlShortenerApi.Dtos;
using UrlShortenerApi.Services;

namespace UrlShortenerApi.Controllers
{
    [ApiController]
    [Route("api")]
    public class UrlController : ControllerBase
    {
        private readonly UrlService _urlService;

        public UrlController(UrlService urlService)
        {
            _urlService = urlService;
        }

        [HttpPost("shorten")]
        public async Task<IActionResult> ShortenUrl([FromBody] ShortenUrlRequest request)
        {
            if (!Uri.IsWellFormedUriString(request.Url, UriKind.Absolute))
            {
                return BadRequest("Geçersiz URL formatı.");
            }

            var result = await _urlService.CreateShortUrlAsync(request.Url);
            var host = $"{Request.Scheme}://{Request.Host}/api";
            
            return Ok(new { 
                originalUrl = result.OriginalUrl,
                shortUrl = $"{host}/{result.ShortCode}",
                shortCode = result.ShortCode,
                clickCount = result.ClickCount
            });
        }

        [HttpGet("stats/{code}")]
        public async Task<IActionResult> GetStats(string code)
        {
            var mapping = await _urlService.GetStatsByCodeAsync(code);
            if (mapping == null)
            {
                return NotFound("URL bulunamadı.");
            }

            var host = $"{Request.Scheme}://{Request.Host}/api";

            return Ok(new
            {
                originalUrl = mapping.OriginalUrl,
                shortUrl = $"{host}/{mapping.ShortCode}",
                shortCode = mapping.ShortCode,
                clickCount = mapping.ClickCount
            });
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> RedirectToUrl(string code)
        {
            var mapping = await _urlService.GetByCodeAsync(code);
            if (mapping == null)
            {
                return NotFound("URL bulunamadı.");
            }

            return Redirect(mapping.OriginalUrl);
        }
    }
}