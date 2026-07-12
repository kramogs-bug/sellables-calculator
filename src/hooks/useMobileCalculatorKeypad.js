import { useEffect, useState } from 'react';

const MOBILE_KEYPAD_QUERY = '(max-width: 1023px) and (pointer: coarse)';

export default function useMobileCalculatorKeypad() {
  const [enabled, setEnabled] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia?.(MOBILE_KEYPAD_QUERY).matches
  ));

  useEffect(() => {
    const media = window.matchMedia?.(MOBILE_KEYPAD_QUERY);
    if (!media) return undefined;
    const update = (event) => setEnabled(event.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return enabled;
}
