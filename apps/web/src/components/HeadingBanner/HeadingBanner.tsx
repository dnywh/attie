import type { PropsWithChildren } from "react";
import { Legend } from "@headlessui/react";
import { css, styled } from "next-yak";

const headingBannerStyles = css`
  background-color: black;
  border-radius: 3px;
  color: white;
  display: block;
  font-size: 1.0625rem;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.085rem;
  padding: 0.25rem 0;
  text-align: center;
  text-transform: uppercase;
  width: 100%;

  &[data-sticky="true"] {
    position: sticky;
    top: -1px;
    z-index: 1;
  }
`;

const StyledHeading = styled.h2`
  ${headingBannerStyles};
`;

const StyledLabel = styled.label`
  ${headingBannerStyles};
`;

const StyledLegend = styled(Legend)`
  ${headingBannerStyles};
`;

interface HeadingBannerProps {
  as?: "h2" | "label" | typeof Legend;
  sticky?: "true" | "false";
  htmlFor?: string;
}

function HeadingBanner({
  as = "h2",
  sticky = "false",
  children = "Heading Title",
  ...props
}: PropsWithChildren<HeadingBannerProps>) {
  if (as === "label") {
    return (
      <StyledLabel data-sticky={sticky} {...props}>
        {children}
      </StyledLabel>
    );
  }

  if (as === Legend) {
    return <StyledLegend data-sticky={sticky}>{children}</StyledLegend>;
  }

  return (
    <StyledHeading data-sticky={sticky}>
      {children}
    </StyledHeading>
  );
}

export default HeadingBanner;
