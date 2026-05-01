import { styled } from "next-yak";
import {
  dashedBorder,
  interstitialStippledBackground,
} from "@/styles/commonStyles";
import { webTheme } from "@/styles/theme.yak";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ControlBar = styled.section`
  ${interstitialStippledBackground};
  align-items: center;
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 3px;
  box-shadow: 0 3px 0 0 ${webTheme.colors.text.primary};
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  overflow-x: hidden;
  padding: 0.5rem;
`;

export const AllFixturesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DateGroup = styled.li`
  ${dashedBorder};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DateFixturesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const EmptyState = styled.div`
  ${dashedBorder};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
