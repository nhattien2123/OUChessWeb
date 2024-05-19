using Players;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

public class SocketReceiver : MonoBehaviour
{
    public delegate void ConnectAction(string connectionID);
    public static event ConnectAction OnConnected;

    public delegate void DisconnectAction();
    public static event DisconnectAction OnDisconnected;

    public delegate void RoomCreatedAction(Room room);
    public static event RoomCreatedAction OnRoomCreated;

    public delegate void RoomJoinedAction(Room room);
    public static event RoomJoinedAction OnRoomJoined;

    public delegate void LeftRoomAction();
    public static event LeftRoomAction OnLeftRoom;

    public delegate void GotRoomListAction(Rooms rooms);
    public static event GotRoomListAction OnGotRoomList;

    public delegate void GotPlayerListAction(Player players);
    public static event GotPlayerListAction OnGotPlayerList;

    public delegate void RoomReadyAction();
    public static event RoomReadyAction OnRoomReady;

    public delegate void StartedGameAction();
    public static event StartedGameAction OnStartedGame;

    public delegate void ConnectionTimeoutAction();
    public static event ConnectionTimeoutAction OnConnectionTimeout;
}
