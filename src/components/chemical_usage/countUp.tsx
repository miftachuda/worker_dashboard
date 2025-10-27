import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface CountUpProps {
  value: number | string;
  duration?: number;
  decimals?: number;
}

export function CountUp({ value, duration = 1, decimals = 2 }: CountUpProps) {
  const count = useMotionValue<number>(0);

  // defensive: coerce latest to number before calling toFixed
  const rounded = useTransform(count, (latest) => {
    const num = typeof latest === "number" ? latest : Number(latest);
    if (!Number.isFinite(num)) return (0).toFixed(decimals);
    return num.toFixed(decimals);
  });

  useEffect(() => {
    // ensure the target value is a number
    const to = typeof value === "number" ? value : Number(value || 0);
    const controls = animate(count, to, { duration });
    return controls.stop;
  }, [value, duration, count]);

  return <motion.span>{rounded}</motion.span>;
}
