import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import CardButton from "./CardButton.tsx";

export default function RoomCounsult() {
  const navigate = useNavigate(); // ✅ 추가
  const [selectedId, setSelectedId] = useState(null);

  const cards = [
    {
      id: 1,
      title: "스타일링 상담",
      subtitle: "카카오톡 1:1 상담으로 맞춤 솔루션 알아보기",
      url: "http://pf.kakao.com/_VNxiLn/chat",
      imgSrc: "https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/kakao_icon.png",
    },
    {
      id: 2,
      title: "스타일링 타입",
      subtitle: "스타일링은 어떤 종류가 있고, 어떤 순서로 진행되는지 알아보기",
      url: "/styling-type",
      imgSrc: "https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/type_icon.png",
    },
    {
      id: 3,
      title: "스타일링 사례",
      subtitle: "수집과 함께 스타일링을 더 알아보기",
      url: "https://soozip.co.kr/portfolio/list.html?cate_no=97",
      imgSrc: "https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/soozip_logo.png",
    },
  ];

  return (
    <div
      style={{
        width: 408,
        minHeight: "100dvh",
        background: "#fbf2d5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        // padding: "1rem 1rem",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* 뒤로가기 아이콘 */}
      <svg
        onClick={() => navigate("/TestResult")}
        width={14}
        height={16}
        viewBox="0 0 14 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          cursor: "pointer",
          position: "absolute",
          left: "38.5px",
          top: "67.5px",
        }}
      >
        <path
          d="M0.292893 7.29289C-0.0976314 7.68342 -0.0976315 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538407 7.04738 0.538407 6.65685 0.928932L0.292893 7.29289ZM14 8L14 7L1 7L1 8L1 9L14 9L14 8Z"
          fill="black"
          fillOpacity="0.42"
        />
      </svg>
      <div
        style={{
          width: 150,
          height: 33,
          borderRadius: 30,
          background: "#000",
          color: "#fff",
          fontSize: 23,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 90,
          marginBottom: 80,
        }}
      >
        상담 알아보기
      </div>

      {cards.map((card) => (
        <CardButton
          key={card.id}
          {...card}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      ))}
    </div>
  );
}