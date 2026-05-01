export const FIXTURE_STATUS = {
    SCHEDULED: 'SCHEDULED',
    LIVE: 'LIVE',
    FINISHED: 'FINISHED',
    SUSPENDED: 'SUSPENDED',
    POSTPONED: 'POSTPONED',
    CANCELLED: 'CANCELLED'
} as const;

export type FixtureStatusType = typeof FIXTURE_STATUS[keyof typeof FIXTURE_STATUS]; 
