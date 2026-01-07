using MongoDB.Driver;
using UrlShortenerApi.Models;

namespace UrlShortenerApi.Services
{
    public partial class UrlService
    {
        private readonly IMongoCollection<UrlMapping> _urls;
        private const string Chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        // UrlService singleton olduğu için thread-safety adına Random.Shared kullanıyoruz.
        private static readonly Random _random = Random.Shared;
        private const int MaxInsertAttempts = 10;

        public UrlService(IConfiguration config)
        {
            var mongoClient = new MongoClient(config.GetConnectionString("MongoDb"));
            var database = mongoClient.GetDatabase("UrlShortenerDb");
            _urls = database.GetCollection<UrlMapping>("Urls");

            // ShortCode üzerine unique index atayalım
            var indexKeys = Builders<UrlMapping>.IndexKeys.Ascending(x => x.ShortCode);
            var indexOptions = new CreateIndexOptions { Unique = true };
            var model = new CreateIndexModel<UrlMapping>(indexKeys, indexOptions);
            _urls.Indexes.CreateOne(model);
        }

        public async Task<UrlMapping> CreateShortUrlAsync(string originalUrl)
        {
            // Duplicate key (ShortCode unique index) durumunda tekrar deneyelim.
            for (var attempt = 1; attempt <= MaxInsertAttempts; attempt++)
            {
                var code = GenerateCode();

                var mapping = new UrlMapping
                {
                    OriginalUrl = originalUrl,
                    ShortCode = code
                };

                try
                {
                    await _urls.InsertOneAsync(mapping);
                    return mapping;
                }
                catch (MongoWriteException ex) when (IsDuplicateKey(ex))
                {
                    // Çakışma oldu → yeni kod üretip tekrar dene.
                }
            }

            throw new Exception("Kısa kod üretilemedi. Lütfen tekrar deneyin.");
        }

        private string GenerateCode(int length = 6)
        {
            return new string(Enumerable.Repeat(Chars, length)
                .Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        private static bool IsDuplicateKey(MongoWriteException ex)
        {
            // MongoDB duplicate key için yaygın kod: 11000
            return ex.WriteError?.Category == ServerErrorCategory.DuplicateKey
                   || ex.WriteError?.Code == 11000;
        }
    }
}