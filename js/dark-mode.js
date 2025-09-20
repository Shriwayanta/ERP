// =======================
// GENTLE DARK MODE SYSTEM - MINIMAL FIXES ONLY
// =======================

// Initialize dark mode system
document.addEventListener('DOMContentLoaded', function() {
    createToggleButton();
    injectCSS();
    initializeDarkMode();
    setupEventListeners();
});

// Create the dark mode toggle button
function createToggleButton() {
    if (document.querySelector('.dark-mode-toggle')) return;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'dark-mode-toggle';
    toggleButton.innerHTML = '<span id="darkModeIcon">🌙</span>';
    toggleButton.title = 'Toggle Dark Mode';
    toggleButton.onclick = toggleDarkMode;

    document.body.appendChild(toggleButton);
}

// Inject minimal CSS - only essential fixes
function injectCSS() {
    const existingStyles = document.querySelector('#dark-mode-styles');
    if (existingStyles) return;

    const style = document.createElement('style');
    style.id = 'dark-mode-styles';
    style.textContent = `
        :root {
            --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --card-bg: rgba(255, 255, 255, 0.95);
            --text-primary: #2d3748;
            --text-secondary: #4a5568;
            --text-muted: #718096;
            --border-color: #e2e8f0;
            --button-bg: rgba(255, 255, 255, 0.95);
            --button-text: #667eea;
            --shadow: rgba(0,0,0,0.1);
            --shadow-hover: rgba(0,0,0,0.2);
            --input-bg: #ffffff;
            --navbar-bg: rgba(255, 255, 255, 0.95);
            --table-bg: #ffffff;
            --table-stripe: #f8fafc;
            --accent-primary: #667eea;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --error-color: #ef4444;
        }

        [data-theme="dark"] {
            --bg-gradient: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            --card-bg: rgba(44, 62, 80, 0.95);
            --text-primary: #ecf0f1;
            --text-secondary: #bdc3c7;
            --text-muted: #95a5a6;
            --border-color: rgba(52, 73, 94, 0.5);
            --button-bg: rgba(52, 73, 94, 0.9);
            --button-text: #3498db;
            --shadow: rgba(0,0,0,0.6);
            --shadow-hover: rgba(0,0,0,0.8);
            --input-bg: rgba(44, 62, 80, 0.8);
            --navbar-bg: rgba(44, 62, 80, 0.95);
            --table-bg: rgba(44, 62, 80, 0.9);
            --table-stripe: rgba(52, 73, 94, 0.3);
            --accent-primary: #3498db;
            --success-color: #27ae60;
            --warning-color: #f39c12;
            --error-color: #e74c3c;
        }

        .dark-mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--button-bg);
            color: var(--button-text);
            padding: 12px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            font-size: 20px;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 9999;
            box-shadow: 0 4px 15px var(--shadow);
            backdrop-filter: blur(10px);
        }

        .dark-mode-toggle:hover {
            background: var(--accent-primary);
            color: white;
            transform: translateY(-2px) rotate(180deg);
            box-shadow: 0 6px 20px var(--shadow-hover);
        }

        /* Universal styling - minimal impact */
        body {
            background: var(--bg-gradient);
            transition: all 0.3s ease;
            min-height: 100vh;
        }

        /* Only target specific problem areas */
        
        /* Main title fix - ONLY this specific issue */
        [data-theme="light"] h1 {
            color: #1a202c;
        }
        
        [data-theme="dark"] h1 {
            color: #ffffff;
        }

        /* System overview title */
        [data-theme="light"] h2 {
            color: #2d3748;
        }
        
        [data-theme="dark"] h2 {
            color: #ffffff;
        }

        /* Dashboard module cards - fix text visibility */
        [data-theme="dark"] .card,
        [data-theme="dark"] .dashboard-card,
        [data-theme="dark"] .module-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            color: #ffffff;
        }

        /* Force white text on dashboard card content */
        [data-theme="dark"] .card h3,
        [data-theme="dark"] .dashboard-card h3,
        [data-theme="dark"] .module-card h3 {
            color: #ffffff !important;
        }

        [data-theme="dark"] .card p,
        [data-theme="dark"] .dashboard-card p,
        [data-theme="dark"] .module-card p {
            color: #e2e8f0 !important;
        }

        [data-theme="dark"] .card .stats,
        [data-theme="dark"] .dashboard-card .stats,
        [data-theme="dark"] .module-card .stats {
            color: #ffffff !important;
        }

        /* Dashboard numbers and labels */
        [data-theme="dark"] .card .stat-number,
        [data-theme="dark"] .card .stat-value,
        [data-theme="dark"] .card .number,
        [data-theme="dark"] .dashboard-card .stat-number,
        [data-theme="dark"] .dashboard-card .stat-value,
        [data-theme="dark"] .dashboard-card .number,
        [data-theme="dark"] .module-card .stat-number,
        [data-theme="dark"] .module-card .stat-value,
        [data-theme="dark"] .module-card .number {
            color: #ffffff !important;
        }

        [data-theme="dark"] .card .stat-label,
        [data-theme="dark"] .dashboard-card .stat-label,
        [data-theme="dark"] .module-card .stat-label {
            color: #cbd5e1 !important;
        }

        /* Dashboard card content divs */
        [data-theme="dark"] .card > div,
        [data-theme="dark"] .dashboard-card > div,
        [data-theme="dark"] .module-card > div {
            color: #ffffff !important;
        }

        /* Buttons inside cards */
        [data-theme="dark"] .card .btn,
        [data-theme="dark"] .dashboard-card .btn,
        [data-theme="dark"] .module-card .btn {
            color: #ffffff !important;
        }

        /* Navbar */
        [data-theme="dark"] .navbar,
        [data-theme="dark"] .header {
            background: var(--navbar-bg);
            border-bottom: 1px solid var(--border-color);
        }

        /* Tables */
        [data-theme="dark"] table {
            background: var(--table-bg);
            color: var(--text-primary);
        }

        [data-theme="dark"] table tr:nth-child(even) {
            background: var(--table-stripe);
        }

        /* Form elements */
        [data-theme="dark"] input,
        [data-theme="dark"] select,
        [data-theme="dark"] textarea {
            background: var(--input-bg);
            color: var(--text-primary);
            border-color: var(--border-color);
        }

        /* Buttons */
        .btn-primary {
            background: var(--accent-primary);
            color: white;
        }

        .btn-secondary {
            background: var(--button-bg);
            color: var(--button-text);
        }

        .btn-success { background: var(--success-color); color: white; }
        .btn-warning { background: var(--warning-color); color: white; }
        .btn-danger { background: var(--error-color); color: white; }

        /* Responsive */
        @media (max-width: 768px) {
            .dark-mode-toggle {
                top: 15px;
                right: 15px;
                width: 44px;
                height: 44px;
                font-size: 18px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize dark mode based on saved preference
function initializeDarkMode() {
    const savedTheme = sessionStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'true' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Toggle between dark and light mode
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        disableDarkMode();
        sessionStorage.setItem('darkMode', 'false');
    } else {
        enableDarkMode();
        sessionStorage.setItem('darkMode', 'true');
    }
}

// Enable dark mode
function enableDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    const icon = document.getElementById('darkModeIcon');
    const button = document.querySelector('.dark-mode-toggle');
    
    if (icon) icon.textContent = '☀️';
    if (button) button.title = 'Switch to Light Mode';
    
    window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: 'dark' } 
    }));
}

// Disable dark mode (enable light mode)
function disableDarkMode() {
    document.documentElement.setAttribute('data-theme', 'light');
    const icon = document.getElementById('darkModeIcon');
    const button = document.querySelector('.dark-mode-toggle');
    
    if (icon) icon.textContent = '🌙';
    if (button) button.title = 'Switch to Dark Mode';
    
    window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: 'light' } 
    }));
}

// Setup event listeners
function setupEventListeners() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const savedTheme = sessionStorage.getItem('darkMode');
        if (!savedTheme) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            toggleDarkMode();
        }
    });
}