import type { HMSStore, IStoreReadOnly } from "@100mslive/hms-video-store";
import { HMSReactiveStore } from "@100mslive/hms-video-store";
import type { IHMSActions } from "@100mslive/hms-video-store/dist/core/IHMSActions";
import React, { useEffect, useMemo } from "react";

interface CallContextValue {
  hmsStore: IStoreReadOnly<HMSStore> | null;
  hmsActions: IHMSActions | null;
}

export const CallContext = React.createContext<CallContextValue>({
  hmsStore: null,
  hmsActions: null,
});

interface CallProviderProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const hmsManager = useMemo<HMSReactiveStore>(
    () => new HMSReactiveStore(),
    []
  );

  const value = useMemo<CallContextValue>(
    () => ({
      hmsStore: hmsManager.getStore(),
      hmsActions: hmsManager.getActions(),
    }),
    [hmsManager]
  );

  useEffect(() => {
    hmsManager.triggerOnSubscribe();
  }, [hmsManager]);

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
