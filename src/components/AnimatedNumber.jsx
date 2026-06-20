import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// Smoothly counts up from 0 to the target value whenever it changes
function AnimatedNumber({ value, decimals = 1 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const numericValue = parseFloat(value) || 0;
    const controls = animate(count, numericValue, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  return <motion.span>{display}</motion.span>;
}

export default AnimatedNumber;