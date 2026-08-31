import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📡</div>
          <div style={{ color: '#94a3b8' }}>加载资讯中...</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>数据加载失败</div>
      </div>
    )
  }

  const brand = data.brands?.[activeBrand]

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          品牌资讯 Brand Pulse
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          更新于 {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : data.date}
        </p>
      </header>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.brands?.map((b, i) => (
          <button
            key={b.brandKey}
            onClick={() => setActiveBrand(i)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: i === activeBrand ? `2px solid ${b.brandColor}` : '2px solid #334155',
              background: i === activeBrand ? `${b.brandColor}20` : 'transparent',
              color: i === activeBrand ? b.brandColor : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: i === activeBrand ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            {b.brandName}
          </button>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ width: '4px', height: '1.25rem', background: brand?.brandColor || '#60a5fa', borderRadius: '2px' }} />
          <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{brand?.brandName}</span>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
            {brand?.news?.length || 0} 条资讯
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {brand?.news?.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '1rem 1.25rem',
                background: '#1e293b',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.2s',
                borderLeft: `3px solid ${brand.brandColor}`
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#334155'}
              onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
            >
              <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.375rem', lineHeight: 1.5 }}>
                {item.title}
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                <span>{item.source}</span>
                <span>{item.publishedAt?.replace('T', ' ').replace(/\+08:00/, '')}</span>
              </div>
            </a>
          ))}
          {(!brand?.news || brand.news.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              暂无资讯数据
            </div>
          )}
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '3rem', padding: '1.5rem 0', borderTop: '1px solid #1e293b', color: '#475569', fontSize: '0.75rem' }}>
        Brand Pulse · 品牌资讯每日更新
      </footer>
    </div>
  )
}

export default App
