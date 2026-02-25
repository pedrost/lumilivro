"use client";

import { useState, useEffect } from "react";

function getTimeUntilMidnightET(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const etNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const hoursLeft = 23 - etNow.getHours();
  const minutesLeft = 59 - etNow.getMinutes();
  const secondsLeft = 59 - etNow.getSeconds();

  return {
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft,
  };
}

function padTwo(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer() {
  const [time, setTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    setTime(getTimeUntilMidnightET());
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnightET());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="inline-flex items-center gap-1">
        {["h", "m", "s"].map((label, index) => (
          <div key={label} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-amber-500 font-mono font-bold text-lg select-none">
                :
              </span>
            )}
            <span className="bg-neutral-800 rounded-lg px-3 py-1 font-mono font-bold text-white text-lg tabular-nums">
              --
            </span>
          </div>
        ))}
      </div>
    );
  }

  const digits = [
    { label: "h", value: padTwo(time.hours) },
    { label: "m", value: padTwo(time.minutes) },
    { label: "s", value: padTwo(time.seconds) },
  ];

  return (
    <div className="inline-flex items-center gap-1">
      {digits.map((digit, index) => (
        <div key={digit.label} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-amber-500 font-mono font-bold text-lg select-none">
              :
            </span>
          )}
          <span className="bg-neutral-800 rounded-lg px-3 py-1 font-mono font-bold text-white text-lg tabular-nums">
            {digit.value}
          </span>
        </div>
      ))}
    </div>
  );
}
