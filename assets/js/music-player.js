/**
 * Background Music Player for Home Page
 * Plays royalty-free techno/electronic music with play/pause control
 */

(function() {
  'use strict';

  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  if (!isHomePage) return;

  // Playlist of royalty-free techno/electronic tracks
  // Using actual working URLs from free music sources
  const playlist = [
    {
      title: "Tech House Beat",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      title: "Electronic Dreams",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      title: "Digital Waves",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
      title: "Cyber Pulse",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
      title: "Neon Circuit",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
      title: "Synth Wave",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    {
      title: "Tech Noir",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
    },
    {
      title: "Future Bass",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    },
    {
      title: "Digital Grid",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
    },
    {
      title: "Cyber Runner",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    }
  ];

  let currentTrackIndex = 0;
  let audio = null;
  let isPlaying = false;
  let playButton = null;

  /**
   * Initialize audio player
   */
  function initAudio() {
    audio = new Audio();
    audio.volume = 0.7; // Start at 70%
    audio.preload = 'auto';
    
    // When track ends, play next track
    audio.addEventListener('ended', playNextTrack);
    
    // Load first track
    loadTrack(currentTrackIndex);
  }

  /**
   * Load a track from the playlist
   */
  function loadTrack(index) {
    if (audio && playlist[index]) {
      audio.src = playlist[index].url;
      audio.load(); // Explicitly load the audio
      console.log(`📀 Loading track ${index + 1}/${playlist.length}: ${playlist[index].title}`);
    }
  }

  /**
   * Play current track
   */
  function play() {
    if (audio) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isPlaying = true;
          updateButton();
          console.log('✓ Music playing:', playlist[currentTrackIndex].title);
        }).catch(err => {
          console.error('✗ Error playing audio:', err);
          // Browser might block autoplay, show a message
          if (err.name === 'NotAllowedError') {
            console.log('⚠ Autoplay blocked. Click play button to start music.');
            isPlaying = false;
            updateButton();
          }
        });
      }
    }
  }

  /**
   * Pause current track
   */
  function pause() {
    if (audio) {
      audio.pause();
      isPlaying = false;
      updateButton();
      console.log('Music paused');
    }
  }

  /**
   * Play next track in playlist
   */
  function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
      play();
    }
  }

  /**
   * Toggle play/pause
   */
  function togglePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  /**
   * Update button icon based on play state
   */
  function updateButton() {
    if (!playButton) return;

    const icon = playButton.querySelector('svg');
    if (!icon) return;

    if (isPlaying) {
      // Show pause icon
      icon.innerHTML = `
        <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
        <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
      `;
      playButton.setAttribute('aria-label', 'Pause music');
    } else {
      // Show play icon
      icon.innerHTML = `
        <path d="M8 5v14l11-7z" fill="currentColor"/>
      `;
      playButton.setAttribute('aria-label', 'Play music');
    }
  }

  /**
   * Create play/pause button
   */
  function createButton() {
    const navbarActions = document.querySelector('.navbar-actions');
    if (!navbarActions) return;

    playButton = document.createElement('button');
    playButton.className = 'music-toggle-btn';
    playButton.setAttribute('aria-label', 'Play music');
    playButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 5v14l11-7z" fill="currentColor"/>
      </svg>
    `;

    // Add click event
    playButton.addEventListener('click', togglePlayPause);

    // Insert before search button (first child)
    navbarActions.insertBefore(playButton, navbarActions.firstChild);
  }

  /**
   * Add CSS for music button
   */
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .music-toggle-btn {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        padding: 0.6rem;
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        min-width: 44px;
        min-height: 44px;
      }

      .music-toggle-btn:hover {
        color: var(--accent-primary);
        background: var(--accent-bg);
        transform: scale(1.05);
      }

      .music-toggle-btn svg {
        transition: transform 0.3s ease;
      }

      .music-toggle-btn:hover svg {
        transform: scale(1.1);
      }

      .music-toggle-btn:active {
        transform: scale(0.95);
      }

      @media (max-width: 768px) {
        .music-toggle-btn {
          padding: 0.5rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize music player
   */
  function init() {
    console.log('🎵 Initializing music player on home page...');
    addStyles();
    createButton();
    initAudio();
    
    // Try to auto-play on page load
    // Note: Most browsers block autoplay until user interacts with the page
    setTimeout(() => {
      console.log('🎵 Attempting to auto-play...');
      play();
    }, 1000); // Small delay to ensure page is loaded
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
