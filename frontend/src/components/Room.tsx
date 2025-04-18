"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY!;

if (!publicApiKey) {
  throw new Error("Missing NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY");
}

export function Room({ children, room_id }: { children: ReactNode; room_id: string }) {
  return (
    <LiveblocksProvider publicApiKey={publicApiKey}>
      <RoomProvider id={room_id}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}