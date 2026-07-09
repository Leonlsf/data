import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
        return res.json()
      })
      .then(data => {
        setNewsData(data)
        if (data.brands && data.brands.length > 0) {
          setActiveBrand(data.brands[0].brandKey)
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#94a3b8', fontSize: '18px' }}>
        加载中...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#f87171', fontSize: '18px' }}>
        {error}
      </div>
    )
  }

  const activeBrandData = newsData?.brands?.find(b => b.brandKey === activeBrand)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '20px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#f1f5f9' }}>
              品牌脉搏
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#94a3b8' }}>
              品牌资讯每日速递 · {newsData?.date || ''}
            </p>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            最近更新: {newsData?.lastUpdated?.replace('T', ' ').replace('+08:00', '') || ''}
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px' }}>
          {newsData?.brands?.map(brand => (
            <button
              key={brand.brandKey}
              onClick={() => setActiveBrand(brand.brandKey)}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderBottom: activeBrand === brand.brandKey ? `3px solid ${brand.brandColor}` : '3px solid transparent',
                background: 'transparent',
                color: activeBrand === brand.brandKey ? '#f1f5f9' : '#94a3b8',
                fontSize: '15px',
                fontWeight: activeBrand === brand.brandKey ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {brand.brandName}
              <span style={{ marginLeft: '6px', fontSize: '12px', color: '#64748b' }}>
                ({brand.news?.length || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {activeBrandData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '4px', height: '28px', background: activeBrandData.brandColor, borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#f1f5f9' }}>
                {activeBrandData.brandName} 最新资讯
              </h2>
            </div>

            {activeBrandData.news?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '16px' }}>
                暂无资讯数据
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeBrandData.news?.map((item, index) => (
                  <a
                    key={item.id || index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '16px 20px',
                      background: '#1e293b',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = activeBrandData.brandColor
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#334155'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 500, color: '#e2e8f0', lineHeight: '1.5' }}>
                          {item.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                          {item.summary}
                        </p>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                          {item.publishedAt?.split('T')[0] || ''}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {item.source || ''}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '12px', borderTop: '1px solid #1e293b' }}>
        品牌脉搏 Brand Pulse · 数据来源：新浪财经 · 自动更新
      </footer>
    </div>
  )
}

export default App
