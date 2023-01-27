import type { HMSStore, IStoreReadOnly } from "@100mslive/hms-video-store";
import { HMSReactiveStore } from "@100mslive/hms-video-store";
import type { IHMSActions } from "@100mslive/hms-video-store/dist/core/IHMSActions";
import React, { useEffect, useMemo } from "react";

export const CallContext = React.createContext<{
  hmsStore: IStoreReadOnly<HMSStore> | null;
  hmsActions: IHMSActions | null;
}>({
  hmsStore: null,
  hmsActions: null,
});

interface CallProviderProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const hmsManager = useMemo(() => {
    return new HMSReactiveStore();
  }, []);

  useEffect(() => {
    hmsManager.triggerOnSubscribe();
  }, [hmsManager]);

  return (
    <CallContext.Provider
      value={{
        hmsStore: hmsManager.getStore(),
        hmsActions: hmsManager.getActions(),
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
