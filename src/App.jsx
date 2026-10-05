import { useState, useEffect } from 'react'

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px 0' },
  subtitle: { fontSize: '14px', color: '#666', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  brandCard: { borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', backgroundColor: '#fff' },
  brandHeader: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' },
  brandDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  brandName: { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: 0 },
  newsCount: { fontSize: '13px', color: '#999', marginLeft: 'auto' },
  newsList: { listStyle: 'none', padding: 0, margin: 0, maxHeight: '400px', overflowY: 'auto' },
  newsItem: { padding: '12px 20px', borderTop: '1px solid #f0f0f0', transition: 'background 0.2s' },
  newsTitle: { fontSize: '14px', color: '#333', textDecoration: 'none', display: 'block', lineHeight: '1.5' },
  newsMeta: { fontSize: '12px', color: '#999', marginTop: '4px' },
  loading: { textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: '#666' },
  error: { textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: '#e74c3c' },
  empty: { textAlign: 'center', padding: '20px', fontSize: '14px', color: '#999' },
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${min}`
}

function BrandSection({ brand }) {
  return (
    <div style={styles.brandCard}>
      <div style={styles.brandHeader}>
        <div style={{ ...styles.brandDot, backgroundColor: brand.brandColor }}></div>
        <h2 style={styles.brandName}>{brand.brandName}</h2>
        <span style={styles.newsCount}>{brand.news?.length || 0} 条资讯</span>
      </div>
      {brand.news && brand.news.length > 0 ? (
        <ul style={styles.newsList}>
          {brand.news.map((item) => (
            <li key={item.id} style={styles.newsItem}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.newsTitle}>
                {item.title}
              </a>
              <div style={styles.newsMeta}>
                {item.source} · {formatTime(item.publishedAt)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={styles.empty}>暂无资讯</div>
      )}
    </div>
  )
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/news-data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={styles.loading}>加载中...</div>
  if (error) return <div style={styles.error}>数据加载失败</div>
  if (!data || !data.brands) return null

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>品牌资讯 Brand Pulse</h1>
        {data.lastUpdated && (
          <p style={styles.subtitle}>更新于 {data.lastUpdated}</p>
        )}
      </div>
      <div style={styles.grid}>
        {data.brands.map((brand) => (
          <BrandSection key={brand.brandKey} brand={brand} />
        ))}
      </div>
    </div>
  )
}

export default App
