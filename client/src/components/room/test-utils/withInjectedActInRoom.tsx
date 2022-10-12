import { FC, ComponentType, PropsWithChildren } from "react";
import { useActInRoom, ActInRoomMutation } from "../../../queries/poker-rooms";

/**
 * High order component that given a roomId and a component that has an
 * actInRoom prop representing an ActInRoomMutation, returns a new component
 * identical to the given compnent where the actInRoom prop has been
 * automatically injected with the appropraite ActInRoomMutation for roomId.
 *
 * @param roomId a roomId
 * @param Component a component that has an actInRoom prop representing an
 *   ActInRoomMutation
 * @returns a new component identical to the given compnent where the actInRoom
 *   prop has been automatically injected with the appropraite ActInRoomMutation
 *   for roomId.
 */
const withInjectedActInRoom = <P extends { actInRoom: ActInRoomMutation }>(
  roomId: string,
  Component: ComponentType<P>
) => {
  const WrappedComponent: FC<Omit<P, "actInRoom">> = (props) => {
    const actInRoom = useActInRoom(roomId);
    const propsWithInjectedActInRoom = {
      ...props,
      actInRoom,
    } as PropsWithChildren<P>;
    return <Component {...propsWithInjectedActInRoom} />;
  };
  return WrappedComponent;
};

export default withInjectedActInRoom;
