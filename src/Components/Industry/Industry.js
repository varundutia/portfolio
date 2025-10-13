import React from 'react';
import "./Industry.css";
import { Card, CardContent, CardActions, Button } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { IndustryItems } from "./IndustryItems";
import { useMediaQuery } from '@mui/material';

const Industry = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return (
    <section id="experience" className="about-info">
      <span className="heading">Experience</span>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', padding: '0 16px' }}>
          {IndustryItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Card
                sx={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  },
                  width: '100%',
                  margin: '0 auto'
                }}
              >
                <CardContent>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    {item.title}
                  </span>
                  <span style={{ color: '#555', fontSize: '0.9rem' }}>
                    {item.description}
                  </span>
                </CardContent>
                {item.skills && (
                  <CardActions>
                    <Button size="small" sx={{ color: 'rgb(92, 92, 228)' }}>
                      {item.skills}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </a>
          ))}
        </div>
      ) : (
        <Timeline
          position="alternate"
          sx={{
            '@media (max-width: 768px)': {
              padding: 0
            }
          }}
        >
          {IndustryItems.map((item, index) => (
            <TimelineItem
              key={index}
              sx={{
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }
              }}
            >
              <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: 'rgb(92, 92, 228)' }} />
                {index !== IndustryItems.length - 1 && (
                  <TimelineConnector sx={{ backgroundColor: 'rgb(92, 92, 228)' }} />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    sx={{
                      backgroundColor: '#f9f9f9',
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      },
                      width: '90%',
                      margin: '0 auto',
                      '@media (max-width: 1024px)': {
                        width: '95%'
                      },
                      '@media (max-width: 768px)': {
                        width: '90%'
                      },
                      '@media (max-width: 480px)': {
                        width: '100%'
                      }
                    }}
                  >
                    <CardContent>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          display: 'block',
                          marginBottom: '8px'
                        }}
                      >
                        {item.title}
                      </span>
                      <span style={{ color: '#555', fontSize: '0.9rem' }}>
                        {item.description}
                      </span>
                    </CardContent>
                    {item.skills && (
                      <CardActions>
                        <Button size="small" sx={{ color: 'rgb(92, 92, 228)' }}>
                          {item.skills}
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </a>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </section>
  );
};

export default Industry;