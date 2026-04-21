import React from 'react';
import "./Info.css";
import Typical from 'react-typical';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import Chip from '@mui/material/Chip';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import LanguageIcon from '@mui/icons-material/Language';
import DevicesIcon from '@mui/icons-material/Devices';
import CloudIcon from '@mui/icons-material/Cloud';
import DataObjectIcon from '@mui/icons-material/DataObject';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import HubIcon from '@mui/icons-material/Hub';
import BuildIcon from '@mui/icons-material/Build';

const Info = () => {
    return (
        <section id="about" className="about-info">
            <span className="heading">
                About Me
            </span>
            <span className="about-content">
                I’m a passionate <strong className="highlight">Full Stack Developer</strong> with hands-on experience in building scalable
                and user-focused applications. With expertise in <strong className="highlight">React</strong>, <strong className="highlight">Node.js</strong>,
                <strong className="highlight">Flutter</strong>, and modern DevOps tools, I love turning ideas into impactful digital products.
                I’ve worked on real-world projects involving payments, analytics, and automation, always striving to
                craft clean, efficient, and reliable solutions.
                Currently pursuing an <strong className="highlight">MSc in Computer Science</strong> at UCD, I’m constantly learning and exploring
                new technologies to stay ahead of the curve. I thrive in collaborative environments where design,
                development, and innovation come together.
                <div className="skills-container">
                    <Chip icon={<CodeIcon />} label="Python" />
                    <Chip icon={<CodeIcon />} label="SQL" />
                    <Chip icon={<CodeIcon />} label="Java" />
                    <Chip icon={<CodeIcon />} label="C++" />
                    <Chip icon={<CodeIcon />} label="JavaScript" />
                    <Chip icon={<CodeIcon />} label="Dart" />
                    <Chip icon={<LanguageIcon />} label="React" />
                    <Chip icon={<LanguageIcon />} label="Node.js" />
                    <Chip icon={<DevicesIcon />} label="Flutter" />
                    <Chip icon={<DevicesIcon />} label="Android" />
                    <Chip icon={<CloudIcon />} label="Firebase" />
                    <Chip icon={<CloudIcon />} label="AWS" />
                    <Chip icon={<StorageIcon />} label="MySQL" />
                    <Chip icon={<LanguageIcon />} label="Next.js" />
                    <Chip icon={<LanguageIcon />} label="NestJS" />
                    <Chip icon={<LanguageIcon />} label=".NET" />
                    <Chip icon={<DataObjectIcon />} label="OOP" />
                    <Chip icon={<SettingsEthernetIcon />} label="Distributed Systems" />
                    <Chip icon={<HubIcon />} label="Data Ingestion & Orchestration" />
                    <Chip icon={<HubIcon />} label="Reconciliation Workflows" />
                    <Chip icon={<HubIcon />} label="Analytics Integration" />
                    <Chip icon={<HubIcon />} label="Reporting Pipelines" />
                    <Chip icon={<BuildIcon />} label="Git" />
                    <Chip icon={<BuildIcon />} label="CI/CD" />
                    <Chip icon={<BuildIcon />} label="API Design" />
                    <Chip icon={<BuildIcon />} label="Docker" />
                </div>
            </span>
        </section>
    )
}
export default Info;