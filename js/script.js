const toggleButton = document.getElementById('theme-toggle');
const STORAGE_KEY = 'site-theme';

if (toggleButton) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    toggleButton.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
    });
}

function applyTheme(theme) {
    const enableDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', enableDark);
    toggleButton?.setAttribute('aria-pressed', enableDark.toString());
}

// Real-time Clock Functionality with Typing and Erasing Effect
let typingInterval;
let currentDisplayText = '';
let targetText = '';
let typingIndex = 0;
let isTyping = false;
let isErasing = false;

function getCurrentTimeString() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}?`;
}

function typeCharacter() {
    const clockElement = document.getElementById('current-time');
    if (!clockElement) return;

    if (!isErasing) {
        // Typing forward
        if (typingIndex < targetText.length) {
            currentDisplayText = targetText.substring(0, typingIndex + 1);
            clockElement.textContent = currentDisplayText;
            typingIndex++;
        } else {
            // Typing complete, wait then start erasing
            clearInterval(typingInterval);
            setTimeout(() => {
                isErasing = true;
                typingInterval = setInterval(typeCharacter, 100); // Faster erasing
            }, 2000); // Wait 2 seconds before erasing
        }
    } else {
        // Erasing backward
        if (currentDisplayText.length > 0) {
            currentDisplayText = currentDisplayText.substring(0, currentDisplayText.length - 1);
            clockElement.textContent = currentDisplayText;
        } else {
            // Erasing complete, start typing again
            clearInterval(typingInterval);
            isErasing = false;
            isTyping = false;
            typingIndex = 0;
            
            // Wait a moment then start typing again
            setTimeout(startTypingEffect, 500);
        }
    }
}

function startTypingEffect() {
    if (isTyping) return;
    
    const clockElement = document.getElementById('current-time');
    if (!clockElement) return;

    isTyping = true;
    isErasing = false;
    targetText = getCurrentTimeString();
    currentDisplayText = '';
    typingIndex = 0;
    
    // Clear current text
    clockElement.textContent = '';
    
    // Start typing character by character
    typingInterval = setInterval(typeCharacter, 150); // 150ms between characters when typing
}

function updateClock() {
    // Update target text every second, but only if not currently typing/erasing
    const newTargetText = getCurrentTimeString();
    if (!isTyping && !isErasing && newTargetText !== targetText) {
        targetText = newTargetText;
        startTypingEffect();
    }
}

// Initialize clock when page loads
document.addEventListener('DOMContentLoaded', function() {
    startTypingEffect(); // Start initial typing effect
    setInterval(updateClock, 1000); // Check for updates every second
});
