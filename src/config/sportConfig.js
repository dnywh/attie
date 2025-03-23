import FootballIcon from "@/components/FootballIcon";
import BasketballIcon from "@/components/BasketballIcon";
import BaseballIcon from "@/components/BaseballIcon";
import AmericanFootballIcon from "@/components/AmericanFootballIcon";
import RugbyLeagueIcon from "@/components/RugbyLeagueIcon";

export const SPORTS = {
    'american-football': {
        name: 'American Football',
        localName: 'Football', // Because "American Football" looks weird to American audiences
        icon: AmericanFootballIcon,
    },
    'aussie-rules': {
        name: "Aussie Rules",
        icon: AmericanFootballIcon,
    },
    'baseball': {
        name: 'Baseball',
        icon: BaseballIcon,
    },
    'basketball': {
        name: 'Basketball',
        icon: BasketballIcon,
    },
    'football': {
        name: 'Football',
        icon: FootballIcon,
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
