// Global ambient module declarations to silence missing type packages
declare module 'socket.io-client';
declare module '@mediapipe/selfie_segmentation';

// widen some DOM/RTC types if needed
declare interface Window {
  webkitRTCPeerConnection?: typeof RTCPeerConnection;
}
