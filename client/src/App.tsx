import React, { useEffect } from "react";
import Router from "./routes/Routes";
import Cookies from "js-cookie";
import "./App.css";
import { useSockets } from "src/util/Socket";
import { socket } from "src";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

function App() {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token && currentUser) {
            socket.auth = {
                token: token,
                userInfo: currentUser,
            };
            socket.connect();
        }
        return;
    }, []);

    useSockets({ reset: () => {} });

    return (
        <>
            <Router></Router>
        </>
    );
}

export default App;
