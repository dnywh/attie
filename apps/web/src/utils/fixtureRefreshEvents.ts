export const FIXTURE_REFRESH_EVENT = "attie:refresh-fixtures";

export const dispatchFixtureRefresh = () => {
  window.dispatchEvent(new Event(FIXTURE_REFRESH_EVENT));
};

export const onFixtureRefresh = (handler: () => void) => {
  window.addEventListener(FIXTURE_REFRESH_EVENT, handler);

  return () => {
    window.removeEventListener(FIXTURE_REFRESH_EVENT, handler);
  };
};
