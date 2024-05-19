using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;
using ChessPieces;
using System;
using Unity.VisualScripting;

public class LobbyPanelUI : MonoBehaviour
{

    public Transform roomList;
    //[SerializeField] private Button refreshButton;2
    //[SerializeField] private InputField roomNameInput;
    //[SerializeField] private Button createRoomButton;
    //[SerializeField] private LobbyCreateUI lobbyCreateUI;


    //[SerializeField] private GameObject createRoomLoading;
    //[SerializeField] private GameObject joinRoomLoading;
    //[SerializeField] private GameObject fetchRoomListLoading;

    public LobbyListItem lobbyListItemPrefab;
    private LobbyListItem roomListItem;
    private LobbyListItem[] roomListItems;

    //public string defaultRoomName = "RoomName";

    private void Awake()
    {
        //roomListTest = FindObjectOfType<>;
    }

    void Start()
    {
        //roomNameInput.text = defaultRoomName;
        string accountJson = PlayerPrefs.GetString("AccountData");
        Users account = JsonUtility.FromJson<Users>(accountJson);
        roomListItems = roomList.GetComponentsInChildren<LobbyListItem>();
        roomList = GameObject.Find("LobbyListContainer").transform;
        lobbyListItemPrefab = GameObject.Find("LobbyListItem").GetComponent<LobbyListItem>();
        roomListItem = Instantiate(lobbyListItemPrefab) as LobbyListItem;
        roomListItem.transform.SetParent(roomList, false);
        //createRoomButton.onClick.AddListener(() =>
        //{
        //    roomNameInput.interactable = false;
        //    createRoomButton.interactable = false;

        //    createRoomLoading.SetActive(true);

        //    //SocketSender.Send("CreateRoom", roomNameInput.text == "" ? defaultRoomName : roomNameInput.text);
        //    lobbyCreateUI.Show();
        //});

        //refreshButton.onClick.AddListener(() =>
        //{
        //    refreshButton.interactable = false;

        //    fetchRoomListLoading.SetActive(true);

        //    SocketManager.Instance.Emit("get-rooms");
        //});

        //fetchRoomListLoading.SetActive(true);
        //SocketManager.Instance.Emit("get-rooms");
    }

    void OnEnable()
    {
        //SocketManager.Instance.OnRoomCreated += OnRoomCreated;
        //SocketManager.Instance.OnRoomJoined += OnRoomJoined;
        SocketManager.Instance.OnRoomListReceived += OnGotRoomList;
    }

    void OnDisable()
    {
        //SocketManager.Instance.OnRoomCreated -= OnRoomCreated;
        //SocketManager.Instance.OnRoomJoined -= OnRoomJoined;
        SocketManager.Instance.OnRoomListReceived -= OnGotRoomList;
    }

    void OnGotRoomList(Rooms rooms)
    {
        //foreach (Transform child in roomList)
        //{
        //    Destroy(child.gameObject);
        //}

        //var thread = System.Threading.Thread(CreateRoomListItems(rooms));
        //thread.Start();
        //
        CreateRoomListItems(rooms);

        //fetchRoomListLoading.SetActive(false);
        //refreshButton.interactable = true;
    }

    //void OnRoomCreated(List<Room> room)
    //{
    //    LobbyGameManager.Instance.SetRoom(room);
    //}

    //void OnRoomJoined(ResResultJoinRoom room)
    //{
    //    LobbyGameManager.Instance.SetRoom(room);
    //}

    public void CreateRoomListItems(Rooms rooms)
    { 
        Debug.Log("test");
        Debug.Log(rooms.rooms[0].title);
        Debug.Log(roomListItems);
        Debug.Log("Tét12312");
        //if (roomListItems != null)
        //{
        //    Debug.Log("Test1");
        //    for (int i = 0; i < roomListItems.Length; i++)
        //    {
        //        bool remain = false;

        //        for (int j = 0; j < rooms.rooms.Count; j++)
        //        {
        //            if (roomListItems[i].room.id == rooms.rooms[j].id)
        //            {
        //                remain = true;
        //                break;
        //            }
        //        }

        //        if (!remain)
        //        {
        //            GameObject.Destroy(roomListItems[i].gameObject);
        //        }
        //    }
        //}

        if (roomListItems != null)
        {
            for (int i = 0; i < roomListItems.Length; i++)
            {
                GameObject.Destroy(roomListItems[i].gameObject);
            }
        }

        try
        {
            for (int i = 0; i < rooms.rooms.Count; i++)
            {
                Debug.Log("Test2");
                //LobbyListItem roomListItem = null;

                if (roomListItems != null)
                {
                    for (int j = 0; j < roomListItems.Length; j++)
                    {
                        if (roomListItems[j].room.id == rooms.rooms[i].id)
                        {
                            roomListItem = roomListItems[j];
                            break;
                        }
                    }
                }
                //try
                //{
                //    if (roomListItem == null)
                //    {
                //        roomListItem = lobbyListItemPrefab;
                //    }
                //}
                //catch (Exception e)
                //{
                //    Debug.Log(e.Message);
                //}
                //roomListItem.transform.SetParent(roomList, false);

                roomListItem.SetRoom(rooms.rooms[i]);
            }

            //catch (Exception e)
            //{
            //    Debug.Log(e.Message);
            //}
            //GameObject lobbyItem = Instantiate(lobbyListItemObj, roomListObj);
            //Debug.Log(lobbyItem);
            //foreach (Room room in rooms.rooms)
            //{
            //    lobbyItem.GetComponent<LobbyListItem>().SetRoom(room);
            //}
        }
        catch (Exception e)
        {
            Debug.Log(e.Message);
        }
    }
}

