import { useSyncExternalStore } from "react";

const subscribeToClientHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const useClientHydration = (): boolean =>
  useSyncExternalStore(
    subscribeToClientHydration,
    getClientSnapshot,
    getServerSnapshot
  );
