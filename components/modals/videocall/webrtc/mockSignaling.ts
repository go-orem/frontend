// Simple in-page loopback P2P mock for demo purposes
// Creates two RTCPeerConnections and connects them locally, returning the remote stream
export async function createLoopbackConnection(localStream: MediaStream) : Promise<MediaStream | null> {
  if (!localStream) return null;
  const pc1 = new RTCPeerConnection();
  const pc2 = new RTCPeerConnection();

  // exchange ICE candidates
  pc1.onicecandidate = (e) => { if (e.candidate) pc2.addIceCandidate(e.candidate).catch(()=>{}); };
  pc2.onicecandidate = (e) => { if (e.candidate) pc1.addIceCandidate(e.candidate).catch(()=>{}); };

  // when pc2 gets track, resolve with its stream
  const remotePromise = new Promise<MediaStream>((resolve) => {
    pc2.ontrack = (e) => {
      resolve(e.streams[0]);
    };
  });

  // add local tracks to pc1
  localStream.getTracks().forEach((t) => pc1.addTrack(t, localStream));

  // create offer from pc1
  const offer = await pc1.createOffer();
  await pc1.setLocalDescription(offer);
  await pc2.setRemoteDescription(offer);

  const answer = await pc2.createAnswer();
  await pc2.setLocalDescription(answer);
  await pc1.setRemoteDescription(answer);

  // return remote stream when available
  const remote = await remotePromise;
  return remote ?? null;
}
