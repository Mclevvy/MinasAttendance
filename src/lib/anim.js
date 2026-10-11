// Shared animation helper: honor the OS reduce-motion setting (kids' devices vary).
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    try {
      AccessibilityInfo.isReduceMotionEnabled?.()?.then?.(setReduce).catch(() => {});
    } catch {}
  }, []);
  return reduce;
}
