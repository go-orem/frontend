// components/webrtc/hooks/useMediaDevices.tsx
"use client";
import { useEffect, useState } from "react";

export function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        setDevices(list);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDevices();
  }, []);

  return { devices };
}
