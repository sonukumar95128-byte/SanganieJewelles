"use client";

import { useEffect, useState } from "react";

type DualRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value?: [number, number];
  /** Fired on release, so dragging doesn't push a URL entry per pixel. */
  onCommit?: (range: [number, number]) => void;
};

function formatRupee(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function DualRangeSlider({ min, max, step = 100, value, onCommit }: DualRangeSliderProps) {
  const [low, setLow] = useState(value?.[0] ?? min);
  const [high, setHigh] = useState(value?.[1] ?? max);

  // Follow externally cleared/changed filters without fighting an in-progress drag.
  useEffect(() => {
    setLow(value?.[0] ?? min);
    setHigh(value?.[1] ?? max);
  }, [value?.[0], value?.[1], min, max]);

  const commit = (next: [number, number]) => onCommit?.(next);

  const lowPercent = ((low - min) / (max - min)) * 100;
  const highPercent = ((high - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-1.5 rounded-full bg-beige">
        <div
          className="absolute h-1.5 rounded-full bg-gold"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => setLow(Math.min(Number(e.target.value), high - step))}
          onPointerUp={() => commit([low, high])}
          onKeyUp={() => commit([low, high])}
          className="range-thumb absolute inset-0 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => setHigh(Math.max(Number(e.target.value), low + step))}
          onPointerUp={() => commit([low, high])}
          onKeyUp={() => commit([low, high])}
          className="range-thumb absolute inset-0 w-full appearance-none bg-transparent"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-ink/60">
        <span className="rounded-full border border-beige px-2.5 py-1">{formatRupee(low)}</span>
        <span className="rounded-full border border-beige px-2.5 py-1">{formatRupee(high)}</span>
      </div>
    </div>
  );
}
