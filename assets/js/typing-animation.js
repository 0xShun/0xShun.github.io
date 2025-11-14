/**
 * Typing Animation for Home Page Hero Section
 * Types out Python code character by character at 40 WPM (~200ms per character)
 */

(function() {
  'use strict';

  const codeElement = document.getElementById('typingCode');
  if (!codeElement) return;

  // The code to type out (matches the image)
  const codeText = `class Researcher:
    def __init__(self):
        self.nickname = "Shうn"
        self.research_group = "Excelr8 Labs"
        self.roles = [
            "Data Analyst",
            "Data Engineer",
            "Security Researcher",
            "Software Engineer"
        ]`;

  // Natural human typing speed with variations
  const baseTypingSpeed = 37.5; // Base speed in milliseconds (150 / 4)
  const speedVariation = 25; // Random variation range (100 / 4)
  let currentIndex = 0;
  
  /**
   * Get a natural typing delay with variation
   */
  function getTypingDelay() {
    const char = codeText[currentIndex];
    
    // Longer pause after colons (thinking time)
    if (char === ':') return baseTypingSpeed + 400 + Math.random() * 200;
    
    // Longer pause after commas
    if (char === ',') return baseTypingSpeed + 300 + Math.random() * 150;
    
    // Pause after closing brackets/quotes
    if (char === ']' || char === ')' || char === '"') return baseTypingSpeed + 200 + Math.random() * 100;
    
    // Newlines get a thinking pause
    if (char === '\n') return baseTypingSpeed + 300 + Math.random() * 200;
    
    // Regular characters with natural variation
    return baseTypingSpeed + Math.random() * speedVariation - (speedVariation / 2);
  }

  /**
   * Add syntax highlighting to the typed text
   */
  function highlightSyntax(text) {
    let highlighted = text;
    
    // Order matters! Most specific patterns first to avoid overlaps
    
    // Strings (must come before keywords to avoid highlighting keywords inside strings)
    highlighted = highlighted.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
    
    // Class names with colon
    highlighted = highlighted.replace(/\b(Researcher)(?=:)/g, '<span class="class-name">$1</span>');
    
    // Function names
    highlighted = highlighted.replace(/\b(__init__)(?=\()/g, '<span class="function">$1</span>');
    
    // Properties (avoid matching if already inside a span tag)
    highlighted = highlighted.replace(/\b(nickname|research_group|roles)(?=\s*=)/g, '<span class="property">$1</span>');
    
    // Keywords (class, def, self) - avoid matching if already inside a span tag
    highlighted = highlighted.replace(/\b(class|def|self)(?![^<]*>)/g, '<span class="keyword">$1</span>');
    
    return highlighted;
  }

  /**
   * Type out one character at a time
   */
  function typeCharacter() {
    if (currentIndex < codeText.length) {
      const currentText = codeText.substring(0, currentIndex + 1);
      codeElement.innerHTML = highlightSyntax(currentText) + '<span class="typing-cursor">|</span>';
      currentIndex++;
      setTimeout(typeCharacter, getTypingDelay());
    } else {
      // Typing complete - keep cursor blinking
      codeElement.innerHTML = highlightSyntax(codeText) + '<span class="typing-cursor">|</span>';
    }
  }

  /**
   * Add CSS for cursor animation
   */
  function addCursorStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .typing-cursor {
        animation: blink 0.7s infinite;
        color: var(--accent-primary);
        font-weight: bold;
      }
      
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize typing animation on page load
   */
  function init() {
    addCursorStyle();
    
    // Small delay before starting to make it feel more natural
    setTimeout(() => {
      typeCharacter();
    }, 500);
  }

  // Start animation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
