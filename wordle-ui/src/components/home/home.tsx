import { Box, Container, Typography } from '@mui/material';

import './home.css';

const Home = () => {
    return (
        <main>
            <Container component="main" maxWidth="sm">
                <Box
                    sx={{
                        width: 500,
                        height: 500,
                        marginTop: 8,
                        marginLeft: '50%',
                        display: 'flex',
                        gap: '8px',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to WordleOnline
                    </Typography>
                </Box>
            </Container>
        </main>
    );
};

export default Home;
