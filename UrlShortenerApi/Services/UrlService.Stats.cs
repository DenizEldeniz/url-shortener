using MongoDB.Driver;
using UrlShortenerApi.Models;

namespace UrlShortenerApi.Services
{
    public partial class UrlService
    {
        public async Task<UrlMapping?> GetByCodeAsync(string code)
        {
            var filter = Builders<UrlMapping>.Filter.Eq(x => x.ShortCode, code);
            var update = Builders<UrlMapping>.Update.Inc(x => x.ClickCount, 1);

            return await _urls.FindOneAndUpdateAsync(filter, update);
        }

        public async Task<UrlMapping?> GetStatsByCodeAsync(string code)
        {
            var filter = Builders<UrlMapping>.Filter.Eq(x => x.ShortCode, code);
            return await _urls.Find(filter).FirstOrDefaultAsync();
        }
    }
}


