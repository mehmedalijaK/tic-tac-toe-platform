"use client"
import AuthContext from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function Home() {

  const {authenticated} = useContext(AuthContext);
  const router = useRouter();


  return (
    <ThemeProvider theme={defaultTheme}>
    <main>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 30,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Tic Tac Toe
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            This Tic Tac Toe project, created for my internship application to Schneider Electric.
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button variant="contained" className='bg-blue-500' href="/login">Login</Button>
            <Button variant="outlined" href = "https://github.com/mehmedalijaK/tic-tac-toe-platform">Source code</Button>
          </Stack>
        </Container>
      </Box>
    </main>
  </ThemeProvider>
  )
}