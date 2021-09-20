import React from 'react';
import "./Info.css";
import img from '../../Images/varun.PNG';

const Info = () => {
    return (
        <div className="info-main">
            <div className="info-heading">
                <h1>About Me</h1>
            </div>
            <div className="info-content">
                <img src={img} alt="varun" className="info-img"/>
                <div className="info-img-abt">
                <h2>loren rfierrnvrntvhuuuuuuuuurtv vrv rvi tvhr v irriv hr vir ivrvrvi r iv irvr vi</h2>
                </div>
                
            </div>
        </div>
    )
}
export default Info;