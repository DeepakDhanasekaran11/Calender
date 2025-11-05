import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import DayCell from "./DayCell";
import EventModal from "./EventModal";

function buildMonthGrid(month) {
  const start = month.startOf("month");
  const end = month.endOf("month");
  const startDay = start.startOf("week");
  const endDay = end.endOf("week");
  const grid = [];
  let cursor = startDay;
  while (cursor.isBefore(endDay) || cursor.isSame(endDay, "day")) {
    grid.push(cursor);
    cursor = cursor.add(1, "day");
  }
  return grid;
}

export default function Calendar({
  month,
  events = [],
  festivals = {},
  today,
  onAddEvent,
  onJump,
}) {
  const grid = useMemo(() => buildMonthGrid(month), [month]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of events) {
      map[ev.date] = map[ev.date] || [];
      map[ev.date].push(ev);
    }
    Object.keys(map).forEach((d) =>
      map[d].sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
    return map;
  }, [events]);

  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM")
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={month.month()}
            onChange={(e) => onJump(Number(e.target.value), month.year())}
            className="px-2 py-1 border rounded text-sm"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={month.year()}
            onChange={(e) =>
              onJump(month.month(), Number(e.target.value || dayjs().year()))
            }
            className="w-28 px-2 py-1 border rounded text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setSelectedDate(null);
              setModalOpen(true);
            }}
            className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
          >
            Add Event
          </button>
          <div className="text-sm text-gray-500">
            Showing: {month.format("MMMM YYYY")}
          </div>
        </div>
      </div>


      <div className="overflow-x-auto -mx-1">
        <div className="min-w-[640px] md:min-w-0 px-1">
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-center text-xs md:text-sm text-gray-500 py-1"
              >
                {d}
              </div>
            ))}

            {grid.map((day) => {
              const iso = day.format("YYYY-MM-DD");
              const isInMonth = day.month() === month.month();
              const dayEvents = eventsByDate[iso] || [];
              const festivalKey = day.format("MM-DD");
              const festName = festivals[festivalKey];
              return (
                <DayCell
                  key={iso}
                  day={day}
                  isInMonth={isInMonth}
                  isToday={day.isSame(today, "day")}
                  events={dayEvents}
                  festival={festName}
                  onClick={() => setSelectedDate(iso)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="bg-white rounded p-4 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold">
              Events on {dayjs(selectedDate).format("DD MMM YYYY")}
            </h3>
            <div className="mt-2">
              {(eventsByDate[selectedDate] || []).map((ev) => (
                <div key={ev.id} className="p-2 border rounded mb-2">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-xs text-gray-500">
                      {ev.startTime} - {ev.endTime}
                    </div>
                  </div>
                  <div className="text-xs mt-1">
                    Duration: {computeDuration(ev.startTime, ev.endTime)}
                  </div>
                </div>
              ))}
              {(eventsByDate[selectedDate] || []).length === 0 && (
                <div className="text-sm text-gray-500">No events</div>
              )}
            </div>
            <div className="mt-3 text-right">
              <button
                className="px-3 py-2 bg-gray-100 rounded"
                onClick={() => setSelectedDate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <EventModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        defaultDate={selectedDate}
        onSave={(ev) => {
          onAddEvent(ev);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

function computeDuration(start, end) {
  const sParts = start.split(":").map(Number);
  const eParts = end.split(":").map(Number);
  let minutes = eParts[0] * 60 + eParts[1] - (sParts[0] * 60 + sParts[1]);
  if (minutes < 0) minutes += 24 * 60;
  if (minutes < 60) return minutes + "m";
  const h = Math.floor(minutes / 60),
    m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
