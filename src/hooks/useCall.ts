import { useContext, useState, useEffect, useRef } from "react";
import type {
  HMSNotificationInCallback,
  HMSNotificationTypeParam,
  HMSStore,
  IStoreReadOnly,
} from "@100mslive/hms-video-store";
import { selectVideoTrackByID } from "@100mslive/hms-video-store";
import type { IHMSActions } from "@100mslive/hms-video-store/dist/core/IHMSActions";
import { CallContext } from "../components/CallProvider";
import type { StateSelector, EqualityChecker } from "zustand";
import shallow from "zustand/shallow";

export const useHMSStore = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error(
      "useHMSStore can only be used in descendants of CallProvider"
    );
  }
  return context.store as IStoreReadOnly<HMSStore>;
};

/**
 * Use a selector to get a slice of the state
 * @param selector The state slice selector
 * @returns T
 */
export const useHMSState = <T = unknown>(
  selector: StateSelector<HMSStore, T>,
  equalityFn: EqualityChecker<T> = shallow
) => {
  const store = useHMSStore();
  const [value, setValue] = useState<T>();
  useEffect(() => {
    store.subscribe((v) => setValue(v), selector, equalityFn);
  }, [equalityFn, selector, store]);

  return value;
};

/*
 * `useHMSActions` is a write ony hook which can be used to dispatch actions.
 */
export const useHMSActions = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error(
      "useHMSActions can only be used in descendants of CallProvider"
    );
  }
  return context.actions as IHMSActions;
};

/**
 * `useHMSNotifications` is a read only hook which gives the latest notification(HMSNotification) received.
 */
export const useHMSNotifications = <T extends HMSNotificationTypeParam>() => {
  const context = useContext(CallContext);
  const [notification, setNotification] =
    useState<HMSNotificationInCallback<T> | null>(null);

  if (!context) {
    throw new Error(
      "useHMSNotifications can only be used in descendants of CallProvider"
    );
  }

  useEffect(() => {
    if (!context.notifications) {
      return;
    }
    const unsubscribe = context.notifications.onNotification<T>(
      (notification) => setNotification(notification)
    );
    return unsubscribe;
  }, [context.notifications]);

  return notification;
};

export const useVideo = (trackId: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const store = useHMSStore();
  const hmsActions = useHMSActions();

  useEffect(() => {
    store.subscribe((track) => {
      if (!track || !videoRef.current) {
        return;
      }
      if (track.enabled) {
        hmsActions
          .attachVideo(track.id, videoRef.current)
          .catch((e) => console.error(e));
      } else {
        hmsActions
          .detachVideo(track.id, videoRef.current)
          .catch((e) => console.error(e));
      }
    }, selectVideoTrackByID(trackId));
  });

  return { videoRef };
};
