import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Modern App</h1>
      <p className="subtitle">깔끔하고 세련된 웹앱에 오신 것을 환영합니다.</p>
      
      <div className="nav-buttons">
        <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          로그인하러 가기
        </Link>
        <Link href="/signup" className="btn btn-outline" style={{ textDecoration: 'none' }}>
          새 계정 만들기
        </Link>
      </div>
    </div>
  );
}
