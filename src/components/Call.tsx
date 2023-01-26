import {
  HMSRoomState,
  selectRoomState,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Button, Stack, Text } from "@mantine/core";

export const Call: React.FC<{
  roomName?: string;
  name: string;
  token: string;
}> = ({ name, token, roomName }) => {
  const hmsActions = useHMSActions();
  const roomState = useHMSStore(selectRoomState);

  return (
    <Stack>
      <Text>
        {roomName} Room {roomState}
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
