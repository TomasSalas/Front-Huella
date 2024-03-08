import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import Logo from '../assets/IMG/logo.png';
const drawerWidth = 240;
const navItems = [
	{ name: 'Dashboard', path: '/' },
	{
		name: 'Buscador Asistencias',
		path: '/marcas',
	},
];

function NavBar(props) {
	const navigate = useNavigate();
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const drawerRef = React.useRef(null);
	const location = useLocation();

	const handleDrawerToggle = (event) => {
		if (drawerRef.current && !drawerRef.current.contains(event.target)) {
			setMobileOpen(false);
		}
	};

	const name = localStorage.getItem('Nombre') || 'Usuario';
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		event.stopPropagation(); // Evita que el evento se propague al drawer
		setAnchorEl(event.currentTarget);
		if (!mobileOpen) {
			setMobileOpen(true);
		}
	};

	const handleClose = (event) => {
		const selectedMenuItem = event.currentTarget.textContent;

		if (selectedMenuItem.includes('Cerrar Sesión')) {
			localStorage.removeItem('token');
			localStorage.removeItem('Nombre');
			navigate('/');
		} else {
			setAnchorEl(null);
		}
	};

	const drawer = (
		<Box ref={drawerRef} sx={{ textAlign: 'center' }} onClick={handleDrawerToggle}>
			<Typography variant="h6" sx={{ my: 2 }}>
				<img src={Logo} style={{ maxWidth: '30%', height: 'auto' }} />
			</Typography>
			<Divider />
			<List>
				{navItems.map((item, index) => (
					<ListItem key={index} disablePadding component={Link} to={item.path}>
						<ListItemButton sx={{ textAlign: 'center' }}>
							<ListItemText primary={item.name} sx={{ color: location.pathname === item.path ? '#1976d2' : '#000', fontWeight: 'bold' }} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Button sx={{ color: '#000' }} id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
				{name}
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				onClick={(event) => event.stopPropagation()}
			>
				<MenuItem onClick={handleClose} sx={{ color: 'red' }}>
					Cerrar Sesión
				</MenuItem>
			</Menu>
		</Box>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar component="nav" sx={{ height: '60px', backgroundColor: '#f6f6f7', boxShadow: 'none' }}>
				<Toolbar>
					<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
						<MenuIcon sx={{ color: '#000' }} />
					</IconButton>
					<Typography sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
						<img src={Logo} alt="logo" style={{ width: 70 }} />
					</Typography>
					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navItems.map((item, index) => (
							<Button key={index} sx={{ color: location.pathname === item.path ? '#1976d2' : '#000' }} component={Link} to={item.path}>
								{item.name}
							</Button>
						))}
						<Button sx={{ color: '#000' }} id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
							{name}
						</Button>
						<Menu
							id="basic-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							<MenuItem onClick={handleClose} sx={{ color: 'red' }}>
								Cerrar Sesión
							</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			<nav>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={() => setMobileOpen(false)}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							bgcolor: '#f6f6f7',
						},
					}}
				>
					{drawer}
				</Drawer>
			</nav>
		</Box>
	);
}

NavBar.propTypes = {
	window: PropTypes.func,
};

export default NavBar;
