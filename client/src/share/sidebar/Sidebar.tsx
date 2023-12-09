import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "src/redux/reducer/auth/AuthReducer";
import { userActions } from "src/redux/reducer/user/UserReducer";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { socket } from "src/index";
import logoIcon from "src/assets/images/chess-realm-logo.png";
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
            {/* <ul className="sidebar">
                <li className="sidebar-item">
                    <Link to={"/"}>Chess Realm</Link>
                </li>
                <li className="sidebar-item">
                    <Link to={"/play/online"}>Play</Link>
                </li>
                <li className="sidebar-item">
                    <Link to={`/profile/${currentUser.username}`}>Thông tin</Link>
                </li>
                <li className="sidebar-item">
                    <Link to={"/messages"}>Tin nhắn</Link>
                </li>
                {currentUser.role === "ADMIN" && (
                    <li className="sidebar-item">
                        <Link to={"/admin"}>Admin</Link>
                    </li>
                )}
                <li className="sidebar-input">
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
                {currentUser._id === "" ? (
                    <>
                        <li className="sidebar-btn">
                            <Link to={`/register`} className="btn-form w-80">
                                Đăng ký
                            </Link>
                        </li>
                        <li className="sidebar-btn">
                            <Link to={`/login`} className="btn-form btn-form-save w-80">
                                Đăng nhập
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="sidebar-btn">
                            <Link to={`/login`} className="btn-form w-80 btn-form-save" onClick={logOut}>
                                Đăng xuất
                            </Link>
                        </li>
                    </>
                )}
            </ul> */}
            {/* <nav className="sidebar">
                <header>
                    <div className="sidebar-image-text">
                        <span className="sidebar-image">
                            <img src="logo.png" alt="logo" />
                        </span>

                        <div className="text header-text">
                            <span className="name">CodingLab</span>
                            <span className="profession">Web developer</span>
                        </div>
                    </div>

                    <i className="bx bx-chevron-right toggle"></i>
                </header>
                <div className="menu-bar">
                    <div className="menu">
                        <li className="search-box">
                            <i className="bx bx-search icon"></i>
                            <input type="search" placeholder="Search..." />
                        </li>
                        <ul className="menu-links">
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="bottom-content">
                        <li className="">
                            <a href="#">
                                <i className="bx bx-log-out icon"></i>
                                <span className="text nav-text">Logout</span>
                            </a>
                        </li>

                        <li className="mode">
                            <div className="moon-sun">
                                <i className="bx bx-moon icon"></i>
                                <i className="bx bx-sun icon"></i>
                            </div>
                            <span className="mode-text text">Dark Mode</span>

                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li>
                    </div>
                </div>
            </nav>
            <script></script> */}
            <nav className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
                <header>
                    <Link to={"/"}>
                        <div className="image-text">
                            <span className="image">
                                <img src={logoIcon} alt="Logo Chess Realm" />
                            </span>
                            <div className="text logo-text">
                                <span className="name">Chess Realm</span>
                                <span className="profession">Made by SupportX</span>
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
                                    <i className="fa-solid fa-chess-board"></i>
                                    <span className="text nav-text">Play</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to={`/profile/${currentUser.username}`} className="nav-link-contain">
                                    <i className='bx bx-bell icon'></i>
                                    <span className="text nav-text">Information</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to={"/messages"} className="nav-link-contain">
                                    <i className='bx bx-bell icon'></i>
                                    <span className="text nav-text">Message</span>
                                </Link>
                            </li>
                            {currentUser.role === "ADMIN" && (
                                <li className="nav-link">
                                    <Link to={"/admin"} className="nav-link-contain">
                                        <i className='bx bx-bell icon'></i>
                                        <span className="text nav-text">Management</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="bottom-content">
                        <li className="">
                            {currentUser._id === "" ? (
                                <>
                                    <li className="sidebar-btn">
                                        <Link to={`/register`} className="btn-form w-80 nav-link-contain">
                                            Đăng ký
                                        </Link>
                                    </li>
                                    <li className="sidebar-btn">
                                        <Link to={`/login`} className="btn-form btn-form-save w-80 nav-link-contain">
                                            Đăng nhập
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <Link to={`/login`} className="btn-form w-80 btn-form-save nav-link-contain" onClick={logOut}>
                                        <i className='bx bx-log-out icon'></i>
                                        <span className="text nav-text">Logout</span>
                                    </Link>
                                </>
                            )}
                        </li>
                        <li className="mode" onClick={toggleDarkMode}>
                            <div className="sun-moon">
                                <i className={`bx ${isDarkMode ? 'bx-sun' : 'bx-moon'} icon moon`}></i>
                                <i className={`bx ${isDarkMode ? 'bx-moon' : 'bx-sun'} icon sun`}></i>
                            </div>
                            <span className="mode-text text">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </li>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;
