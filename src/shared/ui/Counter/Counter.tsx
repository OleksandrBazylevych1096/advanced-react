import { useEffect, useRef, useState } from "react";

interface CounterProps {
  from?: number;
  to: number;
  durationMs?: number;
  formatter?: (value: number) => string;
  once?: boolean;
}

export const Counter = (props: CounterProps) => {
  const { from = 0, to, durationMs = 2000, formatter, once = true } = props;

  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setStarted(true);
          if (once) observer.disconnect();
        }
      },

      { threshold: 0.5, rootMargin: "0px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once]);

  useEffect(() => {
    if (!started) return;

    let start: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!start) {
        start = timestamp;
      }
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const current = Math.floor(from + (to - from) * progress);
      setValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [from, to, durationMs, started]);

  return <span ref={ref}>{formatter ? formatter(value) : value}</span>;
};
