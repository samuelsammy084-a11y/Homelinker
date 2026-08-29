"use client";

import { motion } from "framer-motion";

/*
 * FloatingHouses
 *
 * A quiet atmospheric layer for the hero section: a handful of simple
 * house/building silhouettes that drift and tilt slowly, giving a subtle
 * sense of 3D depth without competing with the headline or search bar.
 *
 * Pure SVG + Framer Motion (already a dependency) — no new packages,
 * no changes needed to anything else already built. Respects
 * prefers-reduced-motion via Framer Motion's automatic handling of
 * the "transition" prop is not automatic, so we keep the motion gentle
 * and non-essential to the content either way.
 */

type HouseShapeProps = {
  className?: string;
  style?: React.CSSProperties;
  duration: number;
  delay: number;
  driftX: number;
  rotate: number;
  opacity: number;
};

function HouseShape({
  className,
  style,
  duration,
  delay,
  driftX,
  rotate,
  opacity,
}: HouseShapeProps) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      style={{ ...style, opacity }}
      initial={{ y: 0, x: 0, rotate: 0 }}
      animate={{
        y: [0, -18, 0],
        x: [0, driftX, 0],
        rotate: [0, rotate, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Simple geometric house silhouette: roof + body */}
      <path
        d="M32 6 L58 26 V56 H6 V26 Z"
        fill="none"
        stroke="#F3C94B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 56 V38 H40 V56"
        fill="none"
        stroke="#F3C94B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export default function FloatingHouses() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden sm:block"
      style={{ perspective: "800px" }}
    >
      <HouseShape
        className="absolute left-[8%] top-[18%] h-10 w-10 lg:h-14 lg:w-14"
        duration={9}
        delay={0}
        driftX={12}
        rotate={6}
        opacity={0.18}
      />

      <HouseShape
        className="absolute right-[10%] top-[12%] h-8 w-8 lg:h-12 lg:w-12"
        duration={11}
        delay={1.2}
        driftX={-10}
        rotate={-5}
        opacity={0.14}
      />

      <HouseShape
        className="absolute left-[18%] bottom-[16%] h-9 w-9 lg:h-12 lg:w-12"
        duration={13}
        delay={0.6}
        driftX={8}
        rotate={4}
        opacity={0.15}
      />

      <HouseShape
        className="absolute right-[16%] bottom-[22%] h-7 w-7 lg:h-10 lg:w-10"
        duration={10}
        delay={2}
        driftX={-14}
        rotate={-6}
        opacity={0.16}
      />

      <HouseShape
        className="absolute right-[30%] top-[30%] h-6 w-6 lg:h-9 lg:w-9"
        duration={14}
        delay={0.3}
        driftX={10}
        rotate={5}
        opacity={0.1}
      />
    </div>
  );
}