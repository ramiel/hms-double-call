import { useContext, useState, useEffect } from "react";
import type { HMSStore, IStoreReadOnly } from "@100mslive/hms-video-store";
import type { IHMSActions } from "@100mslive/hms-video-store/dist/core/IHMSActions";
import { CallContext } from "../components/CallProvider";
import type { StateSelector } from "zustand";

export const useHMSStore = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error(
      "useHMSStore can only be used in descendants of CallProvider"
    );
  }
  return context.hmsStore as IStoreReadOnly<HMSStore>;
};

/**
 * Use a selector to get a slice of the state
 * @param selector The state slice selector
 * @returns T
 */
export const useHMSState = <T = unknown>(
  selector: StateSelector<HMSStore, T>
) => {
  const store = useHMSStore();
  const [value, setValue] = useState<T>();
  useEffect(() => {
    store.subscribe((v) => setValue(v), selector);
  }, [selector, store]);

  return value;
};

export const useHMSActions = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error(
      "useHMSActions can only be used in descendants of CallProvider"
    );
  }
  return context.hmsActions as IHMSActions;
};