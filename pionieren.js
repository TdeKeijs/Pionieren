document.addEventListener("DOMContentLoaded", function() {

  const sceneEl = document.querySelector('a-scene');
  const skyFoto = document.getElementById("sky-foto");
  const backgroundAudio = document.getElementById("audio-achtergrond");
  const startButton = document.getElementById("start-button");

  // Start button functionality - was still in progress
  // The button was added to have the user start the background sound (because chrome does not allow autoplay audio), but background audio isn't working properly yet
  startButton.addEventListener("click", function () {
    try {
      backgroundAudio.loop = true;
      backgroundAudio.play();
      startButton.parentNode.removeChild(startButton);
    } catch (error) {
      console.error("Failed to start background audio:", error);
    }
  });

  //make the rooms and position the buttons
  const roomConfig = {
    "huisje": [
      { id: "gang-arrow-huisje", position:"8 5 1.5", rotation:"-90 -60 0"}, 
      { id: "plus-info-huisje1", position: "0.3 2.4 -1.5", rotation: "0 -34 0", audioSrc: "#audio-kaart", visible: "true" },
      { id: "video-huisje2", position: "-2.5 2.2 0.7", rotation: "0 125 0", scale: "3.1 3 1", videoSrc: "#anne", visible: "true" },
    ],
    "gang": [
      { id: "huisje-arrow-gang", position:"-1.6 -4.3 -3", rotation:"-90 45 0"}
    ]
  };

  function createArrows() {
    Object.entries(roomConfig).forEach(([room, items]) => {
      items.forEach(itemConfig => {
        if (!document.getElementById(itemConfig.id)) {
          let element = document.createElement('a-entity');
          element.setAttribute('id', itemConfig.id);
          element.setAttribute('position', itemConfig.position);
          element.setAttribute('rotation', itemConfig.rotation);
          element.setAttribute('class', 'interactable');
          
          if (itemConfig.id.includes("arrow")) {
            element.setAttribute('mixin', 'nav-mixin');
            setupArrowInteractions(element, itemConfig.id.split('-')[0]);
          } else if (itemConfig.id.includes("plus")) {
            element.setAttribute('mixin', 'plus-mixin');
            setupPlusInteractions(element, itemConfig.audioSrc);
          } else if (itemConfig.id.includes("video")) {
            element.setAttribute('mixin', 'video-mixin');
            setupVideoInteractions(element, itemConfig.videoSrc);
          }
          sceneEl.appendChild(element);
        }
      });
    });
  }

  function setupPlusInteractions(plusElement, audioSrc) {
    plusElement.addEventListener('click', function () {
      playPlusAudio(audioSrc);
    });
  }

    function playPlusAudio(audioSrc) {
    const audio = document.querySelector(audioSrc);
    audio.loop = false; 
    audio.currentTime = 0; // Reset audio to start from the beginning each time, maybe change to play-pause?
    backgroundAudio.pause(); 
    audio.play();
    
    // Resume background audio when 'plus' audio ends (not working yet)
    audio.onended = () => {
      backgroundAudio.play();
    };
  }

  function setupVideoInteractions(videoElement, videoSrc) {
    videoElement.addEventListener('click', function () {
      playVideo(videoSrc);
    });
  }

  function playVideo(videoSrc) {
    const videoEl = document.createElement('a-video');
    videoEl.setAttribute('src', videoSrc);
    videoEl.setAttribute('position', '-6.6 2.9 4.5');
    videoEl.setAttribute('width', '4');
    videoEl.setAttribute('height', '2');
    videoEl.setAttribute('rotation', '0 83 0');
    videoEl.setAttribute('scale', '1.7 4.8 1');
    videoEl.setAttribute('loop', 'false'); 
    sceneEl.appendChild(videoEl);

    const video = document.querySelector(videoSrc);
    video.loop = false;
    video.currentTime = 0; // Reset video to start from the beginning each time, can be changed to play-pause controls maybe
    video.play();

    // Remove video from scene when it ends so that new click = new play, also tried to resume background audio (not working yet)
    video.onended = () => {
      backgroundAudio.play();
      sceneEl.removeChild(videoEl);
    };
  }

  function setupArrowInteractions(arrow, roomId) {
    arrow.addEventListener('click', function () {
      navigateToRoom(roomId);
    });
  }

  function navigateToRoom(roomId) {
    skyFoto.setAttribute("src", `#${roomId}`);
    updateArrowsForRoom(roomId);
  }

  function updateArrowsForRoom(currentRoom) {
    currentArrows.forEach(arrowId => {
      const arrow = document.getElementById(arrowId);
      if (arrow) {
        arrow.setAttribute('visible', 'false');
      }
    });
    currentArrows = [];

    const arrowsConfig = roomConfig[currentRoom];
    if (arrowsConfig) {
      arrowsConfig.forEach(arrowConfig => {
        const arrow = document.getElementById(arrowConfig.id);
        if (arrow) {
          arrow.setAttribute('visible', 'true');
          currentArrows.push(arrowConfig.id);
        }
      });
    }
  }

  let currentArrows = [];
  createArrows();
  updateArrowsForRoom('gang');
});
