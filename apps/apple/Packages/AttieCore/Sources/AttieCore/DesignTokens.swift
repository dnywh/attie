import Foundation

public enum AttieDesignTokens {
    public enum Palette {
        public enum Light {
            public static let page = "#FA6565"
            public static let card = "#FEE272"
            public static let interstitial = "#AEF4F5"
            public static let informational = "#D8D4C4"
            public static let crest = "rgb(245, 245, 245)"
            public static let focusHover = "hsl(48deg 99% 96%)"
            public static let focusActive = "hsl(48deg 99% 92%)"
            public static let primaryText = "#000000"
            public static let tertiaryText = "rgb(128, 128, 128)"
            public static let live = "red"
            public static let shadow = "rgba(0,0,0,0.1)"
        }

        public enum Dark {
            public static let page = "#181A2A"
            public static let card = "#D8BD4F"
            public static let interstitial = "#286B74"
            public static let informational = "#59564C"
            public static let crest = "rgb(45, 47, 54)"
            public static let foremost = "#F7F3E7"
            public static let focusHover = "hsl(48deg 56% 24%)"
            public static let focusActive = "hsl(48deg 56% 30%)"
            public static let primaryText = "#080808"
            public static let tertiaryText = "rgb(92, 92, 92)"
            public static let live = "#FF5A5A"
            public static let shadow = "rgba(0,0,0,0.28)"
        }
    }

    public enum Spacing {
        public static let pagePaddingY = 32.0
        public static let pagePaddingX = 12.0
        public static let pageGap = 48.0
        public static let pageMaxWidth = 640.0
    }

    public enum Typography {
        public static let bodyFont = "Jost Variable"
    }
}
