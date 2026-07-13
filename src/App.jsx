import { useState, useEffect } from 'react'

const BRAND_COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(json => {
        setData(json)
        if (json.brands && json.brands.length > 0) {
          setActiveBrand(json.brands[0].brandKey)
        }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #334155', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#94a3b8' }}>加载中...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', padding: 32, background: '#1e293b', borderRadius: 12 }}>
          <p style={{ color: '#f87171', fontSize: 18, marginBottom: 8 }}>加载失败</p>
          <p style={{ color: '#94a3b8' }}>{error}</p>
        </div>
      </div>
    )
  }

  const activeBrandData = data?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #1e293b', padding: '24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>
            <span style={{ color: '#3b82f6' }}>Brand</span> Pulse
          </h1>
          <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
            品牌资讯每日速递 · {data?.date || ''}
          </p>
        </div>
      </header>

      {/* Brand Tabs */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
          {data?.brands?.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              style={{
                padding: '14px 24px',
                border: 'none',
                background: activeBrand === brand.brandKey ? '#0f172a' : 'transparent',
                color: activeBrand === brand.brandKey ? BRAND_COLORS[brand.brandKey] : '#94a3b8',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: activeBrand === brand.brandKey ? 600 : 400,
                borderBottom: activeBrand === brand.brandKey ? `2px solid ${BRAND_COLORS[brand.brandKey]}` : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {brand.brandName}
              <span style={{
                marginLeft: 8,
                fontSize: 12,
                background: activeBrand === brand.brandKey ? `${BRAND_COLORS[brand.brandKey]}22` : '#334155',
                color: activeBrand === brand.brandKey ? BRAND_COLORS[brand.brandKey] : '#64748b',
                padding: '2px 8px',
                borderRadius: 10,
              }}>
                {brand.news?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {activeBrandData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: BRAND_COLORS[activeBrandData.brandKey],
                boxShadow: `0 0 12px ${BRAND_COLORS[activeBrandData.brandKey]}66`,
              }} />
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#f8fafc' }}>
                {activeBrandData.brandName} · 近期资讯
              </h2>
            </div>

            {activeBrandData.news?.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
                暂无资讯数据
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeBrandData.news?.map((item, idx) => (
                <a
                  key={item.id || idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '16px 20px',
                    background: '#1e293b',
                    borderRadius: 10,
                    border: '1px solid #334155',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = BRAND_COLORS[activeBrandData.brandKey] + '66'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#334155'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.6, marginBottom: 8 }}>
                        {item.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                        <span>{item.source}</span>
                        <span>{item.publishedAt?.replace('T', ' ').replace('+08:00', '')}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 18,
                      color: '#475569',
                      flexShrink: 0,
                    }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', color: '#475569', fontSize: 13, borderTop: '1px solid #1e293b', marginTop: 48 }}>
        <p>Brand Pulse · 数据更新于 {data?.lastUpdated?.replace('T', ' ').replace('+08:00', '') || '未知'}</p>
      </footer>
    </div>
  )
}

export default App
