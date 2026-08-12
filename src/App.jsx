import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="container"><div className="loading">加载中...</div></div>
  if (!data || !data.brands) return <div className="container"><div className="loading">暂无数据</div></div>

  return (
    <div className="container">
      <header>
        <h1>品牌资讯 Brand Pulse</h1>
        <p>实时追踪品牌动态</p>
      </header>
      <div className="brands">
        {data.brands.map(brand => (
          <div key={brand.brandKey} className="brand-card" style={{ borderTopColor: brand.brandColor }}>
            <h2 style={{ color: brand.brandColor }}>{brand.brandName}</h2>
            <div className="brand-count">{brand.news?.length || 0} 条资讯</div>
            <ul className="news-list">
              {(brand.news || []).slice(0, 15).map(item => (
                <li key={item.id} className="news-item">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  <div className="news-meta">{item.source} · {item.publishedAt?.slice(0, 16)}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="update-time">最后更新：{data.lastUpdated}</div>
    </div>
  )
}

export default App
