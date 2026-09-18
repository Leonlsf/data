import { useState, useEffect } from 'react'

const BRAND_COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load news data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <p>加载中...</p>
      </div>
    )
  }

  if (!data || !data.brands || data.brands.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <p>暂无数据</p>
      </div>
    )
  }

  const currentBrand = data.brands[activeBrand]

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>品牌资讯</h1>
        <p style={{ color: '#888', fontSize: 14 }}>更新时间: {data.lastUpdated}</p>
      </header>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {data.brands.map((brand, idx) => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(idx)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              background: idx === activeBrand ? brand.brandColor : '#f0f0f0',
              color: idx === activeBrand ? '#fff' : '#333',
              transition: 'all 0.2s',
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </div>

      <div>
        <h2 style={{ fontSize: 20, marginBottom: 16, color: currentBrand.brandColor }}>
          {currentBrand.brandName}
        </h2>
        {currentBrand.news && currentBrand.news.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {currentBrand.news.map(item => (
              <li key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#333', fontSize: 15 }}
                >
                  {item.title}
                </a>
                <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                  {item.source} · {item.publishedAt}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>暂无资讯</p>
        )}
      </div>
    </div>
  )
}

export default App
