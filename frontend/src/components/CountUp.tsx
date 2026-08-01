'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { formatCurrency } from '@/lib/format';

export default function CountUp({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => formatCurrency(Math.round(v)));
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: 'easeOut' });
    return controls.stop;
  }, [value, motionValue]);

  useEffect(() => rounded.on('change', (v) => {
    if (spanRef.current) spanRef.current.textContent = v;
  }), [rounded]);

  return <span ref={spanRef}>{formatCurrency(0)}</span>;
}
