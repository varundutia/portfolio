import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const pages = ['About', 'Projects', 'Experience', 'Education', 'Contact'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: isScrolled ? 'rgba(92, 92, 228, 0.6)' : 'rgb(92, 92, 228)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        padding: { xs: '0 10px', sm: '0 20px' },
        minHeight: { xs: '64px', sm: '70px' },
        width: '100%',
        top: 0,
        zIndex: 1200
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  backgroundColor: 'rgba(92, 92, 228, 0.8)',
                  backdropFilter: 'blur(20px)',
                  color: '#fff',
                  width: '100vw',
                  maxWidth: '100vw',
                  position: 'fixed',
                  top: '0 !important',
                  marginTop: '64px',
                  left: '0 !important',
                  right: '0',
                  borderRadius: 0,
                  height: 'auto',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '10px 0',
                  boxSizing: 'border-box',
                  zIndex: 1200,
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <a
                    href={`#${page.toLowerCase()}`}
                    style={{ textDecoration: 'none', color: 'white', width: '100%', textAlign: 'center' }}
                  >
                    {page}
                  </a>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flexWrap: 'wrap' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'var(--font-sans)' }}
                href={`#${page.toLowerCase()}`}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, ml: { xs: 1, md: 0 } }}>
            <IconButton sx={{ p: 0 }}>
              <Avatar alt="Varun Dutia" src={`${process.env.PUBLIC_URL}/varun.jpg`} sx={{ width: 40, height: 40 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
