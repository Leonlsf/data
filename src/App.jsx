import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <div className="loading">加载中...</div>
  if (error) return <div className="error">{error}</div>
  if (!data) return <div className="error">暂无数据</div>

  return (
    <div className="container">
      <div className="header">
        <h1>Brand Pulse</h1>
        <p>品牌资讯实时追踪</p>
      </div>
      <div className="update-info">
        最后更新：{data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('zh-CN') : '未知'}
      </div>
      <div className="brands-grid">
        {data.brands?.map(brand => (
          <div key={brand.brandKey} className="brand-card">
            <div className="brand-header">
              <div className="brand-dot" style={{ backgroundColor: brand.brandColor }}></div>
              <div className="brand-name">{brand.brandName}</div>
              <div className="brand-count">{brand.news?.length || 0} 条</div>
            </div>
            <div className="news-list">
              {brand.news?.slice(0, 15).map(item => (
                <div key={item.id} className="news-item">
                  <a className="news-title" href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                  <div className="news-meta">{item.source} · {item.publishedAt?.slice(0, 16).replace('T', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
