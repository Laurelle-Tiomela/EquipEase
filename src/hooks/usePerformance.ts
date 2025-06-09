import { useEffect, useState, useCallback } from "react";

// Performance monitoring hook
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now();
    setMetrics((prev) => ({ ...prev, loadTime }));

    // Monitor memory usage (if supported)
    if ("memory" in performance) {
      const memoryInfo = (performance as any).memory;
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
      }));
    }

    // Set up performance observer for render times
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "measure") {
            setMetrics((prev) => ({
              ...prev,
              renderTime: Math.round(entry.duration),
            }));
          }
        });
      });

      observer.observe({ entryTypes: ["measure"] });

      return () => observer.disconnect();
    }
  }, []);

  const measureRender = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();

    if ("performance" in window && "mark" in performance) {
      performance.mark(`${name}-start`);
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    return end - start;
  }, []);

  return { metrics, measureRender };
};

// Lazy loading hook for components
export const useLazyLoad = <T>(
  loader: () => Promise<{ default: T }>,
  deps: any[] = [],
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loader()
      .then((module) => {
        setComponent(module.default);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { Component, loading, error };
};

// Image optimization hook
export const useImageOptimization = () => {
  const optimizeImage = useCallback(
    (
      src: string,
      options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: "webp" | "jpeg" | "png";
      } = {},
    ) => {
      const { width, height, quality = 80, format = "webp" } = options;

      // For production, you'd integrate with a service like Cloudinary or ImageKit
      // For now, we'll use Unsplash's URL parameters
      if (src.includes("unsplash.com")) {
        let optimizedUrl = src;

        if (width || height) {
          const params = new URLSearchParams();
          if (width) params.set("w", width.toString());
          if (height) params.set("h", height.toString());
          if (quality < 100) params.set("q", quality.toString());

          optimizedUrl = `${src}?${params.toString()}`;
        }

        return optimizedUrl;
      }

      return src;
    },
    [],
  );

  return { optimizeImage };
};

// Debounce hook for performance optimization
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
) => {
  const [throttling, setThrottling] = useState(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!throttling) {
        callback(...args);
        setThrottling(true);
        setTimeout(() => setThrottling(false), delay);
      }
    },
    [callback, delay, throttling],
  );

  return throttledCallback;
};
