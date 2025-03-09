"use client";
import { useState, useEffect } from "react";
import Fixture from "@/components/Fixture";
import FancyDropdown from "@/components/FancyDropdown";
import { COMPETITIONS } from "@/constants/competitions";
import { styled } from "@pigment-css/react";

const isDev = process.env.NODE_ENV === "development";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = "fixturesDevCache";

// Initialize cache
const fixturesCache = new Map();

// Only in development, try to restore cache from localStorage
if (isDev && typeof window !== "undefined") {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
    saved.forEach(([key, value]) => fixturesCache.set(key, value));
  } catch (e) {
    console.warn("Failed to restore cache:", e);
  }
}

const updateCache = (code, data) => {
  // Always update memory cache (both dev and prod)
  fixturesCache.set(code, {
    timestamp: Date.now(),
    data,
  });

  // Only persist to localStorage in development
  if (isDev && typeof window !== "undefined") {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify([...fixturesCache]));
    } catch (e) {
      console.warn("Failed to save cache:", e);
    }
  }
};

const Main = styled("main")({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});

const FilterSectionNew = styled("section")({
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  alignItems: "center",
});

const Select = styled("select")({
  width: "100%",
  padding: "0.5rem",
});

const Fieldset = styled("fieldset")({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

const Chip = styled("div")({
  display: "flex",
  gap: "0.5rem",
  alignItems: "center",
  borderRadius: "0.5rem",
  backgroundColor: "white",
  border: "1px dashed gray",
  textWrap: "nowrap",

  "&[data-active]": {
    border: "1px solid black",
    backgroundColor: "rgb(236, 236, 236)",
  },

  "& input, & label ": {
    cursor: "pointer",
  },
  " & input": {
    marginLeft: "0.5rem",
  },
  "& label": {
    fontSize: "0.85rem",
    fontWeight: "500",
    padding: "0.25rem 0.5rem 0.25rem 0",
    width: "100%",
  },
});

const AllFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

const DateGroup = styled("li")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",

  "& h2": {
    textAlign: "center",
  },
});

const DateFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const formatDateForDisplay = (date) => {
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

const getOrdinalSuffix = (day) => {
  const j = day % 10,
    k = day % 100;
  if (j == 1 && k != 11) return "st";
  if (j == 2 && k != 12) return "nd";
  if (j == 3 && k != 13) return "rd";
  return "th";
};

const groupFixturesByDate = (fixtures) => {
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

// Add this helper function near your other utility functions
const sortFixtures = (fixtures, showFutureFixtures) => {
  return fixtures.sort((a, b) => {
    const dateA = new Date(a.utcDate);
    const dateB = new Date(b.utcDate);
    // For past fixtures: most recent first (B-A)
    // For future fixtures: soonest first (A-B)
    return showFutureFixtures ? dateA - dateB : dateB - dateA;
  });
};

export default function FixturesClient() {
  const [showFutureFixtures, setShowFutureFixtures] = useState(false);
  const [showAllScores, setShowAllScores] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    "premier-league",
    "champions-league",
  ]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  const fetchFixturesForCompetition = async (code) => {
    const now = Date.now();
    const cached = fixturesCache.get(code);

    // Return cached data if fresh enough
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const res = await fetch(`/api/fixtures/${code}`);
    const data = await res.json();
    const matches = (data.matches || []).map((match) => ({
      ...match,
      competitionCode: code,
    }));

    updateCache(code, matches);
    return matches;
  };

  // Initial load
  useEffect(() => {
    const loadInitialFixtures = async () => {
      setLoading(true);
      try {
        const initialCodes = selectedCompetitions.map(
          (l) => COMPETITIONS[l].code
        );
        const matches = await Promise.all(
          initialCodes.map(fetchFixturesForCompetition)
        );
        setFixtures(sortFixtures(matches.flat(), showFutureFixtures));
      } catch (error) {
        console.error("Failed to fetch fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFixtures();
  }, [showFutureFixtures]); // Add this dependency

  const handleCompetitionChange = async (event) => {
    const competition = event.target.name;
    const competitionCode = COMPETITIONS[competition].code;

    setLoading(true);
    try {
      if (selectedCompetitions.includes(competition)) {
        // Remove competition
        setSelectedCompetitions((prev) =>
          prev.filter((l) => l !== competition)
        );
        setFixtures((prev) =>
          prev.filter((fixture) => fixture.competitionCode !== competitionCode)
        );
      } else {
        // Add competition
        setSelectedCompetitions((prev) => [...prev, competition]);
        const newMatches = await fetchFixturesForCompetition(competitionCode);
        setFixtures((prevFixtures) =>
          sortFixtures([...prevFixtures, ...newMatches], showFutureFixtures)
        );
      }
    } catch (error) {
      console.error("Failed to update fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Main>
        <FilterSectionNew>
          <FancyDropdown
            icon="⚽️"
            label={selectedCompetitions.join(", ")}
            count={selectedCompetitions.length}
            fillSpace={true}
          >
            <>
              <label htmlFor="sport">1. Sport</label>
              <Select name="sport" id="sport">
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="tennis">Tennis</option>
                <option value="tba" disabled>
                  After another sport? Email us: "hello" at this domain
                </option>
              </Select>

              <Fieldset>
                <legend>2. Competitions</legend>
                {Object.entries(COMPETITIONS)
                  .filter(([, competition]) => competition.tier !== "paid")
                  .map(([competitionId, competition]) => (
                    <Chip
                      key={competitionId}
                      data-active={
                        selectedCompetitions.includes(competitionId)
                          ? true
                          : undefined
                      }
                    >
                      <input
                        type="checkbox"
                        id={competitionId}
                        name={competitionId}
                        checked={selectedCompetitions.includes(competitionId)}
                        onChange={handleCompetitionChange}
                      />
                      <label htmlFor={competitionId}>{competition.name}</label>
                    </Chip>
                  ))}
              </Fieldset>
            </>
          </FancyDropdown>
          <FancyDropdown icon={showFutureFixtures ? "🗓️" : "🕥"}>
            <fieldset>
              <legend>Fixture direction</legend>
              <div>
                <input
                  type="radio"
                  id="backward-fixtures"
                  name="fixture-direction"
                  value="backwards"
                  checked={!showFutureFixtures}
                  onChange={() => setShowFutureFixtures(false)}
                />
                <label htmlFor="backward-fixtures">Backwards</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="forward-fixtures"
                  name="fixture-direction"
                  value="forwards"
                  checked={showFutureFixtures}
                  onChange={() => setShowFutureFixtures(true)}
                />
                <label htmlFor="forward-fixtures">Forwards</label>
              </div>
            </fieldset>
            <p>
              {showFutureFixtures
                ? "Shows upcoming fixtures, from today into to the future."
                : "Shows in-progress or finished fixtures, from today back."}
            </p>
          </FancyDropdown>
          {!showFutureFixtures && (
            <FancyDropdown icon={showAllScores ? "👀" : "⚫️"}>
              <fieldset>
                <legend>Score visibility</legend>
                <div>
                  <input
                    type="radio"
                    id="hide-scores"
                    name="score-visibility"
                    value="hidden"
                    checked={!showAllScores}
                    onChange={() => setShowAllScores(false)}
                  />
                  <label htmlFor="hide-scores">Hide all scores</label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="show-scores"
                    name="score-visibility"
                    value="visible"
                    checked={showAllScores}
                    onChange={() => setShowAllScores(true)}
                  />
                  <label htmlFor="show-scores">Show all scores</label>
                </div>
              </fieldset>
              <p>
                {showAllScores
                  ? "Reveals all scores, just like any other sports results app (Seriously?)."
                  : "Hides all scores. Tap the black circles to reveal individual scores."}
              </p>
            </FancyDropdown>
          )}
        </FilterSectionNew>

        <section>
          {loading ? (
            <p>Loading fixtures...</p>
          ) : fixtures?.length > 0 ? (
            <AllFixturesList>
              {Object.entries(
                groupFixturesByDate(
                  fixtures.filter((fixture) => {
                    const fixtureDate = new Date(fixture.utcDate);
                    const now = new Date();
                    return showFutureFixtures
                      ? fixtureDate >= now // Future fixtures
                      : fixtureDate <= now; // Past fixtures
                  })
                )
              ).map(([groupingKey, dateFixtures]) => (
                <DateGroup key={groupingKey}>
                  <h2>{formatDateForDisplay(dateFixtures[0].localDate)}</h2>
                  <DateFixturesList>
                    {dateFixtures.map((fixture) => (
                      <Fixture
                        key={fixture.id}
                        fixture={fixture}
                        showAllScores={showAllScores}
                      />
                    ))}
                  </DateFixturesList>
                </DateGroup>
              ))}
            </AllFixturesList>
          ) : (
            <p>No fixtures found</p>
          )}
        </section>
      </Main>
    </>
  );
}
