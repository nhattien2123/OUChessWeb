import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import Sidebar from "src/share/sidebar/Sidebar";
import { socket } from "src";

interface Props { }

const Home = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const token = useAppSelector((state: RootState) => state.authReducer.token);

    useEffect(() => {
        if (currentUser) {
            Cookies.set("user", JSON.stringify(currentUser));
        }
        socket.auth = {
            token: token,
            userInfo: currentUser
        };
        
        socket.connect();
    }, [currentUser, token]);

    return (
        <>
            <Sidebar />
        </>
    );
};

export default Home;
