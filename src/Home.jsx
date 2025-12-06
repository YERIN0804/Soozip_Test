import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)",  // iPhone Safari 대응
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fbf2d5",
        padding: "2rem 1rem",
        paddingTop: "calc(env(safe-area-inset-top) + 1.2rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
        boxSizing: "border-box",
        overflow: "hidden", // 스크롤 완전 제거
      }}
    >
      {/* 상단 로고 + 텍스트 */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            margin: "20px 0 4px 0",     // 기존보다 살짝 줄임(정확히 맞추기 위해)
          }}
        >
          <img
            src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/soozip_logo.png"
            alt="로고"
            style={{
              width: "20px",
              height: "20px",
              objectFit: "contain",
              position: "relative",
              top: "28px",              // 기존 40px보다 줄임 — 화면 넘김 방지
            }}
          />
          <p
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "rgba(0,0,0,0.68)",
              margin: 0,
              position: "relative",
              top: "28px",              // 동일하게 조정
            }}
          >
            수집 방BTI
          </p>
        </div>

        <p
          style={{
            fontSize: 48,              // 기존보다 2px만 줄임 (디자인 유지)
            fontWeight: 800,
            color: "#000",
            marginTop: 50,             // 기존 70 → 최적화
            marginBottom: 0,
          }}
        >
          나의{" "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(#f88d2f4D 0.5em, transparent 0)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 0.3em",
              backgroundPosition: "0 0.5em",
            }}
          >
            집꾸 스타일
          </span>
          은?
        </p>
      </div>

      {/* 중앙 이미지 */}
      <img
        src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/main_bear.png"
        alt="main"
        style={{
          width: "85%",
          maxHeight: "32vh",          // ← 핵심: 화면 넘지 않는 적정값
          objectFit: "contain",
          marginBottom: "1.2rem",
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
          flexShrink: 0,               // 버튼 절대 줄어들지 않게(중요!)
        }}
        onClick={() => navigate("/loading")}
      >
        방BTI 알아보기
      </button>
    </div>
  );
}


// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const navigate = useNavigate();

//   return (
//     <div
//       style={{
//         paddingTop: "0px",
//         marginTop: "0px",
//         width: "100vw",
//         minHeight: "100vh", // 화면 세로 전체
//         height: "calc(var(--vh, 1vh) * 100)", // ← iPhone Safari 완전 대응!!!
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "space-between",
//         background: "#fbf2d5",
//         padding: "2rem 1rem",
//         boxSizing: "border-box",
//         overflow: "hidden", // 스크롤 제거
//       }}
//     >
//       {/* 상단 로고 + 텍스트 */}
//       <div style={{ textAlign: "center" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "6px",
//             margin: "30px 0 8px 0",
//           }}
//         >
//           <img
//             src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/soozip_logo.png"
//             alt="로고"
//             style={{
//               width: "20px",
//               height: "20px",
//               objectFit: "contain",
//               position: "relative",
//               top: "40px",
//             }}
//           />
//           <p
//             style={{
//               fontSize: 34,
//               fontWeight: 600,
//               color: "rgba(0,0,0,0.68)",
//               margin: 0,
//               position: "relative",
//               top: "40px",
//             }}
//           >
//             수집 방BTI
//           </p>
//         </div>

//         <p
//           style={{
//             fontSize: 50,
//             fontWeight: 800,
//             color: "#000",
//             marginTop: 70,
//           }}
//         >
//           나의{" "}
//           <span
//             style={{
//               backgroundImage:
//                 "linear-gradient(#f88d2f4D 0.5em, transparent 0)",
//               backgroundRepeat: "no-repeat",
//               backgroundSize: "100% 0.3em",
//               backgroundPosition: "0 0.5em",
//             }}
//           >
//             집꾸 스타일
//           </span>
//           은?
//         </p>
//       </div>

//       {/* 중앙 이미지 */}
//       <img
//         src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/main_bear.png"
//         alt="main"
//         style={{
//           width: 360,
//           objectFit: "contain",
//           maxHeight: "40vh", // ← 전체 높이 넘지 않게 설정!
//           marginBottom: "2rem",
//         }}
//       />

//       {/* 하단 버튼 */}
//       <button
//         style={{
//           width: "100%",
//           maxWidth: 360,
//           height: 58,
//           borderRadius: 12,
//           background: "#000",
//           border: "1px solid #ddd9d9",
//           color: "#fff",
//           fontSize: 30,
//           fontWeight: 600,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: "pointer",
//         }}
//         onClick={() => navigate("/loading")}
//       >
//         방BTI 알아보기
//       </button>
//     </div>
//   );
// }

