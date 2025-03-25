/**
 * Format a date for display with relative terms (Today, Yesterday, etc.)
 */
export const formatDateForDisplay = (date) => {
    const now = new Date();
    const localDate = new Date(date);

    // Convert both dates to start of day in local timezone
    const stripTime = (d) => {
        const local = new Date(d);
        local.setHours(0, 0, 0, 0);
        return local.getTime();
    };

    const dateTime = stripTime(localDate);
    const nowTime = stripTime(now);
    const dayDiff = Math.round((dateTime - nowTime) / (1000 * 60 * 60 * 24));

    // Only show Today/Yesterday for past dates
    if (dayDiff === 0) return "Today";
    if (dayDiff === -1) return "Yesterday";
    if (dayDiff === 1) return "Tomorrow";

    // All other past dates
    const suffix = getOrdinalSuffix(localDate.getDate());
    return localDate
        .toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
        })
        .replace(/(\d+)/, `$1${suffix}`);
};

/**
 * Get the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export const getOrdinalSuffix = (day) => {
    const j = day % 10,
        k = day % 100;
    if (j == 1 && k != 11) return "st";
    if (j == 2 && k != 12) return "nd";
    if (j == 3 && k != 13) return "rd";
    return "th";
};

/**
 * Sort fixtures by date
 */
export const sortFixtures = (fixtures, selectedDirection) => {
    return fixtures.sort((a, b) => {
        const dateA = new Date(a.utcDate);
        const dateB = new Date(b.utcDate);
        // When fixtures direction backwards: most recent first (B-A)
        // When fixtures direction forwards: soonest first (A-B)
        return selectedDirection === "forwards" ? dateA - dateB : dateB - dateA;
    });
};

/**
 * Group fixtures by date
 */
export const groupFixturesByDate = (fixtures) => {
    return fixtures.reduce((groups, fixture) => {
        const localDate = new Date(fixture.utcDate);
        const dayStart = new Date(localDate).setHours(0, 0, 0, 0); // Use timestamp as key

        if (!groups[dayStart]) {
            groups[dayStart] = [];
        }
        groups[dayStart].push({
            ...fixture,
            localDate,
        });
        return groups;
    }, {});
};

// Some APIs (balldontlie MLB and NFL namely) do not support date range, only passing single dates in an array
// But my adaptors just pass a dateFrom and dateTo
// This function makes so make an array based on dateFrom and dateTo
export function generateDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    // Include the start date
    while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
} 
