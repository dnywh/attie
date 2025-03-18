/**
 * @typedef {Object} CommonFixture
 * @property {string} id - Unique identifier
 * @property {string} utcDate - ISO date string
 * @property {string} localDate - Local date string
 * @property {string} status - SCHEDULED | TIMED | IN_PLAY | PAUSED | FINISHED | CANCELLED | POSTPONED
 * @property {Object} competition - Competition info
 * @property {string} competition.name - Competition name
 * @property {string} [competition.type] - Optional competition type
 * @property {Object} homeTeam - Home team info
 * @property {string} homeTeam.name - Full team name
 * @property {string} homeTeam.shortName - Short team name
 * @property {string} homeTeam.crest - Team logo URL
 * @property {Object} awayTeam - Away team info (same structure as homeTeam)
 * @property {Object} score - Score information
 * @property {Object} score.fullTime - Full time scores
 * @property {number|null} score.fullTime.home - Home team score
 * @property {number|null} score.fullTime.away - Away team score
 */
