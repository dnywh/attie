import FootballIcon from "@/components/FootballIcon";
import BasketballIcon from "@/components/BasketballIcon";
import BaseballIcon from "@/components/BaseballIcon";
import AmericanFootballIcon from "@/components/AmericanFootballIcon";

export const SPORT_CONFIG = {
    football: {
        icon: FootballIcon,
        scoreLabel: 'Goals',
        defaultView: 'full-time',
    },
    basketball: {
        icon: BasketballIcon,
        scoreLabel: 'Points',
        defaultView: 'quarters',
    },
    baseball: {
        icon: BaseballIcon,
        scoreLabel: 'Runs',
        defaultView: 'innings',
    },
    americanFootball: {
        icon: AmericanFootballIcon,
        scoreLabel: 'Points',
        defaultView: 'quarters',
    },
}; 
