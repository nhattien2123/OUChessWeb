using Newtonsoft.Json.Linq;
using SocketIOClient.Newtonsoft.Json;
using SocketIOClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;
using System.Net.Sockets;

public class SocketIOComponent : MonoBehaviour
{
    private static SocketManager instance;
    private SocketIOUnity socket;
    [Header("Components")]
    [SerializeField] private string _authHost = "http://localhost:8080";

    private void Awake()
    {
        var uri = new Uri(_authHost);
        socket = new SocketIOUnity(uri, new SocketIOOptions
        {
            Query = new Dictionary<string, string>
            {
                {"token", "UNITY" }
            },
            EIO = 4,
            Transport = SocketIOClient.Transport.TransportProtocol.WebSocket
        });
        socket.JsonSerializer = new NewtonsoftJsonSerializer();

        socket.OnConnected += (sender, e) =>
        {
            Debug.Log("Connected");
        };
        
        socket.Connect();
    }

    //public static SocketManager Instance
    //{
    //    get
    //    {
    //        if (instance == null)
    //        {
    //            instance = FindObjectOfType<SocketManager>();
    //            if (instance == null)
    //            {
    //                GameObject obj = new GameObject();
    //                obj.name = "SocketManager";
    //                instance = obj.AddComponent<SocketManager>();
    //                DontDestroyOnLoad(obj);
    //            }
    //        }
    //        return instance;
    //    }
    //}

    public void Emit(string eventName)
    {
        //Debug.Log(socket);
        socket.Emit(eventName);
    }

    public void Emit(string eventName, object parameter)
    {
        Debug.Log("Test Emit");
        socket.Emit(eventName, parameter);
    }

    public void On(string eventName, Action<SocketIOResponse> socketIOResponse)
    {
        Debug.Log("test" + " " + socket);
        socket.On(eventName, socketIOResponse);
    }

    public void Disconnect()
    {
        socket.Disconnect();
    }

    // Add other socket-related methods as needed
}

