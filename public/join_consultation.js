document.addEventListener('DOMContentLoaded', async function () {
  let isAudioMuted = false;
  let isVideoOff = false;
  let localStream, remoteStream;
  let peerConnection;
  const socket = io(); // make sure socket.io is loaded
  const appointmentType = document.body.dataset.appointmentType;
  const appointmentId = document.body.dataset.appointmentId;
  const userId = document.body.dataset.userId;

  const localVideo = document.getElementById('localVideo') || document.getElementById('myVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  const micButton = document.getElementById('micButton');
  const videoButton = document.getElementById('videoButton');
  const endButton = document.getElementById('endButton');
  const waitingScreen = document.getElementById('waitingScreen');

  let startTime = new Date();
  setInterval(updateTimer, 1000);

  function updateTimer() {
    const now = new Date();
    const diff = new Date(now - startTime);
    const timer = document.getElementById('consultationTimer');
    if (timer) {
      const h = diff.getUTCHours().toString().padStart(2, '0');
      const m = diff.getUTCMinutes().toString().padStart(2, '0');
      const s = diff.getUTCSeconds().toString().padStart(2, '0');
      timer.textContent = `${h}:${m}:${s}`;
    }
  }

  // Start camera/mic and WebRTC connection
  async function startConsultation() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = localStream;

      socket.emit('join-room', { appointmentId, userId });

      socket.on('user-joined', () => {
        createPeerConnection();
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
        peerConnection.createOffer().then(offer => {
          peerConnection.setLocalDescription(offer);
          socket.emit('offer', { appointmentId, offer });
        });
      });

      socket.on('offer', async ({ offer }) => {
        createPeerConnection();
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', { appointmentId, answer });
      });

      socket.on('answer', async ({ answer }) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      });

    } catch (err) {
      alert('Please allow camera and microphone access.');
      console.error(err);
    }
  }

  function createPeerConnection() {
    if (peerConnection) return;
    peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', { appointmentId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = event => {
      if (!remoteStream) {
        remoteStream = new MediaStream();
        remoteVideo.srcObject = remoteStream;
      }
      remoteStream.addTrack(event.track);
    };
  }

  if (appointmentType === 'video' || appointmentType === 'audio') {
    setTimeout(() => {
      if (waitingScreen) waitingScreen.style.display = 'none';
      remoteVideo.style.display = 'block';
      startConsultation();
    }, 3000);
  }

  if (micButton) {
    micButton.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      localStream.getAudioTracks()[0].enabled = !isAudioMuted;
      micButton.classList.toggle('off');
      micButton.querySelector('i').className = isAudioMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone';
    });
  }

  if (videoButton) {
    videoButton.addEventListener('click', () => {
      isVideoOff = !isVideoOff;
      localStream.getVideoTracks()[0].enabled = !isVideoOff;
      videoButton.classList.toggle('off');
      videoButton.querySelector('i').className = isVideoOff ? 'fas fa-video-slash' : 'fas fa-video';
      if (localVideo) localVideo.style.display = isVideoOff ? 'none' : 'block';
    });
  }

  if (endButton) {
    endButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to end this consultation?')) {
        fetch(`/doctor-consultation/end/${appointmentId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .then(data => {
            if (data.status === 'success') {
              window.location.href = '/doctor-consultation';
            } else {
              alert('Failed to end consultation.');
            }
          });
      }
    });
  }
});
