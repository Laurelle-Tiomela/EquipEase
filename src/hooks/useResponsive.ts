import { useState, useEffect } from "react";

interface BreakpointOptions {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
}

const defaultBreakpoints: Required<BreakpointOptions> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const useResponsive = (customBreakpoints?: BreakpointOptions) => {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < breakpoints.md;
  const isTablet =
    windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;

  const breakpoint =
    windowSize.width >= breakpoints["2xl"]
      ? "2xl"
      : windowSize.width >= breakpoints.xl
        ? "xl"
        : windowSize.width >= breakpoints.lg
          ? "lg"
          : windowSize.width >= breakpoints.md
            ? "md"
            : "sm";

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    isBreakpoint: (bp: keyof BreakpointOptions) =>
      windowSize.width >= breakpoints[bp]!,
  };
};

// Touch gestures hook for mobile
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const getSwipeDirection = () => {
    if (!touchStart || !touchEnd) return null;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        return deltaX > 0 ? "left" : "right";
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        return deltaY > 0 ? "up" : "down";
      }
    }

    return null;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    getSwipeDirection,
    touchStart,
    touchEnd,
  };
};

// Device detection hook
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    platform: "",
    browser: "",
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      );
    const isTablet = /iPad|Android(?=.*Mobile)|Tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    let platform = "Unknown";
    if (/Mac/i.test(userAgent)) platform = "macOS";
    else if (/Win/i.test(userAgent)) platform = "Windows";
    else if (/Linux/i.test(userAgent)) platform = "Linux";
    else if (/Android/i.test(userAgent)) platform = "Android";
    else if (/iPhone|iPad/i.test(userAgent)) platform = "iOS";

    let browser = "Unknown";
    if (/Chrome/i.test(userAgent)) browser = "Chrome";
    else if (/Firefox/i.test(userAgent)) browser = "Firefox";
    else if (/Safari/i.test(userAgent)) browser = "Safari";
    else if (/Edge/i.test(userAgent)) browser = "Edge";

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isTouchDevice,
      platform,
      browser,
    });
  }, []);

  return deviceInfo;
};

// Orientation change hook
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape",
      );
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return orientation;
};
