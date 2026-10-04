import { useState, useEffect } from 'react'

const BRAND_COLORS = {
  popmart: '#FFD700',
  masterkong: '#E4002B',
  yili: '#00A650',
  threesquirrels: '#FF6B00',
}

function App() {
  const [data, setData] = useState(null)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'20px',color:'#666'}}>加载中...</div>
  if (!data) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'20px',color:'#e00'}}>数据加载失败</div>

  const brands = data.brands || []
  const current = brands[activeBrand]

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'20px',fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif'}}>
      <h1 style={{textAlign:'center',marginBottom:'8px'}}>品牌资讯 Brand Pulse</h1>
      <p style={{textAlign:'center',color:'#999',fontSize:'14px',marginBottom:'24px'}}>更新于 {data.lastUpdated}</p>
      <div style={{display:'flex',gap:'12px',marginBottom:'24px',justifyContent:'center',flexWrap:'wrap'}}>
        {brands.map((b, i) => (
          <button key={b.brandKey} onClick={() => setActiveBrand(i)}
            style={{
              padding:'10px 24px',border:'none',borderRadius:'8px',cursor:'pointer',
              background: i === activeBrand ? (BRAND_COLORS[b.brandKey] || '#333') : '#f0f0f0',
              color: i === activeBrand ? '#fff' : '#333',
              fontWeight: i === activeBrand ? '700' : '400',
              fontSize:'15px',transition:'all 0.2s'
            }}>
            {b.brandName}
          </button>
        ))}
      </div>
      {current && (
        <div>
          <h2 style={{color: BRAND_COLORS[current.brandKey] || '#333',marginBottom:'16px'}}>{current.brandName} 资讯</h2>
          {current.news && current.news.length > 0 ? (
            <ul style={{listStyle:'none',padding:0}}>
              {current.news.slice(0, 30).map(item => (
                <li key={item.id} style={{marginBottom:'14px',paddingBottom:'14px',borderBottom:'1px solid #eee'}}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    style={{color:'#1a1a1a',textDecoration:'none',fontSize:'15px',lineHeight:'1.6',display:'block'}}>
                    {item.title}
                  </a>
                  <span style={{color:'#999',fontSize:'13px'}}>{item.source} · {item.publishedAt}</span>
                </li>
              ))}
            </ul>
          ) : <p style={{color:'#999'}}>暂无资讯</p>}
        </div>
      )}
    </div>
  )
}

export default App
