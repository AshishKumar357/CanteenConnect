import { useWindowDimensions } from 'react-native';

// Base width chosen as an iPhone 8 width for scaling references
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const rawScale = width / BASE_WIDTH;
  const rawVScale = height / BASE_HEIGHT;
  // Prevent runaway scaling on very large screens (web). Clamp between reasonable bounds.
  const MIN_SCALE = 0.8;
  const MAX_SCALE = 1.25;
  const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));
  const verticalScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawVScale));

  function rs(size) {
    return Math.round(size * scale);
  }

  function rsv(size) {
    return Math.round(size * verticalScale);
  }

  function wp(percent) {
    return Math.round((width * percent) / 100);
  }

  function hp(percent) {
    return Math.round((height * percent) / 100);
  }

  return { width, height, scale, verticalScale, rs, rsv, wp, hp };
}

export default useResponsive;
