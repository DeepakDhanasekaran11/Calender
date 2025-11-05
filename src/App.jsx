import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import Calendar from "./components/Calendar";
import eventsData from "./data/events.json";
import festivals from "./data/festivals.json";

export default function App() {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));
  const [events, setEvents] = useState(eventsData);

  function goPrev() {
    setCurrentMonth((m) => m.subtract(1, "month"));
  }
  function goNext() {
    setCurrentMonth((m) => m.add(1, "month"));
  }
  function jumpTo(monthIndex, year) {
    setCurrentMonth(dayjs().year(year).month(monthIndex).startOf("month"));
  }

  function addEvent(ev) {
    const id = Math.max(0, ...events.map((e) => e.id)) + 1;
    setEvents((prev) => [...prev, { ...ev, id }]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4 md:p-6 flex items-start justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-4 md:p-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Calender
            </h1>
            <p className="text-sm text-gray-500">
              Month view • add events • festivals highlighted
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="flex gap-2">
              <button
                onClick={goPrev}
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Prev
              </button>
              <button
                onClick={goNext}
                className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Next
              </button>
            </div>
            <div className="ml-auto text-sm text-gray-600 hidden md:block">
              Today:{" "}
              <span className="font-medium">{today.format("DD MMM YYYY")}</span>
            </div>
          </div>
        </header>

        <Calendar
          month={currentMonth}
          events={events}
          festivals={festivals}
          today={today}
          onAddEvent={addEvent}
          onJump={jumpTo}
        />

        <footer className="mt-6 text-xs text-gray-500">
        Calender 2025
        </footer>
      </div>
    </div>
  );
}
