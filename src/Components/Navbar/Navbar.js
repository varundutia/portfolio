import React, { Component, useState } from 'react';
import {MenuItems} from "./MenuItems";
import "./Navbar.css";

const Navbar = () =>{
    const [clicked,handleClick] = useState(false);
    return(
        <nav className="NavbarItems">
            <h1 className="navbar-logo">
                Varun Dutia
            </h1>
            <div className="menu-icon" onClick={()=>{handleClick(!clicked)}}>
                <i className={clicked? 'fas fa-times' : 'fas fa-bars'}></i>
            </div>
            <ul className={clicked?'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item,index)=>{
                    return(
                        <li>
                            <a className = {item.cName}href={item.url}>
                                {item.title}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    );

}
export default Navbar;