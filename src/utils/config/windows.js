// Window configuration for different sports/APIs
export const WINDOW_CONFIG = {
    FOOTBALL: {
        INITIAL: {
            PAST: { start: 7, end: 7 },
            FUTURE: { start: 0, end: 28 },
        },
        INCREMENT: {
            DAYS: 14, // Days to increment when loading more
        },
        MAX_ATTEMPTS: 3, // Maximum attempts to find new fixtures when loading more
    },
    // Add other sports here with their own window configurations
};

// Use football config as default for now
export const DEFAULT_WINDOWS = WINDOW_CONFIG.FOOTBALL; 
