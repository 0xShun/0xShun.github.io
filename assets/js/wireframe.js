/**
 * 3D Wireframe Cube Animation
 * Inspired by BuckeyeCTF 2025
 * Dynamically uses accent color from CSS variables
 * Optimized for mobile devices
 */

(function() {
  const canvas = document.getElementById('wireframe-canvas');
  if (!canvas) return;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  // Detect mobile device and reduce complexity
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const ctx = canvas.getContext('2d');
  let width, height;
  const cubes = [];
  const numCubes = isMobile ? 4 : 8; // Reduce cubes on mobile

  // Get current accent color from CSS variable
  function getAccentColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-primary').trim() || '#4553ef';
  }

  // Resize canvas to fill window
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // 3D Point class
  class Point3D {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    project(viewDistance = 500) {
      const scale = viewDistance / (viewDistance + this.z);
      return {
        x: this.x * scale + width / 2,
        y: this.y * scale + height / 2,
        scale: scale
      };
    }

    rotateX(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = this.y * cos - this.z * sin;
      const z = this.y * sin + this.z * cos;
      this.y = y;
      this.z = z;
    }

    rotateY(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = this.x * cos + this.z * sin;
      const z = -this.x * sin + this.z * cos;
      this.x = x;
      this.z = z;
    }

    rotateZ(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = this.x * cos - this.y * sin;
      const y = this.x * sin + this.y * cos;
      this.x = x;
      this.y = y;
    }
  }

  // Cube class
  class Cube {
    constructor(size, x, y, z) {
      this.size = size;
      this.x = x;
      this.y = y;
      this.z = z;
      this.rotationX = Math.random() * 0.02 - 0.01;
      this.rotationY = Math.random() * 0.02 - 0.01;
      this.rotationZ = Math.random() * 0.02 - 0.01;
      this.driftX = Math.random() * 0.5 - 0.25;
      this.driftY = Math.random() * 0.5 - 0.25;
      this.driftZ = Math.random() * 0.5 - 0.25;
      this.opacity = 0.3 + Math.random() * 0.4;
      
      this.vertices = this.createVertices();
    }

    createVertices() {
      const s = this.size / 2;
      return [
        new Point3D(-s, -s, -s),
        new Point3D(s, -s, -s),
        new Point3D(s, s, -s),
        new Point3D(-s, s, -s),
        new Point3D(-s, -s, s),
        new Point3D(s, -s, s),
        new Point3D(s, s, s),
        new Point3D(-s, s, s)
      ];
    }

    update() {
      // Rotate
      this.vertices.forEach(v => {
        v.rotateX(this.rotationX);
        v.rotateY(this.rotationY);
        v.rotateZ(this.rotationZ);
      });

      // Drift
      this.x += this.driftX;
      this.y += this.driftY;
      this.z += this.driftZ;

      // Wrap around screen
      if (this.x < -width / 2 - 200) this.x = width / 2 + 200;
      if (this.x > width / 2 + 200) this.x = -width / 2 - 200;
      if (this.y < -height / 2 - 200) this.y = height / 2 + 200;
      if (this.y > height / 2 + 200) this.y = -height / 2 - 200;
      if (this.z < -500) this.z = 500;
      if (this.z > 500) this.z = -500;
    }

    draw() {
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Front face
        [4, 5], [5, 6], [6, 7], [7, 4], // Back face
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
      ];

      ctx.save();
      ctx.strokeStyle = getAccentColor(); // Dynamically get color
      ctx.lineWidth = 1.5;

      edges.forEach(([start, end]) => {
        const p1 = this.vertices[start].project();
        const p2 = this.vertices[end].project();

        // Apply position offset
        p1.x += this.x;
        p1.y += this.y;
        p2.x += this.x;
        p2.y += this.y;

        // Calculate opacity based on depth
        const avgScale = (p1.scale + p2.scale) / 2;
        const alpha = this.opacity * avgScale;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      ctx.restore();
    }
  }

  // Initialize cubes
  function init() {
    cubes.length = 0;
    
    for (let i = 0; i < numCubes; i++) {
      const size = 80 + Math.random() * 120;
      const x = Math.random() * width - width / 2;
      const y = Math.random() * height - height / 2;
      const z = Math.random() * 1000 - 500;
      
      cubes.push(new Cube(size, x, y, z));
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    cubes.forEach(cube => {
      cube.update();
      cube.draw();
    });

    requestAnimationFrame(animate);
  }

  // Initialize and start
  resize();
  init();
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    resize();
    init();
  });
})();
