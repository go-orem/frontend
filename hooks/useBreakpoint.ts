"use client";

import { useEffect, useState } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
type DeviceType = "mobile" | "tablet" | "desktop";
type Orientation = "portrait" | "landscape";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("base");

  useEffect(() => {
    const getBreakpoint = (width: number): Breakpoint => {
      if (width < breakpoints.sm) return "base";
      if (width < breakpoints.md) return "sm";
      if (width < breakpoints.lg) return "md";
      if (width < breakpoints.xl) return "lg";
      if (width < breakpoints["2xl"]) return "xl";
      return "2xl";
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

export function useDeviceType(): DeviceType {
  const breakpoint = useBreakpoint();

  if (breakpoint === "base" || breakpoint === "sm") return "mobile";
  if (breakpoint === "md") return "tablet";
  return "desktop";
}

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      );
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  return orientation;
}

export function useIsMobile() {
  return useDeviceType() === "mobile";
}

export function useIsTablet() {
  return useDeviceType() === "tablet";
}

export function useIsDesktop() {
  return useDeviceType() === "desktop";
}
