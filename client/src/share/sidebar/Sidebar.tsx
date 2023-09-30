import React from 'react'
import "../sidebar/Sidebar.scss";
import { Link } from 'react-router-dom';
interface Props {}

const Sidebar = (props: Props) => {
  return (
    <>
        <ul className='sidebar'>
            <li className='sidebar-item'><Link to={"/"}>Logo</Link></li>
            <li className='sidebar-item'><Link to={"/"}>2</Link></li>
            <li className='sidebar-item'><Link to={"/"}>3</Link></li>
            <li className='sidebar-item'><Link to={"/"}>4</Link></li>
            <li className='sidebar-item'><Link to={"/"}>5</Link></li>
            <li className='sidebar-item'><Link to={"/"}>6</Link></li>
            <li className='sidebar-item'><button className='btn-form w-80'>Đăng ký</button></li>
            <li className='sidebar-item'><button className='btn-form w-80 btn-form-save'>Đăng nhập</button></li>
        </ul>
    </>
  )
}

export default Sidebar