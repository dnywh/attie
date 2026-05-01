import type { ChangeEvent, ReactNode } from "react";
import Link from "next/link";
import { Legend } from "@headlessui/react";
import CheckboxGroup from "@/components/CheckboxGroup";
import FancyDropdown from "@/components/FancyDropdown";
import FieldCheckboxRow from "@/components/FieldCheckboxRow";
import FieldRadioRow from "@/components/FieldRadioRow";
import Fieldset from "@/components/Fieldset";
import FixturesBackwardIcon from "@/components/FixturesBackwardIcon";
import FixturesForwardIcon from "@/components/FixturesForwardIcon";
import HeadingBanner from "@/components/HeadingBanner";
import RadioGroup from "@/components/RadioGroup";
import ScoresHiddenIcon from "@/components/ScoresHiddenIcon";
import ScoresRevealedIcon from "@/components/ScoresRevealedIcon";
import Select from "@/components/Select";
import SelectionExplainerText from "@/components/SelectionExplainerText";
import {
  COMPETITIONS,
  getCompetitionsForSport,
} from "@/constants/competitions";
import { SPORTS, isSportKey } from "@/config/sportConfig";
import type {
  CompetitionConfig,
  CompetitionKey,
  Direction,
  SportKey,
} from "@/types/domain";
import { ControlBar } from "./styles";

interface FixtureControlsProps {
  selectedCompetitions: CompetitionKey[];
  selectedDirection: Direction;
  selectedSport: SportKey;
  showAllScores: boolean;
  sportIcon: ReactNode;
  useSoundEffects: boolean;
  onCompetitionChange: (competitionKey: CompetitionKey) => void;
  onDirectionChange: (value: boolean) => void;
  onScoreVisibilityChange: (value: boolean) => void;
  onSoundEffectsChange: (value: boolean) => void;
  onSportChange: (sport: SportKey) => void;
}

function FixtureControls({
  selectedCompetitions,
  selectedDirection,
  selectedSport,
  showAllScores,
  sportIcon,
  useSoundEffects,
  onCompetitionChange,
  onDirectionChange,
  onScoreVisibilityChange,
  onSoundEffectsChange,
  onSportChange,
}: FixtureControlsProps) {
  const availableCompetitions = Object.entries(
    getCompetitionsForSport(selectedSport)
  ) as [CompetitionKey, CompetitionConfig][];

  return (
    <ControlBar>
      <FancyDropdown
        icon={sportIcon}
        label={
          selectedCompetitions.length
            ? selectedCompetitions.map((id) => COMPETITIONS[id].name).join(", ")
            : "Nothing selected"
        }
        count={selectedCompetitions.length}
        fillSpace={true}
      >
        <Fieldset>
          <HeadingBanner as="label" htmlFor="sport">
            1. Sport
          </HeadingBanner>
          <Select
            id="sport"
            name="sport"
            value={selectedSport}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              if (isSportKey(event.target.value)) {
                onSportChange(event.target.value);
              }
            }}
          >
            {Object.entries(SPORTS).map(([sportKey, sport]) => (
              <option key={sportKey} value={sportKey}>
                {sport.name}
              </option>
            ))}
          </Select>
        </Fieldset>

        <Fieldset>
          <HeadingBanner as={Legend}>2. Competitions</HeadingBanner>
          <CheckboxGroup>
            {availableCompetitions.map(([competitionId, competition]) => (
              <FieldCheckboxRow
                icon={sportIcon}
                key={competitionId}
                name={competitionId}
                checked={selectedCompetitions.includes(competitionId)}
                onChange={() => onCompetitionChange(competitionId)}
              >
                {competition.name}
              </FieldCheckboxRow>
            ))}
          </CheckboxGroup>
        </Fieldset>
        <SelectionExplainerText>
          Are we missing your favourite sport or competition?{" "}
          <Link href="mailto:?body=Please replace the email address with `danny` at this domain.">
            Let us know
          </Link>
          .
        </SelectionExplainerText>
      </FancyDropdown>

      {selectedDirection === "backwards" && (
        <FancyDropdown
          icon={showAllScores ? <ScoresRevealedIcon /> : <ScoresHiddenIcon />}
        >
          <Fieldset>
            <HeadingBanner as={Legend}>Score visibility</HeadingBanner>
            <RadioGroup
              value={showAllScores}
              onChange={onScoreVisibilityChange}
              aria-label="Score visibility"
            >
              <FieldRadioRow value={false}>Hide all scores</FieldRadioRow>
              <FieldRadioRow value={true}>Show all scores</FieldRadioRow>
            </RadioGroup>
          </Fieldset>

          <Fieldset>
            <HeadingBanner as={Legend}>Sound effects</HeadingBanner>
            <RadioGroup
              value={useSoundEffects}
              onChange={onSoundEffectsChange}
              aria-label="Sound effects"
              disabled={showAllScores}
            >
              <FieldRadioRow value={true}>Sound on</FieldRadioRow>
              <FieldRadioRow value={false}>Sound off</FieldRadioRow>
            </RadioGroup>
          </Fieldset>
          <SelectionExplainerText>
            {showAllScores
              ? "Reveals all scores, just like any other sports results app. Boring!"
              : "Hides all scores. Tap the black circles to reveal individual scores."}
          </SelectionExplainerText>
        </FancyDropdown>
      )}

      <FancyDropdown
        icon={
          selectedDirection === "forwards" ? (
            <FixturesForwardIcon />
          ) : (
            <FixturesBackwardIcon />
          )
        }
      >
        <Fieldset>
          <HeadingBanner as={Legend}>Fixture direction</HeadingBanner>
          <RadioGroup
            value={selectedDirection === "forwards"}
            onChange={onDirectionChange}
            aria-label="Fixture direction"
          >
            <FieldRadioRow value={false}>Backwards</FieldRadioRow>
            <FieldRadioRow value={true}>Forwards</FieldRadioRow>
          </RadioGroup>
        </Fieldset>
        <SelectionExplainerText>
          {selectedDirection === "forwards"
            ? "Shows upcoming fixtures, from today into the future."
            : "Shows in-progress or finished fixtures, from today back."}
        </SelectionExplainerText>
      </FancyDropdown>
    </ControlBar>
  );
}

export default FixtureControls;
