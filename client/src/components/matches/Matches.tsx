import { useEffect, useState } from "react";
import { RootState } from "src/app/store";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RoomListComponent } from "src/share/roomList/RoomList";
import Sidebar from "src/share/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { Match } from "src/redux/reducer/match/Types";

interface Props { }

const Matches = (props: Props) => {
    const matchState = useAppSelector((state: RootState) => state.matchReducer.match);
    const [newMatch, setNewMatch] = useState<Match>({
        _id: "",
        whiteId: null,
        blackId: null,
        matchName: "",
        state: null,
        mode: "",
    });
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    useEffect(() => {
        dispatch(matchActions.reqGetMatch({}));
    }, []);

    return (<>
        <Sidebar />
        <div className="content">
            <RoomListComponent
                match={matchState}
                newMatch={newMatch}
                setNewMatch={setNewMatch}
            />
        </div>
    </>);
}

export default Matches;