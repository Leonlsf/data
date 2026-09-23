import { useState, useEffect } from 'react'
import './App.css'

const BRANDS_META = [
  { brandKey: 'popmart', brandName: '泡泡玛特', brandColor: '#FFD700' },
  { brandKey: 'masterkong', brandName: '康师傅', brandColor: '#E4002B' },
  { brandKey: 'yili', brandName: '伊利', brandColor: '#00A650' },
  { brandKey: 'threesquirrels', brandName: '三只松鼠', brandColor: '#FF6B00' },
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${m}-${day} ${h}:${min}`
}

function formatUpdateTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const sec = String(d.getSeconds()).padStart(2, '0')
  return `${y}/${m}/${day} ${h}:${min}:${sec}`
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeBrand, setActiveBrand] = useState('popmart')

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
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

  const brands = data?.brands || []

  const currentBrand = brands.find(b => b.brandKey === activeBrand) ||
    BRANDS_META.find(b => b.brandKey === activeBrand)

  const brandColor = currentBrand?.brandColor ||
    BRANDS_META.find(b => b.brandKey === activeBrand)?.brandColor || '#333'

  const newsList = currentBrand?.news || []

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1 className="title">
            <span className="title-icon">📊</span>
            品牌资讯
          </h1>
          {data?.lastUpdated && (
            <span className="update-time">
              更新于 {formatUpdateTime(data.lastUpdated)}
            </span>
          )}
        </div>
      </header>

      <nav className="tabs">
        {BRANDS_META.map(b => {
          const isActive = activeBrand === b.brandKey
          const count = brands.find(x => x.brandKey === b.brandKey)?.news?.length || 0
          return (
            <button
              key={b.brandKey}
              className={`tab ${isActive ? 'tab-active' : ''}`}
              style={isActive ? {
                color: b.brandColor,
                borderBottomColor: b.brandColor,
              } : {}}
              onClick={() => setActiveBrand(b.brandKey)}
            >
              <span className="tab-dot" style={{ backgroundColor: b.brandColor }} />
              {b.brandName}
              {count > 0 && <span className="tab-count">{count}</span>}
            </button>
          )
        })}
      </nav>

      <main className="main">
        {loading && (
          <div className="loading">
            <div className="spinner" />
            <p>加载中...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>⚠️ 数据加载失败: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="brand-section">
            <div className="brand-header" style={{ borderLeftColor: brandColor }}>
              <h2 className="brand-name" style={{ color: brandColor }}>
                {currentBrand?.brandName || BRANDS_META.find(b => b.brandKey === activeBrand)?.brandName}
              </h2>
              <span className="news-count">{newsList.length} 条资讯</span>
            </div>

            {newsList.length === 0 ? (
              <div className="empty">
                <p>暂无资讯数据</p>
              </div>
            ) : (
              <ul className="news-list">
                {newsList.map((item, idx) => (
                  <li key={item.id || idx} className="news-item">
                    <a
                      className="news-title"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ '--brand-color': brandColor }}
                    >
                      {item.title}
                    </a>
                    <div className="news-meta">
                      <span className="news-source" style={{ color: brandColor }}>
                        {item.source}
                      </span>
                      <span className="news-date">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Brand Pulse · 品牌资讯仪表盘</p>
      </footer>
    </div>
  )
}

export default App
