// @ts-nocheck
import { styled } from "next-yak";
import { ellipsizedText } from "@/styles/commonStyles";

const StyledButton = styled.button`
  ${ellipsizedText};
  color: black;
  font-size: 0.85rem;
  font-style: italic;
  font-weight: 700;
  letter-spacing: 0.055em;
  margin: 0 -0.5rem;
  min-height: 2.5rem;
  padding: 0 0.5rem;
  text-decoration: underline;
  text-transform: uppercase;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.5;
    text-decoration: none;
  }
`;

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
