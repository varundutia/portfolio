import React, { useEffect, useState } from 'react';
import "./Repositories.css";
import axios from 'axios';
import { Card, CardContent, CardMedia, CardActions, Button, Grid } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

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
        <section id="projects" className="about-info">
            <span className="heading">My Projects</span>
            <Grid container spacing={3} sx={{paddingInline: "10px"}}>
                {repos.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                backgroundColor: '#f9f9f9',
                                borderRadius: 2,
                                boxShadow: 3,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent>
                                <span style={{ fontWeight: 600, fontSize: '1.1rem', display: 'block', marginBottom: '8px' }}>
                                    {item.name}
                                </span>
                                <span style={{ color: '#555', fontSize: '0.9rem' }}>
                                    {item.description || "No description available."}
                                </span>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    sx={{ color: 'rgb(92, 92, 228)' }}
                                    endIcon={<LaunchIcon />}
                                    onClick={() => window.open(item.html_url, "_blank")}
                                >
                                    View Repo
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </section>
    );
}
export default Repositories;