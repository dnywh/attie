// @ts-nocheck
import { styled } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

function InputIconContainer({ children }) {
  return <Container>{children}</Container>;
}

export default InputIconContainer;

const Container = styled.div`
  background-color: ${webTheme.colors.background.foremost};
  border: 1px dashed ${webTheme.colors.text.primary};
  border-radius: 50%;
  display: grid;
  height: 1.5rem;
  place-items: center;
  transition: background-color 0ms ${webTheme.curves.ease.basic};
  width: 1.5rem;

  & svg {
    margin: 0 0 2px 1px;
    opacity: 0;
    transform: scale(0);
    transition:
      opacity 0ms ${webTheme.curves.ease.basic},
      transform 0ms ${webTheme.curves.spring.heavy};
  }

  [data-headlessui-state~="checked"] & {
    background-color: ${webTheme.colors.background.card};
    border: none;
    transition: background-color 50ms ${webTheme.curves.ease.basic};

    & svg {
      opacity: 1;
      transform: scale(1);
      transition:
        opacity 50ms ${webTheme.curves.ease.basic},
        transform 100ms ${webTheme.curves.spring.heavy};
    }
  }

  [data-headlessui-state~="disabled"] & {
    opacity: 0.35;
  }
`;
