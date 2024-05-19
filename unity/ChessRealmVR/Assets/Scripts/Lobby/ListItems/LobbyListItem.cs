using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using TMPro;

public class LobbyListItem : MonoBehaviour
{

    public TextMeshProUGUI roomName;
    public TextMeshPro roomPlayers;
    public Button joinRoomButton;

    public Room room;

    public void SetRoom(Room room)
    {
        this.room = room;

        roomName.text = room.title;
        roomPlayers.text = room.player.Count + "/2";

        //joinRoomButton.onClick.AddListener(() =>
        //{
        //    joinRoomButton.interactable = false;

        //    transform.parent.parent.GetComponent<LobbyPanelUI>().joinRoomLoading.SetActive(true);

        //    SocketSender.Send("JoinRoom", room.roomID);
        //});
    }

}

