"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Welcome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          createConfetti();
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  const createConfetti = () => {
    const container = document.getElementById("confetti-container");
    if (!container) return;
    
    const colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722"];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti-piece";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = confetti.style.width;
      confetti.style.borderRadius = "50%";
      confetti.style.opacity = "1";
      confetti.style.position = "absolute";
      confetti.style.top = "-20px";
      confetti.style.zIndex = "9998";

      container.appendChild(confetti);

      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;

      confetti.animate([
        { transform: `translateY(-20px) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards"
      });

      // Cleanup
      setTimeout(() => {
        if (container.contains(confetti)) {
          container.removeChild(confetti);
        }
      }, (duration + delay) * 1000);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: "center" }}>로딩 중...</div>;
  }

  if (!user) return null;

  return (
    <>
      <div id="confetti-container" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "hidden", zIndex: 9999 }}></div>

      <div className="container animate-pop">
        <div className="animate-float" style={{ fontSize: "4rem", marginBottom: "1rem", textAlign: "center" }}>🎉</div>
        <h1 className="rainbow">환영합니다!</h1>
        <p className="subtitle" id="welcome-message">{user.name}님, 다시 만나서 반가워요!</p>

        <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "1rem", textAlign: "left" }}>
          <p><strong>이름:</strong> <span>{user.name}</span></p>
          <p><strong>이메일:</strong> <span>{user.email}</span></p>
        </div>

        <div className="nav-buttons" style={{ marginTop: "2rem" }}>
          <Link href="/main" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            메인 페이지로 이동
          </Link>
        </div>
      </div>
    </>
  );
}
