import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import Sidebar from "src/share/sidebar/Sidebar";
import Header from "src/share/header/Header";
import { socket } from "src";

interface Props {}

const Home = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const friends = useAppSelector((state: RootState) => state.userReducer.friends);

    useEffect(() => {
        if (currentUser) {
            Cookies.set("user", JSON.stringify(currentUser));
        }
        
        // socket.auth = {
        //     token: token,
        //     userInfo: currentUser,
        //     type: "Web"
        // };

        // socket.connect();
    }, [currentUser]);

    return (
        <>
            <div style={{ width: "100%", height: "100vh", backgroundColor: "#312e2b" }}>
                <Sidebar />
            </div>
        </>
    );
};

export default Home;
