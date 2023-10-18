import Cookies from 'js-cookie';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import 'src/components/admin/Admin.scss';
import { userDataForm } from 'src/redux/reducer/admin/Types';
import { adminActions } from 'src/redux/reducer/admin/adminReducer';
import { registerState } from 'src/redux/reducer/register/Types';
import AdminAddUserForm from 'src/share/form/AdminAddUserForm';
import { registerData } from 'src/share/form/RegisterForm';
type Props = object;

const defaultUser: userDataForm = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nation: '',
    avatar: '',
    elo: 500,
    file: undefined,
};

const Admin = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const userList = useAppSelector((state: RootState) => state.adminReducer.userList);
    const isLoadding = useAppSelector((state: RootState) => state.adminReducer.isLoading);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [p] = useSearchParams();
    const [kw, setKw] = useState<string>('');
    const [add, setAddActive] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<userDataForm>(defaultUser);

    useEffect(() => {
        const kw = p.get('kw') || '';
        if (kw !== null) dispatch(adminActions.reqGetListUser({ kw }));
    }, [p]);

    const AddHandler = async (data: userDataForm) => {
        // console.log(data["username"]);
        console.log(data.file);
        const fd = new FormData();

        for (const d in data) {
            if (d === 'file') {
                fd.append(d, (data[d as keyof typeof data] as any)[0]);
                continue;
            }

            fd.append(d, data[d as keyof typeof data] as any);
        }

        const res = await fetch('http://localhost:8080/admin/adminapi-adduser', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ` + Cookies.get('token') || '',
            },
            body: fd,
        });

        console.log({ res });
    };

    const closeModel = () => {
        setAddActive(false);
    };

    const addModel = add ? <AdminAddUserForm newUser={newUser} onSubmit={AddHandler} closeModel={setAddActive} /> : '';

    return (
        <>
            {addModel}
            <div className="admin-nav">
                <div className="admin-nav-title">Chess Realm Admin</div>
                <div className="admin-nav-user" onClick={(evt) => nav(`/profile/${currentUser.username}`)}>
                    <div className="admin-user-img">
                        <img src={currentUser.avatar} alt={currentUser.username} />
                    </div>
                    <div className="admin-user-username">{currentUser.username}</div>
                </div>
            </div>
            <div className="admin-content">
                <div className="content-header">
                    <div className="content-header-title">Quản lý người chơi</div>
                    <div className="content-header-fetaure">
                        <div className="feature-search">
                            <input
                                type="text"
                                placeholder="Tên tài khoản..."
                                value={kw}
                                onChange={(evt) => setKw(evt.target.value)}
                                onKeyDown={(evt) => {
                                    if (evt.key === 'Enter') nav(`/admin/?kw=${kw}`);
                                }}
                            />
                        </div>
                        <div
                            className="feature-add btn-form btn-form-save"
                            onClick={(evt) => {
                                setNewUser(defaultUser);
                                setAddActive(true);
                            }}
                        >
                            Tạo
                        </div>
                    </div>
                </div>
                <div className="content-body">
                    <div>
                        <table className="table-content">
                            <thead className="table-header">
                                <tr>
                                    <th></th>
                                    <th>Tên tài khoản</th>
                                    <th>Elo</th>
                                    <th>Ngày tạo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {!isLoadding &&
                                    userList.length !== 0 &&
                                    userList.map((u) => {
                                        if (u?.username !== currentUser.username) {
                                            return (
                                                <>
                                                    <tr>
                                                        <td className="col-avatar">
                                                            <img src={u.avatar} alt={u.username} />
                                                        </td>
                                                        <td>{u.username}</td>
                                                        <td>{u.elo}</td>
                                                        <td>{moment(u?.createdAt).format('DD-MM-YYYY')}</td>
                                                        <td>
                                                            <button
                                                                onClick={(evt) => {
                                                                    setNewUser(u);
                                                                    setAddActive(true);
                                                                }}
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button>Reset</button>
                                                            <button>Vô hiệu</button>
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        }
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;
