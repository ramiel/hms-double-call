import type {
  HMSStatsStore,
  HMSStore,
  IHMSNotifications,
  IStoreReadOnly,
} from "@100mslive/hms-video-store";
import { HMSReactiveStore } from "@100mslive/hms-video-store";
import type { IHMSActions } from "@100mslive/hms-video-store/dist/core/IHMSActions";
import React, { useEffect, useMemo } from "react";

interface CallContextValue {
  store: IStoreReadOnly<HMSStore> | null;
  actions: IHMSActions | null;
  notifications: IHMSNotifications | null;
  statsStore?: HMSStatsStore;
}

export const CallContext = React.createContext<CallContextValue>({
  store: null,
  actions: null,
  notifications: null,
});

interface CallProviderProps {
  /**
   * Enable stats. Unused for the moment
   */
  isHMSStatsOn?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}

export const CallProvider: React.FC<CallProviderProps> = ({
  children,
  isHMSStatsOn: _ = false,
}) => {
  const hmsManager = useMemo<HMSReactiveStore>(
    () => new HMSReactiveStore(),
    []
  );

  const value = useMemo<CallContextValue>(() => {
    return {
      store: hmsManager.getStore(),
      actions: hmsManager.getActions(),
      notifications: hmsManager.getNotifications(),
    };
  }, [hmsManager]);

  useEffect(() => {
    hmsManager.triggerOnSubscribe();
  }, [hmsManager]);

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
