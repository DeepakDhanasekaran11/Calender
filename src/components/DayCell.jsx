import React from "react";

export default function DayCell({
  day,
  isInMonth,
  isToday,
  events = [],
  festival,
  onClick,
}) {
  const maxVisible = 3;
  const extra = events.length - maxVisible;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border p-2 rounded ${
        isInMonth ? "bg-white" : "bg-gray-50"
      } ${isToday ? "ring-2 ring-indigo-300" : ""}`}
      style={{ minHeight: 64 }}
    >
      <div className="flex justify-between items-start">
        <div
          className={`text-sm md:text-base ${
            isInMonth ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {day.date()}
        </div>
        {festival && (
          <div className="text-xs px-1 bg-amber-100 rounded text-amber-800">
            {festival}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-1">
        {events.slice(0, maxVisible).map((ev) => (
          <div
            key={ev.id}
            className="event-pill"
            style={{ background: ev.color ?? "#6b7280" }}
            title={`${ev.title} ${ev.startTime}-${ev.endTime}`}
          >
            <span className="text-[10px] md:text-xs font-medium px-1 block overflow-hidden text-ellipsis max-w-full">
              {ev.title} • {ev.startTime}
            </span>
          </div>
        ))}
        {extra > 0 && (
          <div className="text-xs text-gray-500">+{extra} more</div>
        )}
      </div>
    </div>
  );
}
