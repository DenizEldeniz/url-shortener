import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const year = new Date().getFullYear();
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [clickCount, setClickCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCopied(false);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5072/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Url: originalUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Bir hata oluştu.' }));
        throw new Error(errorData.message || 'Bir hata oluştu veya URL geçersiz.');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      const code = data.shortCode || (data.shortUrl ? String(data.shortUrl).split('/').pop() : '');
      setShortCode(code || '');
      if (typeof data.clickCount === 'number') setClickCount(data.clickCount);
    } catch (err) {
      setError(err.message);
      setShortUrl('');
      setShortCode('');
      setClickCount(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shortCode) return;

    let cancelled = false;

    const refreshSilent = async () => {
      try {
        const res = await fetch(`http://localhost:5072/api/stats/${encodeURIComponent(shortCode)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.clickCount === 'number') setClickCount(data.clickCount);
      } catch {

      }
    };


    refreshSilent();


    const intervalId = window.setInterval(refreshSilent, 5000);


    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshSilent();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [shortCode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <div className="app-content">

        <div className="header">
          <div className="header-icon">
            <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="title">URL Kısaltıcı</h1>
          <p className="subtitle">Linklerinizi kısaltın, paylaşın ve kolayca yönetin</p>
        </div>

        <div className="main-card">

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">
                Uzun URL'nizi Girin
              </label>
              <div className="input-container">
                <div className="input-icon-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/uzun-bir-link-adresi"
                  className="input-field"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !originalUrl.trim()}
                  className={`submit-button ${loading || !originalUrl.trim() ? 'disabled' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span>Kısalt...</span>
                    </>
                  ) : (
                    <>
                      <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span>Kısalt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <div className="error-content">
                <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="error-text">{error}</p>
              </div>
            </div>
          )}

          {shortUrl && (
            <div className="result-area">
              <div className="result-header">
                <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="result-title">Kısa Linkiniz Hazır!</p>
              </div>
              <div className="result-container">
                <input
                  readOnly
                  value={shortUrl}
                  className="result-input"
                />
                <button
                  onClick={copyToClipboard}
                  className={`copy-button ${copied ? 'copied' : ''}`}
                >
                  {copied ? (
                    <>
                      <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>

              <div className="stats-row" aria-label="Link istatistikleri">
                <span className="stats-text">
                  Tıklanma: <strong>{clickCount ?? '-'}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="footer">
          <p className="footer-text">Hızlı, güvenli ve ücretsiz URL kısaltma servisi</p>
          <p className="footer-meta">© {year} UrlKısaltma. Tüm hakları saklıdır.</p>
        </div>
      </div>

      <div className="by-signature" aria-label="Site imzası">
        <span className="by-text">by Deniz Eldeniz</span>
        <span className="by-sep" aria-hidden="true">•</span>
        <nav className="by-links" aria-label="Sosyal bağlantılar">
          <a className="by-link" href="https://www.linkedin.com/in/denizeldeniz/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg className="by-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM0.5 8H4.5V23H0.5V8ZM8 8H12v2.1h.1c.56-1.06 1.93-2.18 3.98-2.18C20.2 7.92 22 10.2 22 14.32V23h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V23H8V8Z" />
            </svg>
          </a>
          <a className="by-link" href="https://github.com/DenizEldeniz" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg className="by-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.73.5.75 5.7.75 12.12c0 5.15 3.34 9.52 7.97 11.06.58.11.79-.26.79-.57v-2.1c-3.24.73-3.92-1.6-3.92-1.6-.53-1.39-1.3-1.76-1.3-1.76-1.06-.75.08-.74.08-.74 1.17.08 1.79 1.25 1.79 1.25 1.04 1.83 2.73 1.3 3.4.99.11-.78.4-1.3.73-1.6-2.59-.3-5.32-1.34-5.32-5.96 0-1.32.45-2.4 1.2-3.25-.12-.3-.52-1.52.11-3.17 0 0 .98-.32 3.2 1.24a10.7 10.7 0 0 1 2.92-.4c.99 0 1.99.14 2.92.4 2.22-1.56 3.2-1.24 3.2-1.24.63 1.65.23 2.87.11 3.17.75.85 1.2 1.93 1.2 3.25 0 4.63-2.74 5.66-5.35 5.96.41.37.78 1.1.78 2.23v3.3c0 .31.21.69.79.57 4.63-1.54 7.97-5.91 7.97-11.06C23.25 5.7 18.27.5 12 .5Z" />
            </svg>
          </a>
          <a className="by-link" href="https://www.instagram.com/deldenizx/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg className="by-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm10.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            </svg>
          </a>
          <a className="by-link" href="mailto:denizeldeniz07@gmail.com" aria-label="E-posta">
            <svg className="by-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z" />
            </svg>
          </a>
          <a className="by-link by-sushi" href="https://www.youtube.com/watch?v=6POZlJAZsok" target="_blank" rel="noreferrer" title="Sushi" aria-label="Sushi">
            <svg className="by-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 10c0-2.2 3.6-4 8-4s8 1.8 8 4-3.6 4-8 4-8-1.8-8-4Zm8 2.5c4.6 0 6.5-1.7 6.5-2.5S16.6 7.5 12 7.5 5.5 9.2 5.5 10s1.9 2.5 6.5 2.5Z" />
              <path d="M5 13.2c1.8 1.2 4.3 1.8 7 1.8s5.2-.6 7-1.8V16c0 2.2-3.6 4-8 4s-8-1.8-8-4v-2.8Zm7 5.3c4.6 0 6.5-1.7 6.5-2.5v-1c-1.9 1-4.3 1.5-6.5 1.5S7.4 16 5.5 15v1c0 .8 1.9 2.5 6.5 2.5Z" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}

export default App;
