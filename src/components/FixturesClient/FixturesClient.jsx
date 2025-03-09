"use client";
import { useState, useEffect } from "react";
import {
  Switch,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
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

const FilterSection = styled("section")({
  display: "flex",
  flexDirection: "row",
  gap: "0.5rem",
  overflowX: "scroll",
  alignItems: "center",
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

const StyledDialog = styled(Dialog)({
  position: "relative",
  zIndex: "50",
});

const DialogInner = styled("div")({
  position: "fixed",
  bottom: "0.5rem",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "white",
  padding: "2rem",
  width: "calc(100% - 1rem)",
  maxWidth: "30rem",
  borderRadius: "0.25rem",
});

const StyledDialogBackdropOne = styled(DialogBackdrop)({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "#FA6565",
  opacity: "95%",
});

const StyledDialogBackdropTwo = styled(DialogBackdrop)({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backdropFilter: "grayscale(96%) sepia(30%)",
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
  if (dayDiff > 0) {
    // Future dates should not be shown since route.js limits to today
    console.warn("Future date encountered:", date);
    return "Invalid Date";
  }

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

export default function FixturesClient() {
  const [showAllScores, setShowAllScores] = useState(false);
  const [selectedCompetitions, setSelectedCompetitions] = useState([
    "premier-league",
    "champions-league",
  ]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true

  const [isOpen, setIsOpen] = useState(false);
  function open() {
    console.log("opening...");
    setIsOpen(true);
  }

  function close() {
    console.log("closing...");
    setIsOpen(false);
  }

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
    <>
      <Main>
        <FilterSectionNew>
          <FancyDropdown
            onClick={open}
            icon="⚽︎"
            label={selectedCompetitions.join(", ")}
            count={selectedCompetitions.length}
            fillSpace={true}
          >
            {selectedCompetitions}
          </FancyDropdown>
          <FancyDropdown icon="⏲" />
          <FancyDropdown icon="○" />
        </FilterSectionNew>

        <section>
          {loading ? (
            <p>Loading fixtures...</p>
          ) : fixtures?.length > 0 ? (
            <AllFixturesList>
              {Object.entries(
                groupFixturesByDate(
                  // Filter out any future fixtures based on UTC time
                  fixtures.filter(
                    (fixture) => new Date(fixture.utcDate) <= new Date()
                  )
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

      <StyledDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <StyledDialogBackdropOne />
        <StyledDialogBackdropTwo />
        <DialogInner>
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <header>
              <button onClick={close}>Close</button>
              {/* <DialogTitle>Sport and competitions</DialogTitle> */}
            </header>
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
              <legend>2. Competitions:</legend>
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
          </DialogPanel>
        </DialogInner>
      </StyledDialog>
    </>
  );
}
