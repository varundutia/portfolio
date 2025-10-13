import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import "./Skills.css";

const skills = [
  { name: "C++", level: 70 },
  { name: "Java", level: 60 },
  { name: "Python", level: 60 },
  { name: "Android", level: 80 },
  { name: "React", level: 50 },
  { name: "Flask", level: 70 },
  { name: ".Net", level: 60 },
  { name: "HTML", level: 70 },
  { name: "CSS", level: 60 },
  { name: "NodeJS", level: 70 },
];

const Info = () => {
  return (
    <section id="info">
      <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600 }}>
        Skills
      </Typography>
      <Grid container spacing={3}>
        {skills.map((skill) => (
          <Grid item xs={12} sm={6} key={skill.name}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {skill.name}
            </Typography>
            <Stack spacing={1}>
              <Rating
                name={`${skill.name}-rating`}
                value={(skill.level / 20)}
                precision={0.5}
                readOnly
              />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </section>
  );
};

export default Info;
