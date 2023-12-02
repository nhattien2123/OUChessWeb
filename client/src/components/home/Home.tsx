import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import Sidebar from "src/share/sidebar/Sidebar";
import Header from "src/share/header/Header";

interface Props { }

const Home = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const friends = useAppSelector((state: RootState) => state.userReducer.friends);

    useEffect(() => {
        if (currentUser) {
            Cookies.set("user", JSON.stringify(currentUser));
        }
        console.log(currentUser, friends);
    }, [currentUser]);

    return (
        <>
            <Header />
            <Sidebar />
        </>
    );
};

export default Home;
