import FootballIcon from "@/components/FootballIcon";
import BasketballIcon from "@/components/BasketballIcon";
import BaseballIcon from "@/components/BaseballIcon";
import AmericanFootballIcon from "@/components/AmericanFootballIcon";
import RugbyLeagueIcon from "@/components/RugbyLeagueIcon";
import {
  SPORTS as SHARED_SPORTS,
  isSportKey,
} from "@attie/contracts";
import type { SportConfig, SportKey } from "@/types/domain";

export const SPORTS = {
    'american-football': {
        ...SHARED_SPORTS["american-football"],
        icon: AmericanFootballIcon,
    },
    'aussie-rules': {
        ...SHARED_SPORTS["aussie-rules"],
        icon: AmericanFootballIcon,
    },
    'baseball': {
        ...SHARED_SPORTS.baseball,
        icon: BaseballIcon,
    },
    'basketball': {
        ...SHARED_SPORTS.basketball,
        icon: BasketballIcon,
    },
    'football': {
        ...SHARED_SPORTS.football,
        icon: FootballIcon,
    },
    'rugby-league': {
        ...SHARED_SPORTS["rugby-league"],
        icon: RugbyLeagueIcon,
    },
    'rugby-union': {
        ...SHARED_SPORTS["rugby-union"],
        icon: AmericanFootballIcon,
    },
} as const satisfies Record<SportKey, SportConfig>;

export { isSportKey };
