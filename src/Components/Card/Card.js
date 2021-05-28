import React from 'react';
import './Card.css';

const Card = (props) => {
    return (
        <a href={props.url}>
            <div className="card" style={{width: props.width}}>
                <div className="card-body">
                    <h2>{props.title}</h2>
                    <p>{props.description}</p>
                    <h5>{props.id}</h5>
                </div>
            </div>
        </a>
    );
}
export default Card;
