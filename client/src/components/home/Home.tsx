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

    useEffect(() => {
        if (currentUser) {
            Cookies.set("user", JSON.stringify(currentUser));
        }
    }, [currentUser]);

    return (
        <>
            {!currentUser && <div>Loading....</div>}
            {currentUser && (
                <div style={{ width: "100%", height: "100vh", backgroundColor: "#312e2b" }}>
                    <Sidebar />
                </div>
            )}
        </>
    );
};

export default Home;
