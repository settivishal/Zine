"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
export function Room({ children, room_id }: { children: ReactNode; room_id: string }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_cQWz9jnBhOSyxt3EQ1VGy4_5FvGMX25m5dm6pS4BeiW7Vjl6ZlaaSmxoWfpfeHIf"}>
      <RoomProvider id={room_id}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}