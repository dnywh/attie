import { Fragment } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import Fixture from "@/components/Fixture";
import HeadingBanner from "@/components/HeadingBanner";
import Interstitial from "@/components/Interstitial";
import LoadingText from "@/components/LoadingText";
import SelectionExplainerText from "@/components/SelectionExplainerText";
import { formatDateForDisplay, groupFixturesByDate } from "@/utils/dates";
import type { CommonFixture, CompetitionKey, Direction } from "@/types/domain";
import {
  AllFixturesList,
  DateFixturesList,
  DateGroup,
  EmptyState,
} from "./styles";

interface FixturesListProps {
  fixtures: CommonFixture[];
  hasRateLimitError: boolean;
  hasReachedEnd: boolean;
  loading: boolean;
  loadingMore: boolean;
  selectedCompetitions: CompetitionKey[];
  selectedDirection: Direction;
  showAllScores: boolean;
  useSoundEffects: boolean;
  onLoadMore: () => void;
}

function FixturesList({
  fixtures,
  hasRateLimitError,
  hasReachedEnd,
  loading,
  loadingMore,
  selectedCompetitions,
  selectedDirection,
  showAllScores,
  useSoundEffects,
  onLoadMore,
}: FixturesListProps) {
  if (loading) {
    return (
      <section>
        <EmptyState>
          <SelectionExplainerText>
            <LoadingText>
              Loading {selectedDirection === "forwards" && "upcoming"} fixtures
            </LoadingText>
          </SelectionExplainerText>
        </EmptyState>
      </section>
    );
  }

  if (fixtures.length === 0) {
    return (
      <section>
        <EmptyState>
          <SelectionExplainerText>
            {!selectedCompetitions.length
              ? "Select a competition from above"
              : `No fixtures found across the ${
                  selectedDirection === "forwards"
                    ? `next few months`
                    : `last few months`
                }`}
          </SelectionExplainerText>
        </EmptyState>
      </section>
    );
  }

  return (
    <section>
      <AllFixturesList>
        {Object.entries(
          groupFixturesByDate(
            fixtures.filter((fixture) => {
              const fixtureDate = new Date(fixture.utcDate);
              const now = new Date();

              return selectedDirection === "forwards"
                ? fixtureDate >= now
                : fixtureDate <= now;
            })
          )
        ).map(([groupingKey, dateFixtures], index) => {
          const firstFixture = dateFixtures[0];

          if (!firstFixture) {
            return null;
          }

          return (
            <Fragment key={groupingKey}>
              <DateGroup>
                <HeadingBanner sticky="true">
                  {formatDateForDisplay(firstFixture.localDate)}
                </HeadingBanner>
                <DateFixturesList>
                  {dateFixtures.map((fixture) => (
                    <Fixture
                      key={fixture.id}
                      fixture={fixture}
                      showAllScores={showAllScores}
                      useSoundEffects={useSoundEffects}
                      showCompetition={selectedCompetitions.length > 1}
                    />
                  ))}
                </DateFixturesList>
              </DateGroup>
              {index === 1 && (
                <Interstitial
                  linkUrl="https://www.dannywhite.net/"
                  linkText="Reach out"
                >
                  <p>
                    Attie is lovingly crafted by product designer{" "}
                    <Link
                      href="https://www.dannywhite.net/?utm_source=attie&utm_medium=sponsorship"
                      target="_blank"
                    >
                      Danny White
                    </Link>
                    . Got a product that needs making? Get Danny involved.
                  </p>
                </Interstitial>
              )}
            </Fragment>
          );
        })}

        {!hasReachedEnd ? (
          <Button onClick={() => onLoadMore()} disabled={loadingMore}>
            {loadingMore ? <LoadingText>Loading</LoadingText> : "Load more"}
          </Button>
        ) : (
          <EmptyState>
            <SelectionExplainerText>
              {hasRateLimitError
                ? "Rate limit reached. Please try again in a minute."
                : "End of fixtures list"}
            </SelectionExplainerText>
          </EmptyState>
        )}
      </AllFixturesList>
    </section>
  );
}

export default FixturesList;
