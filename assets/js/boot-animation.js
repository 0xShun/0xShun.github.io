/**
 * Linux-style Boot Animation with Auto-Scroll and Auto-Transition
 * Simulates a realistic system boot sequence
 */

(function() {
  'use strict';

  const bootSequence = [
    { text: '0xShun Portfolio - Boot Loader v2.1.0', delay: 100 },
    { text: 'Copyright (C) 2024-2026 0xShun. All rights reserved.', delay: 200 },
    { text: '', delay: 50 },
    { text: 'Initializing system...', delay: 300 },
    { text: '[    0.001234] Linux version 6.8.0-generic (security@kernel.org)', delay: 150 },
    { text: '[    0.002145] BIOS-provided physical RAM map:', delay: 150 },
    { text: '[    0.002456] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable', delay: 120 },
    { text: '[    0.003567] Memory: 16384M available (20480K kernel code, 4096K rwdata)', delay: 150 },
    { text: '[    0.004234] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=8, Nodes=2', delay: 120 },
    { text: '', delay: 50 },
    { text: 'Loading kernel modules...', delay: 300 },
    { text: '[    0.125643] Loading kernel modules: [=====     ] 50%', delay: 200 },
    { text: '[    0.256234] Loading kernel modules: [========  ] 90%', delay: 200 },
    { text: '[    0.384521] Loading kernel modules: [==========] 100%', delay: 200 },
    { text: '', delay: 50 },
    { text: 'Mounting filesystems...', delay: 300 },
    { text: '[    0.512345] VFS: Mounted root (ext4 filesystem) readonly on device 8:1.', delay: 150 },
    { text: '[    0.523456] devtmpfs: mounted', delay: 150 },
    { text: '[    0.534567] Freeing initrd memory: 128M', delay: 150 },
    { text: '', delay: 50 },
    { text: 'Starting essential services...', delay: 300 },
    { text: '[    0.645234] systemd[1]: systemd 254.8-1 running in system mode', delay: 150 },
    { text: '[    0.656345] systemd[1]: Detected architecture x86-64', delay: 150 },
    { text: '[    1.234567] Starting Network Manager...', delay: 150 },
    { text: '[    1.345678] system-getty@tty1.service started', delay: 150 },
    { text: '', delay: 50 },
    { text: 'Initializing security services...', delay: 300 },
    { text: '[    1.456789] SELinux: initialized (dev tmpfs, type tmpfs), uses transition SIDs', delay: 150 },
    { text: '[    1.567890] audit: type=1400 audit(1719388800.123:1): apparmor="STATUS"', delay: 150 },
    { text: '', delay: 50 },
    { text: 'Loading portfolio data...', delay: 300 },
    { text: '[    2.123456] Loading researcher profile...', delay: 150 },
    { text: '[    2.234567] Loading project database...', delay: 150 },
    { text: '[    2.345678] Loading blog posts (42 entries)...', delay: 150 },
    { text: '[    2.456789] Loading research papers...', delay: 150 },
    { text: '', delay: 50 },
    { text: 'Initializing web server...', delay: 300 },
    { text: '[    2.567890] jekyll-server started on port 4000', delay: 150 },
    { text: '[    2.678901] Listening on all interfaces...', delay: 150 },
    { text: '', delay: 50 },
    { text: 'System initialization complete!', delay: 300 },
    { text: 'Welcome to 0xShun Portfolio', delay: 300 },
    { text: '', delay: 500 },
  ];

  let currentIndex = 0;
  const bootOutput = document.getElementById('boot-output');
  const bootContainer = document.getElementById('boot-terminal-container');

  function addBootLine(text) {
    const line = document.createElement('div');
    line.className = 'boot-line';
    line.textContent = text;
    bootOutput.appendChild(line);

    // Auto-scroll to bottom
    bootOutput.scrollTop = bootOutput.scrollHeight;
  }

  function processNextLine() {
    if (currentIndex >= bootSequence.length) {
      // Boot sequence complete - transition to home page
      setTimeout(transitionToHome, 1000);
      return;
    }

    const { text, delay } = bootSequence[currentIndex];
    addBootLine(text);
    currentIndex++;

    // Schedule next line with the specified delay
    setTimeout(processNextLine, delay);
  }

  function transitionToHome() {
    // Fade out the boot terminal
    bootContainer.classList.add('hidden');

    // Small delay before showing home page content
    setTimeout(() => {
      // Remove the boot container from DOM to allow full interaction
      bootContainer.style.display = 'none';
      // Scroll page to top
      window.scrollTo(0, 0);
    }, 800);
  }

  // Start boot animation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processNextLine);
  } else {
    processNextLine();
  }

  // Optional: Allow user to skip boot animation with Enter key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && currentIndex < bootSequence.length) {
      // Fast-forward to the end
      while (currentIndex < bootSequence.length) {
        const { text } = bootSequence[currentIndex];
        addBootLine(text);
        currentIndex++;
      }
      // Transition immediately
      setTimeout(transitionToHome, 500);
    }
  });

})();
