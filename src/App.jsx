import { useState, useEffect } from 'react'

function App() {
  const [newsData, setNewsData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        if (data.brands && data.brands.length > 0) {
          setActiveBrand(data.brands[0].brandKey)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontSize:'18px', color:'#666' }}>加载中...</div>
  }

  if (!newsData || !newsData.brands) {
    return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', fontSize:'18px', color:'#999' }}>暂无数据</div>
  }

  const currentBrand = newsData.brands.find(b => b.brandKey === activeBrand) || newsData.brands[0]

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto', padding:'20px' }}>
      <header style={{ textAlign:'center', marginBottom:'30px' }}>
        <h1 style={{ fontSize:'28px', fontWeight:'700', marginBottom:'8px' }}>Brand Pulse</h1>
        <p style={{ color:'#888', fontSize:'14px' }}>品牌资讯 · 更新于 {newsData.lastUpdated}</p>
      </header>

      <div style={{ display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap', justifyContent:'center' }}>
        {newsData.brands.map(brand => (
          <button
            key={brand.brandKey}
            onClick={() => setActiveBrand(brand.brandKey)}
            style={{
              padding:'8px 20px', borderRadius:'20px', border:'2px solid ' + brand.brandColor,
              background: activeBrand === brand.brandKey ? brand.brandColor : 'white',
              color: activeBrand === brand.brandKey ? 'white' : brand.brandColor,
              cursor:'pointer', fontSize:'14px', fontWeight:'600', transition:'all 0.2s'
            }}
          >
            {brand.brandName}
          </button>
        ))}
      </div>

      <div>
        <h2 style={{ fontSize:'20px', fontWeight:'600', marginBottom:'16px', borderLeft:'4px solid ' + currentBrand.brandColor, paddingLeft:'12px' }}>
          {currentBrand.brandName}
          <span style={{ fontSize:'14px', fontWeight:'400', color:'#888', marginLeft:'8px' }}>{currentBrand.news.length} 条资讯</span>
        </h2>

        {currentBrand.news.length === 0 ? (
          <p style={{ color:'#999', textAlign:'center', padding:'40px' }}>暂无资讯</p>
        ) : (
          <ul style={{ listStyle:'none', padding:0 }}>
            {currentBrand.news.map(item => (
              <li key={item.id} style={{
                marginBottom:'12px', padding:'14px 18px', background:'white',
                borderRadius:'10px', boxShadow:'0 1px 3px rgba(0,0,0,0.08)',
                transition:'box-shadow 0.2s'
              }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration:'none', color:'#333' }}>
                  <div style={{ fontSize:'15px', fontWeight:'500', marginBottom:'6px', lineHeight:'1.5' }}>{item.title}</div>
                  <div style={{ fontSize:'12px', color:'#999' }}>
                    {item.source} · {item.publishedAt}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
