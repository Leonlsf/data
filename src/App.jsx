import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #334155', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#94a3b8' }}>加载中...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#f87171', fontSize: 18 }}>加载失败: {error}</p>
      </div>
    )
  }

  const brands = data?.brands || []
  const currentBrand = brands[activeBrand]

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
          <span style={{ color: '#60a5fa' }}>Brand</span> Pulse
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>品牌资讯每日速递 · {data?.date || ''}</p>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {brands.map((brand, i) => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(i)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              background: i === activeBrand ? brand.brandColor : '#1e293b',
              color: i === activeBrand ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </nav>

      {currentBrand && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: currentBrand.brandColor }} />
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>{currentBrand.brandName}</h2>
            <span style={{ color: '#64748b', fontSize: 13, marginLeft: 'auto' }}>
              共 {currentBrand.news?.length || 0} 条资讯
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentBrand.news?.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  background: '#1e293b',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: '#e2e8f0',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
              >
                <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 4 }}>{item.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                  <span>{item.source}</span>
                  <span>{item.publishedAt?.slice(0, 16).replace('T', ' ')}</span>
                </div>
              </a>
            ))}
            {(!currentBrand.news || currentBrand.news.length === 0) && (
              <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>暂无资讯</p>
            )}
          </div>
        </section>
      )}

      <footer style={{ textAlign: 'center', marginTop: 40, padding: 20, color: '#475569', fontSize: 12 }}>
        <p>最后更新: {data?.lastUpdated?.replace('T', ' ').slice(0, 19)}</p>
      </footer>
    </div>
  )
}

export default App
