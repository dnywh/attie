// import { css } from "@pigment-css/react";

// Reload dev server to see changes

// Common card-like element with black border and shadow
// export const cardStyle = ({ theme }) => ({
//     border: `1px solid ${theme.colors.text.primary}`,
//     boxShadow: `0 4px 0 0 ${theme.colors.text.primary}`,
//     borderRadius: "0px",
// });

export const fieldInputStyle = {
    padding: "0.75rem",
    outline: "none", // See focus-within
};

export const fieldsetGroupStyle = ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.colors.text.primary}`,
    backgroundColor: theme.colors.background.foremost,
    // Give the entire container a focus treatment if an item within (e.g. radio button row) is focussed
    "&:focus-within": {
        boxShadow: `0 0 0 2px ${theme.colors.shadow}`,
    },
});

export const ellipsizedText = ({
    // Truncate and ellipsize text
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
});

export const smallText = ({
    fontSize: "0.6875rem",
    lineHeight: "100%",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
});

export const mediumText = ({
    fontWeight: "500",
    fontSize: "0.75rem",
    lineHeight: "100%",
    letterSpacing: "0.075em",
    textTransform: "uppercase",
});

export const teamText = ({
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "100%",
    letterSpacing: "0.055em",
    textTransform: "uppercase",
});

// Helper function for creating a stippled background
export const createStippledBackground = ({ fill }) =>
    ({ theme }) => ({
        background: `repeating-linear-gradient(to right, transparent, transparent 2px, ${fill} 2px, ${fill} 4px), repeating-linear-gradient(to bottom, transparent, transparent 2px,${fill} 2px,${fill} 4px), color-mix(in hsl, ${fill}, black 2.5%)`,
    });

export const dashedBorder = ({ theme }) => ({
    paddingTop: "1.5rem",
    // Dashed border generator
    // https://codepen.io/amit_sheen/pen/xxZeyjO
    backgroundColor: theme.colors.background.page,
    backgroundImage:
        "none, repeating-linear-gradient(90deg, rgb(255 255 255 / 30%), rgb(255 255 255 / 30%) 3px, transparent 3px, transparent 6px, rgb(0 0 0 / 95%) 1.25rem)",
    // backgroundPosition: "0 0, 0 0, 100% 0, 0 100%",
    backgroundSize: "0 100%,100% 1.5px, 0 100%,100% 0",
    backgroundRepeat: "no-repeat",
    // backgroundBlendMode: "soft-light",
    backgroundBlendMode: "overlay",
});

export const veryBasicCardStyle = ({ theme }) => ({
    border: `1px solid ${theme.colors.text.primary}`,
    boxShadow: `0 4px 0 0 ${theme.colors.text.primary}`,
    borderRadius: "3px",
});

export const interactiveStyles = ({
    background: "red",
    "&:hover": {
        background: "yellow",
    },

    "&:focus, &:active": {
        background: "blue",
    }
})

// Helper function to ensure consistent parameter handling
const createCardStyle = ({ shadowSize = 4, borderRadius = 3, interactive = false }) =>
    ({ theme }) => ({
        border: `1px solid ${theme.colors.text.primary}`,
        boxShadow: `0 ${shadowSize}px 0 0 ${theme.colors.text.primary}`,
        borderRadius: `${borderRadius}px`,
        ...(interactive ? interactiveStyles : {}),
    });

// Pre-configred variants
export const smallCardStyle = ({ theme }) =>
    createCardStyle({ shadowSize: 3, borderRadius: 3 })({ theme });

export const smallCardStyleInteractive = ({ theme }) => ({
    ...createCardStyle({ shadowSize: 3, borderRadius: 3, interactive: true })({ theme }),
    cursor: "pointer",
})

// Export the creator function for custom cases
export { createCardStyle };

// Running list of common styles

// ControlBar, yellow fixture cards
export const elevatedCard = ({ theme }) => ({
    border: `1px solid ${theme.colors.text.primary}`,
    boxShadow: `0 3px 0 0 ${theme.colors.text.primary}`,
    borderRadius: "3px",
})

// Scores, dropdowns
export const bleedingWhiteCard = ({ theme }) => ({
    backgroundColor: theme.colors.background.foremost,
    border: `1px solid ${theme.colors.text.primary}`,
    borderRadius: "2px",
    boxShadow: `0.5px 1.5px 0 0 ${theme.colors.background.foremost}`,
});
