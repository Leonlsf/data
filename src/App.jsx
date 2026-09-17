import { useState, useEffect } from 'react'

const defaultData = { lastUpdated: '', date: '', brands: [] }

function App() {
  const [data, setData] = useState(defaultData)
  const [activeBrand, setActiveBrand] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/news-data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontFamily:'system-ui,sans-serif',color:'#666'}}>加载中...</div>

  const brands = data.brands || []
  const current = brands[activeBrand]

  return (
    <div style={{fontFamily:'system-ui,-apple-system,sans-serif',maxWidth:960,margin:'0 auto',padding:'20px 16px'}}>
      <header style={{textAlign:'center',marginBottom:24}}>
        <h1 style={{fontSize:28,fontWeight:700,margin:'0 0 4px'}}>品牌资讯</h1>
        <p style={{fontSize:13,color:'#888',margin:0}}>
          Brand Pulse {data.lastUpdated && `· 更新于 ${data.lastUpdated.slice(0,16).replace('T',' ')}`}
        </p>
      </header>

      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',justifyContent:'center'}}>
        {brands.map((b, i) => (
          <button key={b.brandKey} onClick={() => setActiveBrand(i)} style={{
            padding:'8px 18px',borderRadius:20,border:'none',cursor:'pointer',
            fontSize:14,fontWeight:600,transition:'all 0.2s',
            background: i===activeBrand ? b.brandColor : '#f0f0f0',
            color: i===activeBrand ? '#fff' : '#333',
            boxShadow: i===activeBrand ? `0 2px 8px ${b.brandColor}40` : 'none'
          }}>{b.brandName}</button>
        ))}
      </div>

      {current && (
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <div style={{width:12,height:12,borderRadius:'50%',background:current.brandColor}} />
            <h2 style={{fontSize:20,fontWeight:600,margin:0}}>{current.brandName}</h2>
            <span style={{fontSize:13,color:'#999'}}>共 {current.news?.length || 0} 条</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {(current.news || []).map(item => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                display:'block',padding:'12px 16px',borderRadius:8,
                background:'#fafafa',textDecoration:'none',color:'inherit',
                borderLeft:`3px solid ${current.brandColor}`,
                transition:'background 0.2s'
              }}>
                <div style={{fontSize:15,fontWeight:500,lineHeight:1.5,marginBottom:4}}>{item.title}</div>
                <div style={{fontSize:12,color:'#999'}}>
                  {item.publishedAt?.slice(0,10)} · {item.source}
                </div>
              </a>
            ))}
          </div>
          {(!current.news || current.news.length === 0) && (
            <div style={{textAlign:'center',padding:40,color:'#999'}}>暂无资讯</div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
