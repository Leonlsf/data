import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败')
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ color: '#666' }}>加载品牌资讯中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <div>{error}</div>
        </div>
      </div>
    )
  }

  const brands = data?.brands || []
  const currentBrand = brands.find(b => b.brandKey === activeBrand)

  const containerStyle = {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem',
  }

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  const subtitleStyle = {
    color: '#999',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  }

  const tabContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }

  const getTabStyle = (isActive, color) => ({
    padding: '0.6rem 1.2rem',
    borderRadius: '999px',
    border: isActive ? `2px solid ${color}` : '2px solid #e0e0e0',
    background: isActive ? color + '15' : '#fff',
    color: isActive ? color : '#666',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  })

  const newsListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  }

  const newsItemStyle = {
    padding: '1rem 1.2rem',
    marginBottom: '0.5rem',
    borderRadius: '10px',
    background: '#fff',
    border: '1px solid #f0f0f0',
    transition: 'box-shadow 0.2s, transform 0.2s',
  }

  const newsLinkStyle = (color) => ({
    textDecoration: 'none',
    color: '#333',
    display: 'block',
  })

  const newsTitleStyle = {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '0.4rem',
  }

  const newsMetaStyle = {
    fontSize: '0.8rem',
    color: '#999',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  }

  const brandDotStyle = (color) => ({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: color,
    marginRight: '0.4rem',
  })

  const countBadgeStyle = (color) => ({
    display: 'inline-block',
    background: color + '20',
    color: color,
    fontSize: '0.75rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    marginLeft: '0.3rem',
    fontWeight: 600,
  })

  const bodyStyle = {
    minHeight: '100vh',
    background: '#f8f9fa',
    margin: 0,
  }

  return (
    <div style={bodyStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>品牌资讯 Brand Pulse</h1>
          <div style={subtitleStyle}>数据更新于 {data?.lastUpdated?.replace('T', ' ').replace('+08:00', '') || '未知'}</div>
        </div>

        <div style={tabContainerStyle}>
          {brands.map(brand => (
            <button
              key={brand.brandKey}
              style={getTabStyle(activeBrand === brand.brandKey, brand.brandColor)}
              onClick={() => setActiveBrand(brand.brandKey)}
            >
              <span style={brandDotStyle(brand.brandColor)} />
              {brand.brandName}
              <span style={countBadgeStyle(brand.brandColor)}>{brand.news?.length || 0}</span>
            </button>
          ))}
        </div>

        {currentBrand && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
              <span style={{ ...brandDotStyle(currentBrand.brandColor), width: '12px', height: '12px' }} />
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: currentBrand.brandColor }}>
                {currentBrand.brandName}
              </span>
              <span style={{ color: '#999', fontSize: '0.85rem' }}>共 {currentBrand.news?.length || 0} 条资讯</span>
            </div>
            <ul style={newsListStyle}>
              {currentBrand.news?.map((item, idx) => (
                <li key={item.id || idx} style={newsItemStyle}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={newsLinkStyle(currentBrand.brandColor)}>
                    <div style={newsTitleStyle}>{item.title}</div>
                    <div style={newsMetaStyle}>
                      <span>{item.source}</span>
                      <span>{item.publishedAt?.replace('T', ' ').replace('+08:00', '') || ''}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            {(!currentBrand.news || currentBrand.news.length === 0) && (
              <div style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>暂无资讯数据</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
