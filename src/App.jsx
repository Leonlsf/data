import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const [showAll, setShowAll] = useState({})

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
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="app"><div className="loading">加载中...</div></div>
  if (error) return <div className="app"><div className="error-msg">数据加载失败: {error}</div></div>
  if (!data || !data.brands) return <div className="app"><div className="empty">暂无数据</div></div>

  const INITIAL_SHOW = 10

  return (
    <div className="app">
      <div className="header">
        <div className="logo">BP</div>
        <div className="header-text">
          <h1>品牌脉搏</h1>
          <p>Brand Pulse</p>
        </div>
      </div>
      <div className="updated">更新于 {data.date || data.lastUpdated}</div>

      <div className="brand-tabs">
        {data.brands.map(b => (
          <button
            key={b.brandKey}
            className={`brand-tab ${activeBrand === b.brandKey ? 'active' : ''}`}
            style={{ '--brand-color': b.brandColor }}
            onClick={() => { setActiveBrand(b.brandKey); setShowAll({}) }}
          >
            {b.brandName}
            <span className="count">({b.news?.length || 0})</span>
          </button>
        ))}
      </div>

      {data.brands
        .filter(b => activeBrand === 'all' || b.brandKey === activeBrand)
        .map(brand => {
          const isExpanded = showAll[brand.brandKey]
          const newsList = isExpanded ? brand.news : (brand.news || []).slice(0, INITIAL_SHOW)
          return (
            <div key={brand.brandKey} className="brand-section" style={{ '--brand-color': brand.brandColor }}>
              <h2>{brand.brandName} 资讯</h2>
              <div className="news-list">
                {newsList && newsList.length > 0 ? newsList.map(item => (
                  <a key={item.id} className="news-item" href={item.url} target="_blank" rel="noopener noreferrer" style={{ '--brand-color': brand.brandColor }}>
                    <h3>{item.title}</h3>
                    <div className="news-meta">
                      <span className="source">{item.source}</span>
                      <span>{item.publishedAt?.replace('T', ' ').replace(/\+08:00$/, '')}</span>
                    </div>
                  </a>
                )) : <div className="empty">暂无资讯</div>}
              </div>
              {!isExpanded && brand.news && brand.news.length > INITIAL_SHOW && (
                <button className="view-all-btn" onClick={() => setShowAll(s => ({ ...s, [brand.brandKey]: true }))}>
                  查看全部 {brand.news.length} 条
                </button>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default App
