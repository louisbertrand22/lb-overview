'use client';

/**
 * Adapted from React Bits FlowingMenu (see .premium-frontend/manifest.json for the pinned revision).
 * Changes: Next.js links, a metadata column per row, optional image per row (falls back to a text
 * chip), marquee tween paused unless the row is hovered, no hover reveal for touch or reduced motion.
 */

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export interface MenuItemData {
  link: string;
  text: string;
  image?: string;
  chip?: string;
  meta?: string;
  index?: string;
}

interface FlowingMenuProps {
  items?: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

interface MenuItemProps extends MenuItemData {
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  canHover: boolean;
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = 'transparent',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#120F17',
  borderColor = '#fff'
}) => {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <div className="w-full overflow-hidden" style={{ backgroundColor: bgColor }}>
      <ul className="m-0 flex list-none flex-col p-0" style={{ borderBottom: `1px solid ${borderColor}` }}>
        {items.map((item, idx) => (
          <MenuItem
            key={item.link}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            canHover={canHover}
            index={item.index ?? String(idx + 1).padStart(2, '0')}
          />
        ))}
      </ul>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  link,
  text,
  image,
  chip,
  meta,
  index,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  canHover
}) => {
  const itemRef = useRef<HTMLLIElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number): 'top' | 'bottom' => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  useEffect(() => {
    if (!canHover) return;
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [text, image, canHover]);

  useEffect(() => {
    if (!canHover) return;
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      animationRef.current?.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
        paused: true
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed, canHover]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canHover || !itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    animationRef.current?.play();

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canHover || !itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults, onComplete: () => animationRef.current?.pause() })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <li
      className="relative overflow-hidden"
      ref={itemRef}
      style={{ borderTop: `1px solid ${borderColor}` }}
    >
      <Link
        className="group relative grid min-h-[4.5rem] grid-cols-[3.5rem_1fr] items-center gap-x-4 py-5 no-underline md:min-h-[6.5rem] md:grid-cols-[6rem_1fr_minmax(0,16rem)] md:py-6"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        <span className="font-mono text-xs tracking-[0.08em] text-signal">{index}</span>
        <span className="display text-[clamp(1.6rem,4.4vw,4rem)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
          {text}
        </span>
        {meta && (
          <span className="col-start-2 mt-2 font-mono text-xs uppercase tracking-[0.08em] opacity-60 md:col-start-3 md:mt-0 md:text-right">
            {meta}
          </span>
        )}
      </Link>
      {canHover && (
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-full translate-y-[101%] overflow-hidden"
          ref={marqueeRef}
          style={{ backgroundColor: marqueeBgColor }}
          aria-hidden="true"
        >
          <div className="flex h-full w-fit" ref={marqueeInnerRef}>
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee-part flex flex-shrink-0 items-center" key={idx} style={{ color: marqueeTextColor }}>
                <span className="display whitespace-nowrap px-[1.5vw] text-[clamp(1.6rem,4.4vw,4rem)]">
                  {text}
                </span>
                {image ? (
                  <div
                    className="mx-[2vw] h-[62%] w-[clamp(120px,13vw,220px)] bg-cover bg-top"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ) : (
                  <span
                    className="mx-[2vw] whitespace-nowrap border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.08em]"
                    style={{ borderColor: marqueeTextColor }}
                  >
                    {chip}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};

export default FlowingMenu;
