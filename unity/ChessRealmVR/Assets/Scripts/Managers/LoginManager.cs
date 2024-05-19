using System.Collections;
using System.Collections.Generic;
using System;
using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
using UnityEditor.SearchService;
using UnityEngine.SceneManagement;

public class LoginManager : MonoBehaviour
{
    [Header("Components")]
    [SerializeField] private TextMeshProUGUI _descLabel;
    [SerializeField] private TMP_InputField _nameInput;
    [SerializeField] private TMP_InputField _passwordInput;
    [SerializeField] private Button _loginButton;
    [SerializeField] private Button _registerButton;

    [Header("Parameters")]
    [SerializeField] private string _authHost = "http://localhost:8080";
    [SerializeField] private string _authLoginRoute = "/auth/authapi-signin";
    [SerializeField] private string _authRegisterRoute = "/auth/authapi-signup";
    [SerializeField] private int _authPort = 8080;

    private void Awake()
    {
        _loginButton.onClick.AddListener(() => {
            StartCoroutine(CoroTrySubmitInfo());
        });

        _registerButton.onClick.AddListener(() => {
            StartCoroutine(CoroTryRegister());
        });
    }

    IEnumerator Login(string url, string bodyJsonString)
    {
        var request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(bodyJsonString);
        request.uploadHandler = (UploadHandler)new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        yield return request.SendWebRequest();
        Debug.Log("Status Code: " + request.responseCode);
        if (request.responseCode == 200)
        {
            if (true)
            {
                var account = JsonUtility.FromJson<Users>(request.downloadHandler.text);
                PlayerPrefs.SetString("UserAccount", JsonUtility.ToJson(account));
                SetButtonsEnabled(true);
                SceneManager.LoadScene("Main VR Chess");
            }
            else
            {
                _descLabel.text = "Login failed";
                _loginButton.interactable = false;
            }

            Debug.Log(request.downloadHandler.text);
        }
        else
        {
            _descLabel.text = "Connection error";
            SetButtonsEnabled(true);
            Debug.Log("Connection error");
        }
    }

    private IEnumerator CoroTrySubmitInfo()
    {

        _descLabel.text = "Signing in...";

        var username = _nameInput.text;
        var password = _passwordInput.text;

        if (username.Length < 3 || password.Length < 3)
        {
            _descLabel.text = "Invalid credentials";
            yield break;
        }

        SetButtonsEnabled(false);

        Users userAccount = new Users();
        userAccount.username = username;
        userAccount.password = password;
        string bodyJsonString = JsonUtility.ToJson(userAccount);
        Debug.Log(bodyJsonString);

        var href = GetFullHref(_authLoginRoute);

        var form = new WWWForm();
        form.AddField("username", username);
        form.AddField("password", password);

        StartCoroutine(Login(href, bodyJsonString));

        //var handlerTime = 0f;
        //while (handler.isDone == false) {
        //    handlerTime += Time.deltaTime;

        //    if (handlerTime > 3) {
        //        break;
        //    } 

        //    yield return null;
        //}

        //if (request.result == UnityWebRequest.Result.Success) {
        //    if (true) {

        //        var account = JsonUtility.FromJson<UserAccount>(request.downloadHandler.text);

        //        _descLabel.text = account._id + "Welcome " + account.username;
        //        SetButtonsEnabled(true);

        //    } else {
        //        _descLabel.text = "Login failed";
        //        _loginButton.interactable = false;
        //    }

        //    Debug.Log(request.downloadHandler.text);

        //} else {
        //    _descLabel.text = "Connection error";
        //    SetButtonsEnabled(true);
        //    Debug.Log("Connection error");
        //}
    }

    private IEnumerator CoroTryRegister()
    {

        //SetButtonsEnabled(false);

        //_descLabel.text = "Registering in...";

        //var username = _nameInput.text;
        //var password = _passwordInput.text;

        //if (username.Length < 3 || password.Length < 3)
        //{
        //    _descLabel.text = "Invalid credentials";
        //    yield break;
        //}

        //SetButtonsEnabled(false);

        //var href = GetFullHref(_authRegisterRoute);

        //var form = new WWWForm();
        //form.AddField("username", username);
        //form.AddField("password", password);

        //var request = UnityWebRequest.Post(href, form);
        //var handler = request.SendWebRequest();

        //var handlerTime = 0f;
        //while (handler.isDone == false)
        //{
        //    handlerTime += Time.deltaTime;

        //    if (handlerTime > 3)
        //    {
        //        break;
        //    }

        //    yield return null;
        //}

        //if (request.result == UnityWebRequest.Result.Success)
        //{
        //    if (true)
        //    {

        //        Debug.Log(request.downloadHandler);

        //        var account = JsonUtility.FromJson<Users>(request.downloadHandler.text);

        //        Debug.Log(account.ToString());

        //        //_descLabel.text = account._id + "Welcome " + account.username;
        //        _descLabel.text = "Successfully register " + account._id;
        //        SetButtonsEnabled(true);

        //    }
        //    else
        //    {
        //        _descLabel.text = "Login failed";
        //        _loginButton.interactable = false;
        //    }

        //    Debug.Log(request.downloadHandler.text);

        //}
        //else
        //{
        //    _descLabel.text = "Connection error";
        //    SetButtonsEnabled(true);
        //    Debug.Log("Connection error");
        //}
        return null; //When uncomment, delete this
    }

    private void SetButtonsEnabled(bool flag)
    {
        _loginButton.interactable = flag;
        _registerButton.interactable = flag;
    }

    private string GetFullHref(string route)
    {
        return _authHost + ":" + _authPort + route;
    }
}
