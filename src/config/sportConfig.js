import FootballIcon from "@/components/FootballIcon";
import BasketballIcon from "@/components/BasketballIcon";
import BaseballIcon from "@/components/BaseballIcon";
import AmericanFootballIcon from "@/components/AmericanFootballIcon";
import RugbyLeagueIcon from "@/components/RugbyLeagueIcon";

export const SPORTS = {
    football: {
        key: 'football',
        name: 'Football',
        icon: FootballIcon,
    },
    basketball: {
        key: 'basketball',
        name: 'Basketball',
        icon: BasketballIcon,
        scoreLabel: 'Points',
        defaultView: 'quarters',
    },
    baseball: {
        key: 'baseball',
        name: 'Baseball',
        icon: BaseballIcon,
    },
    americanFootball: {
        key: 'americanFootball',
        name: 'American Football',
        icon: AmericanFootballIcon,
    },
    rugbyLeague: {
        key: 'rugbyLeague',
        name: 'Rugby League',
        icon: RugbyLeagueIcon,
    },
};
