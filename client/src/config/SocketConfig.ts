// import type { Socket, ServerOptions } from 'socket.io';
// import { Server } from 'socket.io';

// import type { MakeMoveClient } from 'src/share/game/board/Board';
// import type { MovingTo } from 'src/components/game/Game';
// import type { MessageClient } from '@/components/Chat';
// import type { JoinRoomClient } from '@/components/GameCreation';
// import type { Color } from '@/logic/pieces';
// import type { CameraMove } from '@/server/cameraMove';
// import { cameraMove } from 'src/services/cameraMove';
// import { disconnect } from '@/server/disconnect';
// import { fetchPlayers } from '@/server/fetchPlayers';
// import { joinRoom } from '@/server/joinRoom';
// import { makeMove } from '@/server/makeMove';
// import { resetGame } from '@/server/resetGame';
// import { sendMessage } from '@/server/sendMessage';
// import type { Message } from '@/state/player';

// import { cameraMove, disconnect, fetchPlayers, joinRoom, makeMove, resetGame, sendMessage } from 'src/services/socket/SocketServices';

// export interface SocketClientToServer {
//     createdMessage: (MessageClient: MessageClient) => void
//     joinRoom: (JoinRoomClient: JoinRoomClient) => void
//     makeMove: (MakeMoveClient: MakeMoveClient) => void
//     cameraMove: (CameraMove: CameraMove) => void
//     fetchPlayers: (Room: Room) => void
//     resetGame: (Room: Room) => void
//     playerLeft: (Room: Room) => void
//     disconnect: (Room: Room) => void
//     disconnecting: (Room: any) => void
//     error: (Room: any) => void
//     existingPlayer: (room: Room & { name: string }) => void
// }

// export interface SocketServerToClient {
//     newIncomingMessage: (MessageClient: Message) => void
//     playerJoined: (playerJoinedServer: playerJoinedServer) => void
//     moveMade: (movingTo: MovingTo) => void
//     cameraMoved: (CameraMove: CameraMove) => void
//     playersInRoom: (players: number) => void
//     gameReset: (data: boolean) => void
//     newError: (error: string) => void
//     joinRoom: (JoinRoomClient: JoinRoomClient) => void
//     playerLeft: (Room: Room) => void
//     clientExistingPlayer: (name: string) => void
// }

// export type MySocket = Socket<SocketClientToServer, SocketServerToClient>
// export type MyServer = Server<SocketClientToServer, SocketServerToClient>

const Example = () => {
    return;
}

export default Example;