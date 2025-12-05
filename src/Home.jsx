import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        //width: 408,
        // minHeight: 600,
        width: "100vw", // 화면 가로 전체
        // minHeight: "100vh", // 화면 세로 전체
        height: "100svh",   // 변경!
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fbf2d5",
        //padding: "2rem 1rem",
        padding: "calc(env(safe-area-inset-top) + 2rem) 1rem calc(env(safe-area-inset-bottom) + 2rem)",
        boxSizing: "border-box",
        cursor: "default",
        overflow: "hidden"
      }}
    >
      {/* 상단 로고 + 텍스트 */}
      <div style={{ textAlign: "center", cursor: "default" }}>
        {/* 로고 + '수집 방BTI' 한 줄 배치 */}
        <div
          style={{
            display: "flex",
            alignItems: "center", // 세로 가운데 정렬
            justifyContent: "center", // 전체 중앙 정렬
            gap: "6px", // 로고와 글씨 사이 간격
            margin: "30px 0 8px 0",
          }}
        >
          <img
            // src="src/assets/soozip_logo.png"
            src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/soozip_logo.png"
            alt="로고"
            style={{
              width: "20px", // 작게!
              height: "20px",
              objectFit: "contain",
              position: "relative",
              top: "40px",
            }}
          />
          <p
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "rgba(0,0,0,0.68)",
              margin: 0, // 기본 여백 제거
              position: "relative",
              top: "40px",
            }}
          >
            수집 방BTI
          </p>
        </div>

        <p
          style={{
            fontSize: 50,
            fontWeight: 800,
            color: "#000",
            marginTop: 70,
          }}
        >
          나의{" "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(#f88d2f4D 0.5em, transparent 0)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 0.3em", // 형광펜 굵기
              backgroundPosition: "0 0.5em", // 위치 조정 (글자 아래)
            }}
          >
            집꾸 스타일
          </span>
          은?
        </p>
      </div>
      {/* 중앙 이미지 */}
      <img
        //src="src/assets/main_bear.png"
        src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/main_bear.png"
        alt="main"
        style={{
          // marginTop: "0rem", // 원하는 만큼 조절
          marginBottom: "2rem",
          width: "90%",
          maxHeight: "40vh",
          objectFit: "contain",
        }}
      />
      {/* 하단 버튼 */}
      <button
        style={{
          width: "100%",
          maxWidth: 360,
          height: 58,
          borderRadius: 12,
          background: "#000",
          border: "1px solid #ddd9d9",
          color: "#fff",
          fontSize: 30,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginTop: -20,
        }}
        onClick={() => navigate("/loading")}
      >
        방BTI 알아보기
      </button>
    </div>
  );
}
