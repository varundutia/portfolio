import React, { useEffect, useState } from 'react';
import "./Industry.css";
import Card from '../Card/Card';
import { IndustryItems } from "./IndustryItems";

const Industry = () => {
    return (
        <section id="experience">
            <h1>Experience</h1>
            <div>
                {IndustryItems.map((item, index) => {
                    return (
                        <a href={item.link}>
                            <Card title={item.title} description={item.description} id={item.skills} width="90%" />
                        </a>
                    )
                })}
            </div>
        </section>
    );
}
export default Industry;