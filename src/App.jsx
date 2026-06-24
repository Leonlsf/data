import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading news data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!data) {
    return <div className="error">加载失败</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Brand Pulse - 品牌资讯</h1>
        <p className="last-updated">最后更新: {data.lastUpdated}</p>
      </header>
      <main className="main">
        {data.brands.map((brand) => (
          <section key={brand.brandKey} className="brand-section">
            <h2 className="brand-name" style={{ borderLeftColor: brand.brandColor }}>
              {brand.brandName}
            </h2>
            <ul className="news-list">
              {brand.news.map((news) => (
                <li key={news.id} className="news-item">
                  <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-link">
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-meta">
                      <span className="news-source">{news.source}</span>
                      <span className="news-date">{news.publishedAt}</span>
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
