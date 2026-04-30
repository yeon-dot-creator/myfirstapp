"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert(`${data.user.name}님, 로그인이 완료되었습니다!`);
        router.push("/welcome");
      } else {
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>로그인</h1>
      <p className="subtitle">다시 만나서 반가워요!</p>

      {error && <div className="error-message" style={{ marginBottom: "1rem" }}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일 주소</label>
          <input
            type="email"
            id="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      
      <div className="footer-link">
        계정이 없으신가요? <Link href="/signup">회원가입</Link>
      </div>
    </div>
  );
}
