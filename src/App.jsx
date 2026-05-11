import { useState } from "react";

export default function App() {
  const [data, setData] = useState("");
  const [exclude, setExclude] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const calculate = () => {
    const rows = data
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

    let scores = {};

    rows.forEach((row) => {
      const nums = row.match(/\d{2}/g) || [];

      nums.forEach((n) => {
        scores[n] = (scores[n] || 0) + 1;
      });
    });

    const excluded = exclude
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    excluded.forEach((n) => delete scores[n]);

    let best = "";
    let max = -1;

    Object.entries(scores).forEach(([num, count]) => {
      if (count > max) {
        max = count;
        best = num;
      }
    });

    setResult(best || "Không có số");

    if (best) {
      setHistory((prev) => [
        { number: best, time: new Date().toLocaleString() },
        ...prev,
      ]);
    }
  };

  const resetAll = () => {
    setData("");
    setExclude("");
    setResult("");
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
      <h1>XXTT49 Predictor</h1>

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
        placeholder="Loại số (vd: 12,34,56)"
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
          padding: 14,
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
          padding: 14,
        }}
      >
        RESET
      </button>

      {result && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        >
          <h2>KẾT QUẢ</h2>
          <div style={{ fontSize: 50, fontWeight: "bold" }}>
            {result}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Lịch sử</h3>
          {history.map((item, index) => (
            <div key={index}>
              {item.number} - {item.time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
      }
