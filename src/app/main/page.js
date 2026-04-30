"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const newsOutlets = [
  { cardId: 'news-card-1', name: 'BBC News', defaultUrl: 'https://www.bbc.com/news/business', searchUrl: 'https://www.bbc.co.uk/search?q=', color: '#bb1919' },
  { cardId: 'news-card-2', name: 'NY Times', defaultUrl: 'https://www.nytimes.com/section/business', searchUrl: 'https://www.nytimes.com/search?query=', color: '#121212' },
  { cardId: 'news-card-3', name: 'The Guardian', defaultUrl: 'https://www.theguardian.com/business', searchUrl: 'https://www.theguardian.com/search?q=', color: '#052962' },
  { cardId: 'news-card-4', name: 'Wall Street Journal', defaultUrl: 'https://www.wsj.com/economy', searchUrl: 'https://www.wsj.com/search?query=', color: '#0274B6' },
  { cardId: 'news-card-5', name: 'Reuters', defaultUrl: 'https://www.reuters.com/business/', searchUrl: 'https://www.reuters.com/search/news?query=', color: '#FF8000' },
  { cardId: 'news-card-6', name: 'Bloomberg', defaultUrl: 'https://www.bloomberg.com/economics', searchUrl: 'https://www.bloomberg.com/search?query=', color: '#472a91' },
  { cardId: 'news-card-7', name: 'Financial Times', defaultUrl: 'https://www.ft.com/global-economy', searchUrl: 'https://www.ft.com/search?q=', color: '#FBB03B' },
  { cardId: 'news-card-8', name: 'CNBC', defaultUrl: 'https://www.cnbc.com/economy/', searchUrl: 'https://www.cnbc.com/search/?query=', color: '#005594' }
];

export default function MainDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState("");
  const [selectedOutlets, setSelectedOutlets] = useState(newsOutlets.map(o => o.cardId));
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const [diaryContent, setDiaryContent] = useState("");
  const [diarySaveStatus, setDiarySaveStatus] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          loadHistory();
          loadNotes("_general");
          loadDiary();
          loadBookmarks();
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success) setHistory(data.history);
    } catch (e) {}
  };

  const loadNotes = async (kw) => {
    try {
      const res = await fetch(`/api/notes?keyword=${encodeURIComponent(kw)}`);
      const data = await res.json();
      if (data.success) setNotes(data.content);
    } catch (e) {}
  };

  const loadDiary = async () => {
    try {
      const res = await fetch("/api/diary");
      const data = await res.json();
      if (data.success) setDiaryContent(data.content);
    } catch (e) {}
  };

  const saveDiary = async () => {
    try {
      await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: diaryContent })
      });
      const now = new Date().toLocaleTimeString('ko-KR');
      setDiarySaveStatus(`✅ 저장 완료 (${now})`);
      setTimeout(() => setDiarySaveStatus(""), 2000);
    } catch (e) {}
  };

  const loadBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks");
      const data = await res.json();
      if (data.success) setBookmarks(data.bookmarks);
    } catch (e) {}
  };

  const addBookmark = async (title, url, outlet) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, outlet })
      });
      const data = await res.json();
      if (data.success) {
        loadBookmarks();
        alert('북마크가 추가되었습니다.');
      } else if (data.message === 'Already bookmarked') {
        alert('이미 북마크된 항목입니다.');
      }
    } catch (e) {}
  };

  const removeBookmark = async (id) => {
    if (!confirm('북마크를 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      loadBookmarks();
    } catch (e) {}
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedOutlets(newsOutlets.map(o => o.cardId));
    } else {
      setSelectedOutlets([]);
    }
  };

  const toggleOutlet = (cardId) => {
    if (selectedOutlets.includes(cardId)) {
      setSelectedOutlets(selectedOutlets.filter(id => id !== cardId));
    } else {
      setSelectedOutlets([...selectedOutlets, cardId]);
    }
  };

  const searchNews = async (searchKw) => {
    const kw = searchKw || keyword.trim();
    if (!kw) {
      alert('검색할 키워드를 입력해 주세요.');
      return;
    }

    setKeyword(kw);
    setCurrentSearchKeyword(kw);
    setSearchStatus(`✅ "${kw}" 키워드로 ${newsOutlets.length}개 언론사 검색 링크가 업데이트되었습니다. (${selectedOutlets.length}개 선택됨)`);

    // Add to history API
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: kw })
    });
    loadHistory();
    loadNotes(kw);
  };

  const resetSearch = () => {
    setKeyword("");
    setCurrentSearchKeyword("");
    setSearchStatus("");
    loadNotes("_general");
  };

  const openSelectedSearch = () => {
    const kw = keyword.trim();
    if (!kw) {
      alert('먼저 검색할 키워드를 입력해 주세요.');
      return;
    }
    if (selectedOutlets.length === 0) {
      alert('열고 싶은 언론사를 하나 이상 선택해 주세요.');
      return;
    }
    searchNews(kw);
    let opened = 0;
    selectedOutlets.forEach(cardId => {
      const outlet = newsOutlets.find(o => o.cardId === cardId);
      if (outlet) {
        window.open(outlet.searchUrl + encodeURIComponent(kw), '_blank');
        opened++;
      }
    });
    setSearchStatus(`🚀 "${kw}" 키워드로 ${opened}개 언론사 검색 페이지를 열었습니다.`);
  };

  const openAllSearch = () => {
    const kw = keyword.trim();
    if (!kw) {
      alert('먼저 검색할 키워드를 입력해 주세요.');
      return;
    }
    searchNews(kw);
    newsOutlets.forEach(outlet => {
      window.open(outlet.searchUrl + encodeURIComponent(kw), '_blank');
    });
    setSearchStatus(`🌐 "${kw}" 키워드로 ${newsOutlets.length}개 언론사 검색 페이지를 모두 열었습니다.`);
  };

  const clearHistory = async () => {
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
  };

  const saveNotes = async () => {
    const kw = currentSearchKeyword || "_general";
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: kw, content: notes })
    });
    const now = new Date().toLocaleTimeString('ko-KR');
    setSaveStatus(`✅ 저장 완료 (${now})`);
    setTimeout(() => setSaveStatus(""), 2000);
  };

  const clearNotes = async () => {
    if (!confirm('현재 메모를 지우시겠습니까?')) return;
    const kw = currentSearchKeyword || "_general";
    await fetch(`/api/notes?keyword=${encodeURIComponent(kw)}`, { method: "DELETE" });
    setNotes("");
    setSaveStatus("🗑️ 메모가 삭제되었습니다.");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  if (loading) return <div className="container" style={{ textAlign: "center" }}>로딩 중...</div>;
  if (!user) return null;

  return (
    <div className="container container-wide" style={{ maxWidth: '1100px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <h1 style={{ marginBottom: 0 }}>My Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: 'auto', padding: '0.5rem 1rem', marginTop: 0 }}>로그아웃</button>
      </header>

      <main>
        <section className="animate-pop">
          <h2>환영합니다, <span>{user.name}</span>님!</h2>
          <p className="subtitle" style={{ textAlign: 'left' }}>글로벌 경제 뉴스를 한눈에 확인해 보세요.</p>
        </section>

        <section style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: 'white', fontSize: '1.1rem' }}>🔍 키워드로 경제 뉴스 검색</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: inflation, tariff, Fed..." 
              style={{ flex: 1, minWidth: '180px', padding: '0.75rem 1rem', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none', background: 'rgba(255,255,255,0.95)' }}
              onKeyDown={(e) => e.key === 'Enter' && searchNews()}
            />
            <button onClick={() => searchNews()} 
              style={{ padding: '0.75rem 1.25rem', border: 'none', borderRadius: '0.5rem', background: 'white', color: '#667eea', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseOver={(e) => e.target.style.transform='scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform='scale(1)'}>
              검색
            </button>
            <button onClick={openSelectedSearch} 
              style={{ padding: '0.75rem 1.25rem', border: 'none', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s ease', backdropFilter: 'blur(4px)' }}
              onMouseOver={(e) => e.target.style.background='rgba(255,255,255,0.35)'}
              onMouseOut={(e) => e.target.style.background='rgba(255,255,255,0.2)'}>
              🚀 선택 열기
            </button>
            <button onClick={openAllSearch} 
              style={{ padding: '0.75rem 1.25rem', border: 'none', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s ease', backdropFilter: 'blur(4px)' }}
              onMouseOver={(e) => e.target.style.background='rgba(255,255,255,0.35)'}
              onMouseOut={(e) => e.target.style.background='rgba(255,255,255,0.2)'}>
              🌐 모두 열기
            </button>
            <button onClick={resetSearch} 
              style={{ padding: '0.75rem 1rem', border: '2px solid rgba(255,255,255,0.5)', borderRadius: '0.5rem', background: 'transparent', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s ease' }}
              onMouseOver={(e) => e.target.style.background='rgba(255,255,255,0.15)'}
              onMouseOut={(e) => e.target.style.background='transparent'}>
              ↺ 초기화
            </button>
          </div>
          {searchStatus && <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{searchStatus}</p>}

          {history.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ margin: '0 0 0.4rem 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>📚 최근 검색:</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {history.map((h, i) => (
                  <button key={i} onClick={() => searchNews(h)}
                    style={{ padding: '0.25rem 0.6rem', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '1rem', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.75rem', cursor: 'pointer' }}
                  >{h}</button>
                ))}
                <button onClick={clearHistory} style={{ padding: '0.25rem 0.5rem', border: 'none', borderRadius: '1rem', background: 'rgba(255,100,100,0.3)', color: 'white', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          )}
        </section>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', padding: '0.5rem 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <input type="checkbox" checked={selectedOutlets.length === newsOutlets.length} onChange={(e) => toggleSelectAll(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#667eea', cursor: 'pointer' }} />
            전체 선택 / 해제
          </label>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedOutlets.length}개 선택됨</span>
        </div>

        <div className="dashboard-grid">
          {newsOutlets.map(outlet => (
            <div key={outlet.cardId} className="card" style={{ borderColor: currentSearchKeyword ? '#667eea' : 'var(--border-color)', borderWidth: currentSearchKeyword ? '2px' : '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: outlet.color, width: '8px', height: '1.5rem', borderRadius: '4px' }}></span>
                  <h3 style={{ margin: 0 }}>{outlet.name}</h3>
                </div>
                <input type="checkbox" checked={selectedOutlets.includes(outlet.cardId)} onChange={() => toggleOutlet(outlet.cardId)}
                  style={{ width: '16px', height: '16px', accentColor: '#667eea', cursor: 'pointer' }} />
              </div>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-color)', marginBottom: '0.5rem' }}>{outlet.name} 경제</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <a href={currentSearchKeyword ? `${outlet.searchUrl}${encodeURIComponent(currentSearchKeyword)}` : outlet.defaultUrl} target="_blank" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', fontSize: '0.875rem', padding: '0.5rem 1rem', textDecoration: 'none', margin: 0 }}>
                  {currentSearchKeyword ? `"${currentSearchKeyword}" 검색` : '기사 보기'}
                </a>
                <button 
                  onClick={() => addBookmark(
                    currentSearchKeyword ? `[${outlet.name}] "${currentSearchKeyword}" 검색` : `[${outlet.name}] 메인 경제`, 
                    currentSearchKeyword ? `${outlet.searchUrl}${encodeURIComponent(currentSearchKeyword)}` : outlet.defaultUrl, 
                    outlet.name
                  )}
                  className="btn btn-outline" 
                  style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem 1rem', margin: 0 }}
                  title="중요 표시 (북마크 저장)"
                >
                  ⭐
                </button>
              </div>
            </div>
          ))}
        </div>

        <section style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>📝 비교 분석 메모</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={saveNotes} style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '0.4rem', background: '#667eea', color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>💾 저장</button>
              <button onClick={clearNotes} style={{ padding: '0.4rem 1rem', border: '1px solid #e0e0e0', borderRadius: '0.4rem', background: 'white', color: '#888', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>🗑️ 지우기</button>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>각 언론사의 논조와 관점을 비교하며 메모해 보세요. 키워드별로 자동 저장됩니다.</p>
          
          {currentSearchKeyword && (
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ background: '#667eea', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>🔍 {currentSearchKeyword}</span>
            </div>
          )}

          <textarea 
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="예시:&#10;[BBC] 소비자 물가 상승에 초점, 서민 생활 영향 강조&#10;[WSJ] 연준 금리 정책과 시장 반응 중심 분석"
            style={{ width: '100%', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '0.9rem', lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
          ></textarea>
          {saveStatus && <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: saveStatus.includes('✅') ? '#4caf50' : '#888' }}>{saveStatus}</p>}
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          {/* 매일 요약 일기 섹션 */}
          <section style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>📖 데일리 경제 일기</h3>
              <button onClick={saveDiary} style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '0.4rem', background: '#ec4899', color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>💾 일기 저장</button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>오늘의 중요한 경제 이슈나 배운 점을 일기처럼 요약해 보세요.</p>
            
            <textarea 
              rows={8}
              value={diaryContent}
              onChange={(e) => setDiaryContent(e.target.value)}
              placeholder="오늘 하루 요약:&#10;오늘은 연준의 금리 인하 소식이 시장에 큰 영향을 미쳤다..."
              style={{ width: '100%', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.5rem', fontSize: '0.9rem', lineHeight: 1.6, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            ></textarea>
            {diarySaveStatus && <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#4caf50' }}>{diarySaveStatus}</p>}
          </section>

          {/* 중요 기사 북마크 섹션 */}
          <section style={{ padding: '1.5rem', background: 'white', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🔖 중요 표시된 항목</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>관심 있는 기사나 검색 결과를 모아볼 수 있습니다.</p>
            
            {bookmarks.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '0.5rem' }}>
                아직 북마크된 항목이 없습니다.<br/>카드의 ⭐ 버튼을 눌러 추가해 보세요.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {bookmarks.map((b) => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', background: '#f8fafc' }}>
                    <div style={{ overflow: 'hidden', flex: 1, marginRight: '1rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{b.title}</p>
                      <a href={b.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#4f46e5', textDecoration: 'none', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{b.url}</a>
                    </div>
                    <button onClick={() => removeBookmark(b.id)} style={{ padding: '0.4rem 0.6rem', border: 'none', borderRadius: '0.25rem', background: '#fee2e2', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>삭제</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
