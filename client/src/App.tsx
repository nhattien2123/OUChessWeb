import React, { useEffect } from "react";
import Router from "./routes/Routes";
import Cookies from "js-cookie";
import "./App.css";
import { useSockets } from "src/util/Socket";
import { socket } from "src";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { useNavigate } from "react-router-dom";

function App() {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);

    useEffect(() => {
        const token = Cookies.get("token");
        const detail = Cookies.get("room");

        if (token && currentUser) {
            socket.auth = {
                token: token,
                userInfo: currentUser,
                type: "Web"
            };

            socket.connect();

            // if (detail) {
            //     socket.emit("reconnect", JSON.parse(detail));
            // }
        }
        return;
    }, [currentUser]);

    useSockets()

    return (
        <>
            <Router></Router>
        </>
    );
}

export default App;
