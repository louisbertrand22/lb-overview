"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  /** Above-the-fold hero image: preload and load eagerly */
  eager?: boolean;
  className?: string;
  /** Travel as a percentage of the frame height */
  amount?: number;
};

/** Image that drifts slowly against the scroll inside a fixed frame. */
export default function ParallaxImage({ src, alt, width, height, sizes, eager, className = "", amount = 7 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-ink-2 ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      <motion.div className="absolute inset-[-8%_0]" style={reduce ? undefined : { y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={eager}
          loading={eager ? "eager" : undefined}
          className="object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
        />
      </motion.div>
    </div>
  );
}
