import { useState, useEffect } from 'react'

const BRANDS = [
  { brandName: '泡泡玛特', brandKey: 'popmart', brandColor: '#FFD700' },
  { brandName: '康师傅', brandKey: 'masterkong', brandColor: '#E4002B' },
  { brandName: '伊利', brandKey: 'yili', brandColor: '#00A650' },
  { brandName: '三只松鼠', brandKey: 'threesquirrels', brandColor: '#FF6B00' },
]

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState('popmart')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #334155', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#94a3b8' }}>加载中...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#f87171' }}>加载失败: {error}</p>
      </div>
    )
  }

  const brands = data?.brands || []
  const activeBrandData = brands.find(b => b.brandKey === activeBrand)
  const newsList = activeBrandData?.news || []

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
          <span style={{ color: '#60a5fa' }}>Brand</span> Pulse
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          品牌资讯每日速递
          {data?.lastUpdated && (
            <span style={{ marginLeft: 8, color: '#475569' }}>
              · 更新于 {data.lastUpdated.replace('T', ' ').slice(0, 19)}
            </span>
          )}
        </p>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {brands.map(brand => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(brand.brandKey)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeBrand === brand.brandKey ? 600 : 400,
              color: activeBrand === brand.brandKey ? '#0f172a' : '#e2e8f0',
              background: activeBrand === brand.brandKey ? brand.brandColor : '#1e293b',
              transition: 'all 0.2s',
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </nav>

      <div style={{ marginBottom: 16, color: '#94a3b8', fontSize: 13, textAlign: 'right' }}>
        共 {newsList.length} 条资讯
      </div>

      <main>
        {newsList.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>暂无资讯</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {newsList.map(item => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    background: '#1e293b',
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
                >
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, lineHeight: 1.5 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    <span style={{ color: activeBrandData?.brandColor || '#60a5fa', marginRight: 8 }}>{item.source}</span>
                    {item.publishedAt?.replace('T', ' ').slice(0, 16)}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: 48, paddingBottom: 24, color: '#475569', fontSize: 12 }}>
        Brand Pulse © {new Date().getFullYear()} · 数据来源: 新浪财经
      </footer>
    </div>
  )
}

export default App
