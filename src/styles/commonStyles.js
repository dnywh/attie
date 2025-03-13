// import { css } from "@pigment-css/react";

// Common card-like element with black border and shadow
// export const cardStyle = ({ theme }) => ({
//     border: `1px solid ${theme.colors.text.primary}`,
//     boxShadow: `0 4px 0 0 ${theme.colors.text.primary}`,
//     borderRadius: "0px",
// });

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

export const teamText = ({
    fontWeight: "500",
    fontSize: "0.875rem",
    lineHeight: "100%",
    letterSpacing: "0.055em",
    textTransform: "uppercase",
});



export const dashedBorder = ({ theme }) => ({
    paddingTop: "1.5rem",
    // Dashed border generator
    // https://codepen.io/amit_sheen/pen/xxZeyjO
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.foreground,
    border: `1px solid ${theme.colors.text.primary}`,
    borderRadius: "2px",
    boxShadow: `0.5px 1.5px 0 0 ${theme.colors.foreground}`,
});
