import React, { useEffect, useState } from 'react';
import "./Repositories.css";
import ApiService from '../../ApiService';
import Typical from 'react-typical';

const Repositories = () => {
    const apiService = new ApiService();
    const [repos, setRepos] = useState([]);
    let url = "https://cors-anywhere.herokuapp.com/https://api.github.com/users/varundutia/starred";

    useEffect(() => {
        apiService.get(url).then((result) => {
            setRepos(result);
        })
    }, []);

    return (
        <div>
            <ul>
                {repos.map((item, index) => {
                    return (
                        <li>{item.name}</li>
                    );
                })}
                <li>abc</li>
                <li>abc</li>
                <li>abc</li>
                <li>abc</li>
                <li>abc</li>
                <li>abc</li>
                <li>abc</li>
                <li>abc</li>
            </ul>
            <Typical
                steps={['Hello', 1000, 'Hello world!', 500]}
                loop={Infinity}
                wrapper="p"
            />
        </div>
    );
}
export default Repositories;