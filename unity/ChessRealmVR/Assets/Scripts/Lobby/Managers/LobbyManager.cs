using Newtonsoft.Json.Linq;
using PimDeWitte.UnityMainThreadDispatcher;
using SocketIOClient;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using static NetworkManager;
using static SocketReceiver;

public class LobbyManager : MonoBehaviour
{

    public SocketReceiver socketReceiver;
    public static LobbyManager instance;

    void Awake()
    {
        if (instance == null)
            instance = this;
        else if (instance != this)
            Destroy(gameObject);
        DontDestroyOnLoad(gameObject);
    }

    void Start()
    {
        if (SocketIOComponent.Instance != null)
        {
            SocketIOComponent.Instance.OnConnectedEvent += OnSocketConnected;
        }
        else
        {
            Debug.LogError("SocketIOComponent instance is null");
        }
        //SocketIOComponent.Instance.On("rep-get-rooms", OnRoomListReceived);
    }

    private void OnSocketConnected(object sender, EventArgs e)
    {
        SocketIOComponent.Instance.On("rep-get-rooms", OnRoomListReceived);
    }

    public void OnRoomListReceived(SocketIOResponse socketIOResponse)
    {
        UnityMainThreadDispatcher.Instance().Enqueue(() =>
        {
            Debug.Log(socketIOResponse);
            ListRoomJSON data = socketIOResponse.GetValue<ListRoomJSON>();
            socketReceiver.SocketGotRoomList(data);
        });
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    [Serializable]
    public class ListRoomJSON : List<Room> { }

    public class Room
    {
        public string id { get; set; }
        public string title { get; set; }
        public List<Player> player { get; set; }
    }

    public class Player
    {
        public string _id { get; set; }
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string email { get; set; }
        public long phone { get; set; }
        public string nation { get; set; }
        public string avatar { get; set; }
        public int elo { get; set; }
        public string role { get; set; }
        public DateTime updatedAt { get; set; }
        public int color { get; set; }
    }
}
