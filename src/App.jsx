import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={styles.loading}>加载中...</div>
  if (error) return <div style={styles.error}>加载失败: {error}</div>
  if (!data) return null

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>品牌资讯 Brand Pulse</h1>
        <span style={styles.updated}>更新于 {data.lastUpdated}</span>
      </header>
      <div style={styles.grid}>
        {data.brands.map(brand => (
          <div key={brand.brandKey} style={{ ...styles.brandCard, borderLeft: `4px solid ${brand.brandColor}` }}>
            <h2 style={{ ...styles.brandName, color: brand.brandColor }}>{brand.brandName}</h2>
            <div style={styles.newsList}>
              {brand.news.length === 0 ? (
                <div style={styles.empty}>暂无资讯</div>
              ) : (
                brand.news.map(item => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={styles.newsItem}>
                    <div style={styles.newsTitle}>{item.title}</div>
                    <div style={styles.newsMeta}>
                      <span>{item.source}</span>
                      <span>{item.publishedAt}</span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: 1200, margin: '0 auto', padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 },
  title: { fontSize: 24, fontWeight: 700, margin: 0, color: '#1a1a1a' },
  updated: { fontSize: 13, color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 20 },
  brandCard: { background: '#fff', borderRadius: 8, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' },
  brandName: { fontSize: 18, fontWeight: 600, margin: '0 0 12px 0' },
  newsList: { maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { color: '#999', fontSize: 14, padding: 20, textAlign: 'center' },
  newsItem: { display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', background: '#f8f9fa', transition: 'background 0.2s' },
  newsTitle: { fontSize: 14, lineHeight: 1.5, marginBottom: 4 },
  newsMeta: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: 18, color: '#666' },
  error: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: 16, color: '#e00' },
}

export default App
