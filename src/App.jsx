import React, { useState, useEffect } from "react";

export default function App() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (dob) calculateAge(dob);
    else setAge(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dob]);

  function calculateAge(dobValue) {
    setError("");

    const dobDate = new Date(dobValue + "T00:00:00");
    if (isNaN(dobDate)) {
      setError("Invalid date");
      setAge(null);
      return;
    }

    const today = new Date();

    if (dobDate > today) {
      setError("Date of birth cannot be in the future.");
      setAge(null);
      return;
    }

    let years = today.getFullYear() - dobDate.getFullYear();
    let months = today.getMonth() - dobDate.getMonth();
    let days = today.getDate() - dobDate.getDate();

    if (days < 0) {
      // borrow days from previous month
      const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      days += prevMonthLastDay;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    // total days calculation (approx) - compute difference in ms and convert
    const diffMs = today - dobDate;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    setAge({ years, months, days, totalDays, totalMonths });
  }

  function handleReset() {
    setDob("");
    setAge(null);
    setError("");
  }

  function handleToday() {
    const today = new Date();
    const iso = today.toISOString().slice(0, 10);
    setDob(iso);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-pink-50 p-6">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-2">Age Calculator</h1>
        <p className="text-sm mb-4 text-gray-600">Enter your date of birth to calculate your exact age in years, months and days.</p>

        <label className="block mb-2 text-sm font-medium">Date of Birth</label>
        <div className="flex gap-2 items-center mb-4">
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
          <button onClick={handleToday} className="px-3 py-2 rounded bg-sky-500 text-white text-sm">Today</button>
          <button onClick={handleReset} className="px-3 py-2 rounded border text-sm">Reset</button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {age ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-sky-50 rounded">
              <h2 className="font-semibold text-lg">Exact Age</h2>
              <div className="mt-2 text-xl">
                {age.years} <span className="text-sm text-gray-500">years</span> , {age.months} <span className="text-sm text-gray-500">months</span> , {age.days} <span className="text-sm text-gray-500">days</span>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded">
              <h2 className="font-semibold text-lg">Other info</h2>
              <div className="mt-2 text-sm text-gray-700">
                <div>Total months: <strong>{age.totalMonths}</strong></div>
                <div>Total days: <strong>{age.totalDays}</strong></div>
              </div>
            </div>

            <div className="md:col-span-2 p-4 bg-white rounded border">
              <h3 className="font-medium">Shareable text</h3>
              <div className="mt-2 flex gap-2">
                <input className="flex-1 border rounded px-3 py-2" readOnly value={`You are ${age.years} years, ${age.months} months and ${age.days} days old.`} />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(`You are ${age.years} years, ${age.months} months and ${age.days} days old.`);
                    alert("Copied to clipboard!");
                  }}
                  className="px-3 py-2 rounded bg-sky-500 text-white"
                >
                  Copy
                </button>
              </div>
            </div>

            
          </div>
        ) : (
          <div className="text-gray-600">Enter your date of birth above to see your age.</div>
        )}

        <footer className="mt-6 text-right text-sm text-gray-400">Made with ❤️ using Vite + React</footer>
      </div>
    </div>
  );
}
