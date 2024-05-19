import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "src/redux/reducer/auth/AuthReducer";
import { userActions } from "src/redux/reducer/user/UserReducer";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { socket } from "src/index";
import logoIcon from "src/assets/images/chess-realm-logo-2.png";
import "src/share/sidebar/Sidebar.scss";

interface Props { }

const Sidebar = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const [kw, setKw] = useState<string>("");
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const logOut = () => {
        Cookies.remove("user");
        Cookies.remove("token");
        socket.auth = {
            token: "",
        };
        socket.disconnect();
        socket.connect();
        dispatch(authActions.reqLogOut({}));
        dispatch(userActions.clearUser({}));
    };

    // const body = document.querySelector("body");
    // const sidebar = body.querySelector(".sidebar");
    // const toggle = body.querySelector(".toggle");
    // const searchBtn = body.querySelector(".search-box");
    // const modeSwitch = body.querySelector(".toggle-switch");
    // const modeText = body.querySelector(".mode-text");

    // toggle.addEventListener("click", () => {
    //     sidebar.classList.toggle("close");
    // });

    // searchBtn?.addEventListener("click", () => {
    //     sidebar.classList.remove("close");
    // });

    // modeSwitch.addEventListener("click", () => {
    //     body.classList.toggle("close");

    //     if (body?.classList.contains("dark")) {
    //         modeText.innerText = "Light Mode";
    //     } else {
    //         modeText.innerText = "Dark Mode";
    //     }
    // });

    const [isSidebarClosed, setIsSidebarClosed] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarClosed(!isSidebarClosed);
    };

    const openSearchBox = () => {
        setIsSidebarClosed(false);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            
            <nav className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
                <header>
                    <Link to={"/"} className="link-container">
                        <div className="image-text">
                            <span className="image">
                                <img src={logoIcon} alt="Logo Chess Realm" style={{backgroundColor: "transparent"}} />
                            </span>
                            <div className="text logo-text">
                                <span style={isSidebarClosed ? {display: "none"} : {display: "inline-block"}} className="name">Chess Realm</span>
                                <span style={isSidebarClosed ? {display: "none"} : {display: "inline-block"}} className="profession">Made by SupportX</span>
                            </div>
                        </div>
                    </Link>
                    <i className='bx bx-chevron-right toggle' onClick={toggleSidebar}></i>
                </header>
                <div className="menu-bar">
                    <div className="menu">
                        <li className="search-box" onClick={openSearchBox}>
                            <i className='bx bx-search icon'></i>
                            <input
                                placeholder="Tìm kiếm..."
                                onChange={(evt) => setKw(evt.target.value)}
                                onKeyDown={(evt) => {
                                    if (evt.key === "Enter") {
                                        if (kw.trim() !== "") {
                                            nav(`/player/?kw=${kw}`);
                                        }
                                    }
                                }}
                            ></input>
                        </li>
                        <ul className="menu-links">
                            <li className="nav-link">
                                <Link to={"/play/online"} className="nav-link-contain">
                                    <i className="fa-solid fa-chess-board icon"></i>
                                    <span className="text nav-text">Chơi</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to={"/tutorial"} className="nav-link-contain">
                                    <i className="fa-solid fa-book icon"></i>
                                    <span className="text nav-text">Hướng dẫn</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to={`/profile/${currentUser.username}`} className="nav-link-contain">
                                    <i className="fa-solid fa-user icon"></i>
                                    <span className="text nav-text">Thông tin</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to={"/messages"} className="nav-link-contain">
                                    <i className="fa-regular fa-message icon"></i>
                                    <span className="text nav-text">Tin nhắn</span>
                                </Link>
                            </li>
                            {currentUser.role === "ADMIN" && (
                                <li className="nav-link">
                                    <Link to={"/admin"} className="nav-link-contain">
                                        <i className="fa-solid fa-user-tie icon"></i>
                                        <span className="text nav-text">Quản trị</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="bottom-content">
                        {currentUser._id === "" ? (
                            <>
                                <li className="sidebar-btn">
                                    <Link to={`/register`} className="nav-link-contain">
                                        Đăng ký
                                    </Link>
                                </li>
                                <li className="sidebar-btn">
                                    <Link to={`/login`} className="nav-link-contain">
                                        Đăng nhập
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-link">
                                <Link to={`/login`} className="nav-link-contain" onClick={logOut}>
                                    <i className='bx bx-log-out icon'></i>
                                    <span className="text nav-text">Đăng xuất</span>
                                </Link>
                            </li>
                        )}
                        {/* <li className="mode" onClick={toggleDarkMode}>
                            <div className="sun-moon">
                                <i className={`bx ${isDarkMode ? 'bx-sun' : 'bx-moon'} icon moon`}></i>
                                <i className={`bx ${isDarkMode ? 'bx-moon' : 'bx-sun'} icon sun`}></i>
                            </div>
                            <span className="mode-text text">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li> */}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
