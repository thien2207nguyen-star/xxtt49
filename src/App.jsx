import { useState } from "react";

export default function App() {
  const [data, setData] = useState("");
  const [exclude, setExclude] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const calculate = () => {
    const rows = data
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    if (!rows.length) return;

    let scoreMap = {};
    let dauCount = {};
    let duoiCount = {};

    rows.forEach((row, index) => {
      const nums = row.match(/\d{2}/g) || [];

      // kỳ gần mạnh hơn
      const weight = rows.length - index;

      nums.forEach((num) => {
        const dau = num[0];
        const duoi = num[1];

        scoreMap[num] = (scoreMap[num] || 0) + weight;

        dauCount[dau] = (dauCount[dau] || 0) + 1;
        duoiCount[duoi] = (duoiCount[duoi] || 0) + 1;
      });
    });

    // top đầu/đuôi mạnh
    const topDau = Object.entries(dauCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((x) => x[0]);

    const topDuoi = Object.entries(duoiCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((x) => x[0]);

    // tạo candidate
    let candidates = [];

    topDau.forEach((d) => {
      topDuoi.forEach((u) => {
        const num = d + u;

        let score = scoreMap[num] || 0;

        // boost nếu chưa ra gần đây
        const recent = rows
          .slice(0, 3)
          .some((r) => r.includes(num));

        if (!recent) score += 8;

        candidates.push({
          num,
          score,
        });
      });
    });

    // loại số
    const excluded = exclude
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    candidates = candidates.filter(
      (x) => !excluded.includes(x.num)
    );

    candidates.sort((a, b) => b.score - a.score);

    const best = candidates[0];

    setResult({
      number: best?.num || "--",
      confidence: best?.score || 0,
      top: candidates.slice(0, 5),
    });

    if (best) {
      setHistory((prev) => [
        {
          number: best.num,
          time: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    }
  };

  const resetAll = () => {
    setData("");
    setExclude("");
    setResult(null);
  };

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 500,
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <h1>XXTT49 Predictor PRO</h1>

      <textarea
        rows={8}
        placeholder="Nhập dữ liệu nhiều kỳ..."
        value={data}
        onChange={(e) => setData(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
        }}
      />

      <input
        placeholder="Loại số (12,34,56)"
        value={exclude}
        onChange={(e) => setExclude(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
        }}
      />

      <button
        onClick={calculate}
        style={{
          width: "100%",
          padding: 15,
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        PHÂN TÍCH
      </button>

      <button
        onClick={resetAll}
        style={{
          width: "100%",
          padding: 15,
        }}
      >
        RESET
      </button>

      {result && (
        <div
          style={{
            marginTop: 25,
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            textAlign: "center",
          }}
        >
          <h2>Dự đoán mạnh nhất</h2>

          <div
            style={{
              fontSize: 54,
              fontWeight: "bold",
            }}
          >
            {result.number}
          </div>

          <p>
            Confidence: {result.confidence}
          </p>

          <h3>Top đề cử</h3>

          {result.top.map((x, i) => (
            <div key={i}>
              {x.num} — {x.score}
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Lịch sử dự đoán</h3>

          {history.map((item, index) => (
            <div key={index}>
              {item.number} — {item.time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
      }
