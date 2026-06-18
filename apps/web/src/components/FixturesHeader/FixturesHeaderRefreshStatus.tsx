"use client";

import { useEffect, useRef, useState } from "react";
import { styled } from "next-yak";
import { onFixtureRefresh } from "@/utils/fixtureRefreshEvents";

const REFRESHING_DURATION_MS = 2500;
const DONE_DURATION_MS = 1250;
type RefreshState = "idle" | "refreshing" | "done";

const RefreshStatus = styled.p`
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  text-align: center;
  transition: opacity 160ms ease;

  &[data-state="refreshing"],
  &[data-state="done"] {
    opacity: 1;
  }
`;

const setHeaderRefreshStatus = (state: RefreshState) => {
  document
    .querySelector("[data-header-refresh-status]")
    ?.setAttribute("data-header-refresh-status", state);
};

const refreshStatusText = (state: RefreshState): string => {
  if (state === "refreshing") return "refreshing fixtures...";
  if (state === "done") return "done";
  return "";
};

function FixturesHeaderRefreshStatus() {
  const [refreshState, setRefreshState] = useState<RefreshState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return onFixtureRefresh(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setRefreshState("refreshing");
      setHeaderRefreshStatus("refreshing");
      timeoutRef.current = setTimeout(() => {
        setRefreshState("done");
        setHeaderRefreshStatus("done");
        timeoutRef.current = setTimeout(() => {
          setRefreshState("idle");
          setHeaderRefreshStatus("idle");
          timeoutRef.current = null;
        }, DONE_DURATION_MS);
      }, REFRESHING_DURATION_MS);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setHeaderRefreshStatus("idle");
    };
  }, []);

  return (
    <RefreshStatus aria-live="polite" data-state={refreshState}>
      {refreshStatusText(refreshState)}
    </RefreshStatus>
  );
}

export default FixturesHeaderRefreshStatus;
