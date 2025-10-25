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
