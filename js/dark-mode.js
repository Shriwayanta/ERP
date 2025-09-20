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
            --bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            --card-bg: rgba(26, 26, 46, 0.95);
            --text-primary: #f1f2f6;
            --text-secondary: #c7c7c7;
            --text-muted: #8395a7;
            --border-color: rgba(74, 144, 226, 0.15);
            --button-bg: rgba(22, 33, 62, 0.9);
            --button-text: #4a90e2;
            --shadow: rgba(0,0,0,0.7);
            --shadow-hover: rgba(0,0,0,0.9);
            --input-bg: rgba(16, 16, 30, 0.9);
            --navbar-bg: rgba(26, 26, 46, 0.98);
            --table-bg: rgba(22, 33, 62, 0.9);
            --table-stripe: rgba(74, 144, 226, 0.05);
            --accent-primary: #4a90e2;
            --success-color: #00a085;
            --warning-color: #e6ac00;
            --error-color: #d63384;
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

        /* Force the main white container to be dark */
        [data-theme="dark"] .container,
        [data-theme="dark"] .main-container,
        [data-theme="dark"] .content-wrapper,
        [data-theme="dark"] .page-content,
        [data-theme="dark"] section,
        [data-theme="dark"] .section {
            background: var(--card-bg) !important;
            color: var(--text-primary) !important;
        }

        /* Target the specific white background that contains System Overview */
        [data-theme="dark"] div[style*="background-color: white"],
        [data-theme="dark"] div[style*="background: white"],
        [data-theme="dark"] div[style*="background:#fff"],
        [data-theme="dark"] div[style*="background-color:#fff"],
        [data-theme="dark"] div[style*="background: #fff"],
        [data-theme="dark"] div[style*="background-color: #fff"] {
            background: var(--card-bg) !important;
            color: var(--text-primary) !important;
        }

        /* More aggressive targeting for white backgrounds */
        [data-theme="dark"] * {
            background-color: transparent;
        }

        [data-theme="dark"] body,
        [data-theme="dark"] .main-content,
        [data-theme="dark"] .overview-section,
        [data-theme="dark"] .system-overview {
            background: var(--bg-gradient) !important;
        }

        /* Ensure System Overview title is white */
        [data-theme="dark"] h2,
        [data-theme="dark"] .section-title {
            color: #ffffff !important;
        }

        /* Keep stat cards as they are but ensure proper spacing and WHITE TEXT */
        [data-theme="dark"] .stat-item,
        [data-theme="dark"] .stat-card,
        [data-theme="dark"] .overview-stat {
            background: rgba(22, 33, 62, 0.8) !important;
            color: #ffffff !important;
            border: 1px solid var(--border-color) !important;
            margin: 10px;
        }

        /* Force ALL text inside stat cards to be white */
        [data-theme="dark"] .stat-item *,
        [data-theme="dark"] .stat-card *,
        [data-theme="dark"] .overview-stat *,
        [data-theme="dark"] .stat-item div,
        [data-theme="dark"] .stat-card div,
        [data-theme="dark"] .overview-stat div,
        [data-theme="dark"] .stat-item span,
        [data-theme="dark"] .stat-card span,
        [data-theme="dark"] .overview-stat span,
        [data-theme="dark"] .stat-item p,
        [data-theme="dark"] .stat-card p,
        [data-theme="dark"] .overview-stat p {
            color: #ffffff !important;
        }

        /* Target the specific stat numbers and labels */
        [data-theme="dark"] .stat-value,
        [data-theme="dark"] .stat-number,
        [data-theme="dark"] .stat-label,
        [data-theme="dark"] .overview-value,
        [data-theme="dark"] .overview-number,
        [data-theme="dark"] .overview-label {
            color: #ffffff !important;
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

        /* Universal white background override */
        [data-theme="dark"] .bg-white,
        [data-theme="dark"] .background-white {
            background: var(--card-bg) !important;
            color: var(--text-primary) !important;
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