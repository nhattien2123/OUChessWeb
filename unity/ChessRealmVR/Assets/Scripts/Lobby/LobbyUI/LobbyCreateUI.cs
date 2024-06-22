using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using Unity.Collections.LowLevel.Unsafe;
using UnityEditor.SearchService;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using static LobbyManager;

public class LobbyCreateUI : MonoBehaviour
{
    [SerializeField] private Button closeButton;
    [SerializeField] private Button createPublicButton;
    [SerializeField] private Button createPrivateButton;
    [SerializeField] private TMP_InputField lobbyNameInputField;
    [SerializeField] private SocketIOComponent socket;
    [SerializeField] private RadioButtonSystem radioButtonSystem;

    private void Awake()
    {
        string accountJson = PlayerPrefs.GetString("AccountData");
        Users account = JsonUtility.FromJson<Users>(accountJson);

        createPublicButton.onClick.AddListener(() =>
        {
            JObject reqCreateRoom = new JObject();
            reqCreateRoom["type"] = "new";
            reqCreateRoom["title"] = lobbyNameInputField.text;
            reqCreateRoom["room"] = account._id;
            reqCreateRoom["color"] = radioButtonSystem.GetValue();

            socket.Emit("join-room", reqCreateRoom);
            SceneManager.LoadScene("Multiplayer VR Chess");
        });

        createPrivateButton.onClick.AddListener(() =>
        {
            socket.Emit("join-room", true);
        });

        closeButton.onClick.AddListener(() =>
        {
            Hide();
        });
    }

    private void OnRoomCreated(ReqRoomCreated room)
    {
        
        socket.Emit("join-room");
    }

    private void Start()
    {
        Hide();
    }

    public void Show()
    {
        gameObject.SetActive(true);
        createPublicButton.Select();
    }

    private void Hide()
    {
        gameObject.SetActive(false);
    }

    [Serializable]
    public class ReqRoomCreated
    {
        public string type { get; set; }
        public string title { get; set; }
        public string id { get; set; }
        public int color { get; set; }
    }
}
