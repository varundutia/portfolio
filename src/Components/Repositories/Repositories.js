import React, { useEffect, useState } from 'react';
import "./Repositories.css";
import axios from 'axios';
import Card from '../Card/Card';

const Repositories = () => {
    const [repos, setRepos] = useState([]);
    let url = "https://api.github.com/users/varundutia/starred";

    useEffect(() => {
        axios.get(url)
            .then(res => {
                const rep = res.data;
                setRepos(rep);
            })
    }, []);

    return (
        <section id="projects">
            <h1>My Projects</h1>
            <div className="row">
                {repos.map((item, index) => {
                    return (
                        <div className="column">
                            <Card title={item.name} description={item.description} id={item.owner.id} url={item.html_url} width="100%"/>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
export default Repositories;