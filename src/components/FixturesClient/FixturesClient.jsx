"use client";
import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Fixture from "@/components/Fixture";
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

const FilterSection = styled("section")({
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  overflowX: "scroll",
  alignItems: "center",
});

const Select = styled("select")({});

const Fieldset = styled("fieldset")({
  display: "flex",
  flexDirection: "row",
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
  },
});

const StyledTabList = styled(TabList)({
  // display: "flex",
  // gap: "1rem",
  display: "none",
});

const StyledTab = styled(Tab)({
  width: "100%",
});

const StyledTabPanel = styled(TabPanel)({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginTop: "1rem",
});

const SwitchContainer = styled("div")({
  display: "flex",
  gap: "0.5rem",
  alignSelf: "flex-end",
  alignItems: "center",
});

const StyledSwitch = styled(Switch)({
  // textWrap: "nowrap",

  // Remove default button styling
  appearance: "none",
  border: "none",
  padding: "0",
  margin: "0",
  cursor: "pointer",
  // Set basic styling
  display: "inline-flex",
  alignItems: "center",
  width: "3.5rem",
  height: "2rem",
  backgroundColor: "gray",
  borderRadius: "1.5rem",
  transition: "backgroundColor 0.125s ease-in-out",

  "& span": {
    backgroundColor: "white",
    borderRadius: "1rem",
    width: "1.75rem",
    height: "1.75rem",
    transition: "transform 0.125s ease-in-out",
    transform: "translateX(0.15rem)",
  },

  "&[data-checked]": {
    backgroundColor: "blue",
    "& span": {
      transform: "translateX(1.65rem)",
    },
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
    // fontSize: "1.5rem",
    textAlign: "center",
  },
});

const DateFixturesList = styled("ul")({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const groupFixturesByDate = (fixtures) => {
  return fixtures.reduce((groups, fixture) => {
    // Convert UTC date string to local date (will automatically convert to user's timezone)
    const localDate = new Date(fixture.utcDate);

    // Format the date in the user's local timezone
    const date = localDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      ...fixture,
      localDate, // Add localDate to fixture object if needed elsewhere
    });
    return groups;
  }, {});
};

export default function FixturesClient() {
  const [showAllScores, setShowAllScores] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    "premier-league",
    // "champions-league",
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
        setFixtures(
          matches.flat().sort((a, b) => {
            const dateA = new Date(a.utcDate);
            const dateB = new Date(b.utcDate);
            return dateB - dateA;
          })
        );
      } catch (error) {
        console.error("Failed to fetch fixtures:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialFixtures();
  }, []);

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
          [...prevFixtures, ...newMatches].sort((a, b) => {
            const dateA = new Date(a.utcDate);
            const dateB = new Date(b.utcDate);
            return dateB - dateA;
          })
        );
      }
    } catch (error) {
      console.error("Failed to update fixtures:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <FilterSection>
        <Select>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option>
          {/* <option value="tba" disabled>
            After another sport? Email us: "hello" at this domain
          </option> */}
        </Select>
        <Fieldset>
          {/* <legend>Competitions:</legend> */}
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
      </FilterSection>

      <TabGroup>
        <StyledTabList>
          <StyledTab>Results</StyledTab>
          <StyledTab>Upcoming</StyledTab>
        </StyledTabList>
        <TabPanels>
          <StyledTabPanel>
            <SwitchContainer>
              Scores
              <StyledSwitch checked={showAllScores} onChange={setShowAllScores}>
                <span />
              </StyledSwitch>
            </SwitchContainer>
            {loading ? (
              <p>Loading fixtures...</p>
            ) : fixtures?.length > 0 ? (
              <AllFixturesList>
                {Object.entries(groupFixturesByDate(fixtures)).map(
                  ([date, dateFixtures]) => (
                    <DateGroup key={date}>
                      <h2>{date}</h2>
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
                  )
                )}
              </AllFixturesList>
            ) : (
              <p>No fixtures found</p>
            )}
          </StyledTabPanel>
          <StyledTabPanel>Upcoming games</StyledTabPanel>
        </TabPanels>
      </TabGroup>
    </Main>
  );
}
