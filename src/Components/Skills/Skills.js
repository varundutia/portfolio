import React from 'react';
import "./Skills.css";
import ProgressLine from "../ProgressLine/ProgressLine";

const Skills = () => {
    return (
        <section id="skills">
            <h1>My Skills</h1>
            <div className="skill-main">
                <div className="bar1">
                    <ProgressLine
                        label="C++"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "70%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="Java"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "60%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="Python"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "60%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="Android"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "80%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="React"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "50%",
                                color: "#102e37"
                            }
                        ]}
                    />
                </div>
                <div className="bar2">
                    <ProgressLine
                        label="Flask"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "70%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label=".Net"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "60%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="HTML"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "70%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="CSS"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "60%",
                                color: "#102e37"
                            }
                        ]}
                    />
                    <ProgressLine
                        label="NodeJS"
                        backgroundColor="#00d4ff"
                        visualParts={[
                            {
                                percentage: "70%",
                                color: "#102e37"
                            }
                        ]}
                    />
                </div>
                </div>
        </section>
    )
}

export default Skills;
