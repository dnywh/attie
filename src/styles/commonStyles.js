// import { css } from "@pigment-css/react";

// Common card-like element with black border and shadow
// export const cardStyle = ({ theme }) => ({
//     border: `1px solid ${theme.colors.text}`,
//     boxShadow: `0 4px 0 0 ${theme.colors.text}`,
//     borderRadius: "0px",
// });

export const dashedBorder = ({ theme }) => ({
    borderTop: `1px dashed ${theme.colors.text}`,
    paddingTop: "1.5rem",
});

export const veryBasicCardStyle = ({ theme }) => ({
    border: `1px solid ${theme.colors.text}`,
    boxShadow: `0 4px 0 0 ${theme.colors.text}`,
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
        border: `1px solid ${theme.colors.text}`,
        boxShadow: `0 ${shadowSize}px 0 0 ${theme.colors.text}`,
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
    border: `1px solid ${theme.colors.text}`,
    boxShadow: `0 3px 0 0 ${theme.colors.text}`,
    borderRadius: "3px",
})

// Scores, dropdowns
const bleedingWhiteCard = ({ theme }) => ({
    border: `1px solid ${theme.colors.text}`,
    borderRadius: "2px",
    boxShadow: `0.5px 1.5px 0 0 ${theme.colors.foreground}`,
});
