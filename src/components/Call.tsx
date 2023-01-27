import { HMSRoomState, selectRoomState } from "@100mslive/hms-video-store";
import { Button, Stack, Text } from "@mantine/core";
import { useHMSActions, useHMSState } from "../hooks/useCall";

export const Call: React.FC<{
  roomName?: string;
  name: string;
  token: string;
}> = ({ name, token, roomName }) => {
  const hmsActions = useHMSActions();
  const roomState = useHMSState(selectRoomState);

  return (
    <Stack>
      <Text>
        <>
          {roomName} Room {roomState}
        </>
      </Text>
      {roomState === HMSRoomState.Disconnected ? (
        <Button
          onClick={() => {
            hmsActions
              .join({
                userName: name,
                authToken: token,
              })
              .catch((e) => {
                console.error(e);
              });
          }}
        >
          join
        </Button>
      ) : null}
      {roomState === HMSRoomState.Connected ? (
        <Button
          onClick={() => {
            hmsActions.leave().catch((e) => console.error(e));
          }}
        >
          Leave
        </Button>
      ) : null}
    </Stack>
  );
};
