'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate } from 'framer-motion';
import { useCurrency } from '@/lib/currency-context';

export default function CountUp({ value }: { value: number }) {
  const { format, currency } = useCurrency();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => format(v));
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.8, ease: 'easeOut' });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, motionValue, currency]);

  useEffect(() => rounded.on('change', (v) => {
    if (spanRef.current) spanRef.current.textContent = v;
  }), [rounded]);

  return <span ref={spanRef}>{format(0)}</span>;
}
