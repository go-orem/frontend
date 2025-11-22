// components/webrtc/utils/segmentation.ts
// Optional helpers to lazy load mediapipe and init segmentation.
// Left as example — provider already contains a simple integration.
export async function loadSelfieSegmentation() {
  const mod = await import("@mediapipe/selfie_segmentation");
  return mod.SelfieSegmentation;
}
