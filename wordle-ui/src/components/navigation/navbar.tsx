import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { DrawerItem } from './router';

const Navbar = ({
    drawerLinks,
}: {
    drawerLinks: Record<string, DrawerItem>;
}) => {
    const navItems = Object.keys(drawerLinks).map((key) => {
        const { path, label, icon } = drawerLinks[key];

        return (
            <ListItem key={key} disablePadding>
                <ListItemButton href={path}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={label} />
                </ListItemButton>
            </ListItem>
        );
    });

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            PaperProps={{
                elevation: 24,
                sx: {
                    backgroundColor: '#eeeeee',
                },
            }}
        >
            <List>{navItems}</List>
        </Drawer>
    );
};

export default Navbar;
