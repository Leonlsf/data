import { useState, useEffect } from 'react'

const COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00'
}

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui' }}>
        <p>加载中...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui' }}>
        <p>数据加载失败</p>
      </div>
    )
  }

  const activeBrandData = data.brands.find(b => b.brandKey === activeBrand)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>品牌资讯</h1>
        <p style={{ color: '#666', fontSize: 14 }}>更新时间：{data.lastUpdated}</p>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {data.brands.map(brand => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(brand.brandKey)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: activeBrand === brand.brandKey ? '#fff' : '#333',
              backgroundColor: activeBrand === brand.brandKey ? (COLORS[brand.brandKey] || '#333') : '#f0f0f0',
              transition: 'all 0.2s'
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </div>

      {activeBrandData && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: COLORS[activeBrandData.brandKey] || '#333' }}>
            {activeBrandData.brandName} 资讯
          </h2>
          {activeBrandData.news && activeBrandData.news.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {activeBrandData.news.map(item => (
                <li key={item.id} style={{ marginBottom: 12, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 15, fontWeight: 500, display: 'block', marginBottom: 4 }}
                  >
                    {item.title}
                  </a>
                  <span style={{ color: '#999', fontSize: 12 }}>{item.source} · {item.publishedAt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#999' }}>暂无资讯</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App
