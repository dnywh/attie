import type { ElementType, PropsWithChildren } from "react";
import { styled } from "next-yak";

const StyledHeading = styled.h2`
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

interface HeadingBannerProps {
  as?: ElementType;
  sticky?: "true" | "false";
  htmlFor?: string;
}

const PolymorphicHeading = StyledHeading as unknown as ElementType;

function HeadingBanner({
  as = "h2",
  sticky = "false",
  children = "Heading Title",
  ...props
}: PropsWithChildren<HeadingBannerProps>) {
  return (
    <PolymorphicHeading as={as} data-sticky={sticky} {...props}>
      {children}
    </PolymorphicHeading>
  );
}

export default HeadingBanner;
