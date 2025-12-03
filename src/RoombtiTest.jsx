// 예린 코드
import { useState, useEffect } from "react";
//import React from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import progressIcon from "./assets/loading_bear.png"; // 이미지 import
import LoadingPage from "./LoadingPage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function RoombtiTest() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState({});
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false); // submit 중복 방지

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // 🔹 추가: hover 상태 관리
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // DB에서 질문 불러오기
  useEffect(() => {
    async function fetchQuestions() {
      const { data, error } = await supabase
        .from("question")
        .select(
          `
          question_id,
          question_text,
          question_order,
          questionoption:questionoption(option_id, option_text)
        `
        )
        .order("question_order", { ascending: true });

      if (error) {
        console.error("DB 연결 실패:", error);
      } else {
        console.log("DB 연결 성공! 데이터:", data);
        setQuestions(data);
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const current = questions[step];

  // 답변 선택
  const handleAnswer = (option_id, index) => {
    setSelected(index);

    // 선택지를 업데이트
    const updatedChoices = { ...choices, [current.question_id]: option_id };
    setChoices(updatedChoices);

    if (step === questions.length - 1) {
      // 마지막 문항이면 setState 외부에서 submit 호출
      handleSubmit(updatedChoices);
    } else {
      // 다음 문항으로 이동
      setStep(step + 1);
      setSelected(null);
    }
  };

  // 제출
  const handleSubmit = async (finalChoices) => {
    if (submitted) return; // 이미 제출되었으면 아무것도 안 함
    setSubmitted(true); // 제출 시작 표시

    setLoadingSubmit(true);

    try {
      // sessionuser 테이블 이름 소문자
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessionuser")
        .insert([{ session_uuid: crypto.randomUUID() }])
        .select("session_id")
        .single();

      if (sessionError) throw sessionError;

      const session_id = sessionData.session_id;

      // choice 테이블에 12개 선택지만 정확히 insert
      const choiceInserts = Object.entries(finalChoices).map(
        ([qId, optionId]) => ({
          session_id,
          option_id: optionId,
        })
      );

      const { error: choiceError } = await supabase
        .from("choice")
        .insert(choiceInserts);

      if (choiceError) throw choiceError;

      // 3. sessionresultdetail 계산 (dimension_value_id 기준 점수 누적)
      const valueScores = {}; // { dimension_value_id: { dimension_id, score } }

      for (let option_id of Object.values(finalChoices)) {
        // option_id → dimension_value_id
        const { data: optionData, error: optionErr } = await supabase
          .from("questionoption")
          .select("dimension_value_id")
          .eq("option_id", option_id)
          .single();
        if (optionErr) throw optionErr;

        // dimension_value_id → dimension_id
        const { data: dimValueData, error: dimErr } = await supabase
          .from("dimensionvalue")
          .select("dimension_id")
          .eq("dimension_value_id", optionData.dimension_value_id)
          .single();
        if (dimErr) throw dimErr;

        const dim_id = dimValueData.dimension_id;
        const value_id = optionData.dimension_value_id;

        // 동일 dimension_value_id이면 점수 누적
        if (!valueScores[value_id]) {
          valueScores[value_id] = { dimension_id: dim_id, score: 1 };
        } else {
          valueScores[value_id].score += 1;
        }
      }

      // 4. sessionresultdetail upsert
      const resultInserts = Object.entries(valueScores).map(
        ([value_id, { dimension_id, score }]) => ({
          session_id,
          dimension_id,
          dimension_value_id: value_id,
          score,
        })
      );

      const { error: resultError } = await supabase
        .from("sessionresultdetail")
        .upsert(resultInserts, {
          onConflict: ["session_id", "dimension_id", "dimension_value_id"],
        });

      if (resultError) throw resultError;

      // 5. 최종 MBTI/방BTI 계산 및 ResultType 저장
      const { data: details, error: detailErr } = await supabase
        .from("sessionresultdetail")
        .select("dimension_id, dimension_value_id, score")
        .eq("session_id", session_id);
      if (detailErr) throw detailErr;

      // dimension별 최고 score 선택
      const bestValues = {}; // { dimension_id: dimension_value_id }
      details.forEach(({ dimension_id, dimension_value_id, score }) => {
        if (
          !bestValues[dimension_id] ||
          score > bestValues[dimension_id].score
        ) {
          bestValues[dimension_id] = { dimension_value_id, score };
        }
      });

      
      const dimensionOrder = [1, 2, 3, 4]; // 실제 dimension_id 순서에 맞게 수정
      

      let result_code = "";
      for (let dim_id of dimensionOrder) {
        const valueEntry = bestValues[dim_id];
        if (!valueEntry) continue;

        const value_id = valueEntry.dimension_value_id;
        const { data: valueData, error: valueErr } = await supabase
          .from("dimensionvalue")
          .select("dimension_value")
          .eq("dimension_value_id", value_id)
          .single();

        if (valueErr || !valueData?.dimension_value) {
          console.error("dimensionvalue 누락:", value_id);
          continue;
        }

        result_code += valueData.dimension_value; // dimension_value 컬럼 사용
      }

      const result_text = `${result_code} 유형입니다!`;
      // const result_image = `src/assets/${result_code}.png`;
      // const result_info_image = `src/assets/${result_code}_info.png`;
      const result_image = `https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/${result_code}.png`;
      const result_info_image = `https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/${result_code}_info.png`;

      const { error: resultTypeErr } = await supabase
        .from("resulttype")
        .insert([{ session_id, result_code, result_text, result_image, result_info_image }]);
      if (resultTypeErr) throw resultTypeErr;

      // TestResult 페이지로 이동
      navigate("/TestResult", { state: { session_id } });
    } catch (err) {
      console.error("제출 오류:", err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) return <LoadingPage/>;
  if (!current) return <p>질문이 없습니다.</p>;

  const progressStep = Math.min(step, questions.length - 1);
  const progressPercent = progressStep / (questions.length - 1);
  const progressWidth = `${progressPercent * 280}px`;

  return (
    <div
      style={{
        width: 408,
        //height: 852,
        minHeight: 700,
        height: "100dvh",
        background: "#fbf2d5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between", // ✅ 요소가 위–중앙–아래 균등 배치
        padding: "80px 0 40px", // ✅ 상단/하단 여백만 지정
        boxSizing: "border-box", // ✅ 여백 포함 크기 계산
        paddingTop: "80px",
        gap: "10px",
        position: "relative",
      }}
    >
      {/* 뒤로가기 아이콘 */}
      <svg
        onClick={() => navigate("/")}
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

      {/* 진행바 */}
      <div
        style={{
          position: "relative",
          width: 280,
          height: 50,
          marginTop: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 20,
            background: "#ddd9d9",
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          <div
            style={{
              width: progressWidth,
              height: 10,
              borderRadius: 20,
              background: "#fe6a0f",
              position: "absolute",
              top: 0,
              left: 0,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        <img
          src={progressIcon}
          alt="progress icon"
          style={{
            width: 50,
            height: 36,
            objectFit: "cover",
            position: "absolute",
            bottom: "5px",
            left: `${progressPercent * (280 - 50)}px`,
            transition: "left 0.4s ease",
          }}
        />
      </div>

      {/* 질문 */}
      <p
        style={{
          fontSize: 28,
          fontWeight: 900,
          textAlign: "center",
          color: "#000",
          marginTop: "1.5rem",
          whiteSpace: "pre-wrap", // 줄바꿈 문자(\n) 적용
          wordWrap: "break-word", 
          lineHeight: 1.4,
        }}
      >
        {current.question_text}
      </p>

      {/* 선택 옵션 */}
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns:
            current.questionoption.length === 4 ? "1fr 1fr" : "1fr",
          justifyItems: "center",
          marginTop: "1rem",
        }}
      >
        {current.questionoption.map((opt, i) => {
          //const [hoveredIndex, setHoveredIndex] = useState(null);
          const isImage = opt.option_text?.toLowerCase().endsWith(".png");
          const isTouchDevice = "ontouchstart" in window;

          
          return (
            <div
              key={opt.option_id}
              onClick={() => {handleAnswer(opt.option_id, i);
                setHoveredIndex(null);}
              }
              // onMouseEnter={() => setHoveredIndex(i)}
              // onMouseLeave={() => setHoveredIndex(null)}
              onMouseEnter={() => {
                if (!isTouchDevice) setHoveredIndex(i); // ← 모바일에서는 hover 무시
              }}
              onMouseLeave={() => {
                if (!isTouchDevice) setHoveredIndex(null); // ← 모바일에서는 hover 무시
              }}
              style={{
                width: current.questionoption.length === 4 ? 150 : 312,
                height: 170,
                borderRadius: 12,
                background: "#fff",
                //border: `2px solid ${selected === i ? "#fe6a0f" : "#ddd9d9"}`,
                // 🔹 수정: 선택 또는 hover 상태에 따라 border 색상 변경
                border: `2px solid ${
                  selected === i ? "#fe6a0f" : hoveredIndex === i ? "#fe6a0f" : "#ddd9d9"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                textAlign: "center",
                padding: "10px",
              }}
            >

              {/* 🔥 텍스트 vs 이미지 분기 */}
              {isImage ? (
                <img
                  src={`src/assets/${opt.option_text}`}
                  alt="option"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <p style={{ fontSize: 25, fontWeight: 500, color: "#000" }}>
                  {opt.option_text}
                </p>
              )}
            </div>
          );
        })}
      </div>




      


      {/* 🔥🔥🔥 제출 로딩 오버레이 (캐릭터 GIF) */}
      {loadingSubmit && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: 220,
              padding: "30px 20px 25px",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 4px 25px rgba(0,0,0,0.15)",
            }}
          >
            <img
              // src="src/assets/loading_character.gif"
              //src="src/assets/calc_bear.png"
              src="https://mmfurloptocazvhfmcvk.supabase.co/storage/v1/object/public/roombti/calc_bear.png"
              alt="loading"
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
                marginBottom: 12,
              }}
            />

            <p
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#fe6a0f",
                marginBottom: 5,
              }}
            >
              잠시만요!
            </p>

            <p
              style={{
                fontSize: 15,
                color: "#555",
              }}
            >
              방BTI 결과를 기다리는 중이에요 🔎
            </p>
          </div>
        </div>
      )}



    </div>
  );
}