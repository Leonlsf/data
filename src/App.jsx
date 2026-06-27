import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(json.brands[0].brandKey)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <p>加载中...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <p>暂无数据</p>
      </div>
    )
  }

  const currentBrand = data.brands.find(b => b.brandKey === activeBrand)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Brand Pulse</h1>
        <p style={{ color: '#666', marginTop: 4, fontSize: 14 }}>品牌资讯每日速递 · {data.date}</p>
      </header>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.brands.map(brand => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(brand.brandKey)}
            style={{
              padding: '8px 20px',
              border: activeBrand === brand.brandKey ? 'none' : '1px solid #ddd',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              backgroundColor: activeBrand === brand.brandKey ? brand.brandColor : '#fff',
              color: activeBrand === brand.brandKey ? '#fff' : '#333',
              transition: 'all 0.2s',
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </div>

      {currentBrand && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: currentBrand.brandColor }}>
            {currentBrand.brandName} · 最新资讯
          </h2>
          {currentBrand.news && currentBrand.news.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {currentBrand.news.map((item, idx) => (
                <li key={item.id || idx} style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontSize: 15,
                    lineHeight: 1.5,
                    display: 'block',
                  }}>
                    {item.title}
                  </a>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    {item.source} · {item.publishedAt}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>暂无资讯</p>
          )}
        </div>
      )}

      <footer style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: '#bbb' }}>
        最后更新：{data.lastUpdated}
      </footer>
    </div>
  )
}

export default App
