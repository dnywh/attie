import FootballIcon from "@/components/FootballIcon";
import BasketballIcon from "@/components/BasketballIcon";
import BaseballIcon from "@/components/BaseballIcon";
import AmericanFootballIcon from "@/components/AmericanFootballIcon";
import RugbyLeagueIcon from "@/components/RugbyLeagueIcon";

export const SPORTS = {
    'aussie-rules': {
        name: "Aussie Rules",
        icon: AmericanFootballIcon,
    },
    'football': {
        name: 'Football',
        icon: FootballIcon,
    },
    'basketball': {
        name: 'Basketball',
        icon: BasketballIcon,
    },
    'baseball': {
        name: 'Baseball',
        icon: BaseballIcon,
    },
    'american-football': {
        name: 'American Football',
        localName: 'Football', // Because "American Football" looks weird to American audiences
        icon: AmericanFootballIcon,
    },
    'rugby-league': {
        name: 'Rugby League',
        icon: AmericanFootballIcon,
    },
    'rugby-union': {
        name: 'Rugby Union',
        icon: AmericanFootballIcon,
    },
};
