using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class LobbyCreateUI : MonoBehaviour
{
    [SerializeField] private Button closeButton;
    [SerializeField] private Button createPublicButton;
    [SerializeField] private Button createPrivateButton;
    [SerializeField] private TMP_InputField lobbyNameInputField;

    private void Awake()
    {
        string accountJson = PlayerPrefs.GetString("AccountData");
        Users account = JsonUtility.FromJson<Users>(accountJson);

        createPublicButton.onClick.AddListener(() => {
            ReqCreateRoom reqCreateRoom = new ReqCreateRoom();
            reqCreateRoom.type = "new";
            reqCreateRoom.title = lobbyNameInputField.text;
            reqCreateRoom.own = account._id;

            SocketManager.Instance.Emit("join-room", reqCreateRoom);
        });
        createPrivateButton.onClick.AddListener(() => {
            SocketManager.Instance.Emit("join-room", true);
        });
        closeButton.onClick.AddListener(() => {
            Hide();
        });
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
}
