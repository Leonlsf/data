import { useState, useEffect, useRef } from 'react'

const BRANDS_CONFIG = [
  { brandName: '泡泡玛特', brandKey: 'popmart', brandColor: '#FFD700' },
  { brandName: '康师傅', brandKey: 'masterkong', brandColor: '#E4002B' },
  { brandName: '伊利', brandKey: 'yili', brandColor: '#00A650' },
  { brandName: '三只松鼠', brandKey: 'threesquirrels', brandColor: '#FF6B00' },
]

function formatTime(isoStr) {
  if (!isoStr) return ''
  const date = new Date(isoStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${Math.max(minutes, 0)}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
}

function formatDate(isoStr) {
  if (!isoStr) return ''
  const date = new Date(isoStr)
  return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeBrand, setActiveBrand] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '18px' }}>
        加载中...
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f66', fontSize: '18px' }}>
        数据加载失败
      </div>
    )
  }

  const brands = data.brands || BRANDS_CONFIG.map(c => ({ ...c, news: [] }))
  const currentBrand = brands[activeBrand] || brands[0]
  const allNews = currentBrand?.news || []
  const filteredNews = searchQuery
    ? allNews.filter(n => n.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : allNews

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#e0e0e0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, background: 'linear-gradient(90deg, #FFD700, #FF6B00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              品牌资讯
            </h1>
            <span style={{ fontSize: '12px', color: '#666' }}>Brand Pulse</span>
            {data.lastUpdated && (
              <span style={{ fontSize: '11px', color: '#555', marginLeft: '12px' }}>
                更新于 {data.lastUpdated}
              </span>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="搜索资讯..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 16px 8px 36px',
                color: '#e0e0e0',
                fontSize: '14px',
                outline: 'none',
                width: '220px',
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '14px' }}>🔍</span>
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {brands.map((brand, i) => {
            const isActive = i === activeBrand
            const color = brand.brandColor || BRANDS_CONFIG[i]?.brandColor || '#888'
            return (
              <button
                key={brand.brandKey || i}
                onClick={() => { setActiveBrand(i); setSearchQuery('') }}
                style={{
                  background: isActive ? `${color}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: isActive ? color : '#999',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: isActive ? color : '#555',
                  boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                }} />
                {brand.brandName}
                <span style={{ fontSize: '12px', color: isActive ? `${color}aa` : '#666' }}>
                  {brand.news?.length || 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* News List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px 40px' }}>
        <div style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
          {filteredNews.length} 条资讯
          {searchQuery && ` · 搜索"${searchQuery}"`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredNews.map((news, idx) => {
            const color = currentBrand.brandColor || '#888'
            return (
              <a
                key={news.id || idx}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = `${color}44`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                }}
              >
                <div style={{ fontSize: '15px', lineHeight: 1.6, color: '#ddd', marginBottom: '8px' }}>
                  {news.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#666' }}>
                  <span style={{ color: `${color}cc` }}>{news.source || '新浪财经'}</span>
                  <span>·</span>
                  <span>{formatDate(news.publishedAt)}</span>
                  <span>·</span>
                  <span>{formatTime(news.publishedAt)}</span>
                </div>
              </a>
            )
          })}
        </div>
        {filteredNews.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#555', fontSize: '16px' }}>
            暂无资讯
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#444', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        Brand Pulse · 品牌资讯数据每日自动更新
      </footer>
    </div>
  )
}

export default App
