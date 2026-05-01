export interface DateWindow {
    start: number;
    end: number;
}

export interface WindowConfig {
    INITIAL: {
        PAST: DateWindow;
        FUTURE: DateWindow;
    };
    INCREMENT: {
        DAYS: number;
    };
    MAX_ATTEMPTS: number;
}

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
        MAX_ATTEMPTS: 4, // Maximum attempts to find new fixtures when loading more
    },
    // Add other sports here with their own window configurations
} as const satisfies Record<string, WindowConfig>;

// Use football config as default for now
export const DEFAULT_WINDOWS = WINDOW_CONFIG.FOOTBALL; 
