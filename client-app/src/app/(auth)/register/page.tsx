"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext, useState } from 'react';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import IRegister from '@/model/IRegister';
const defaultTheme = createTheme();

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// ... (import statements)

const RegisterUserPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [dateBirth, setDateBirth] = useState<Date>();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const {registerUser} = useContext(AuthContext)
  const router = useRouter();

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation
    if (username.trim() === '') {
      setUsernameError(true);
      return;
    }

    if (password.trim() === '') {
      setPasswordError(true);
      return;
    }

    if (email.trim() === '') {
      setEmailError(true);
      return;
    }

    const response = await registerUser( {username, email, password} as IRegister);
      if (response.ok) {
        router.push("/validation?email="+email)
      } else
        console.log("error")
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'royalblue' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register user
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              className="text-white"
              error={usernameError}
              helperText={usernameError ? 'Username is required' : ''}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError(false);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={passwordError}
              helperText={passwordError ? 'Password is required' : ''}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              required
              label="Email"
              name="email"
              autoComplete="email"
              error={emailError}
              helperText={emailError ? 'Email is required' : ''}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(false);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ background: 'royalblue' }}
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item>
              <Link href="/login" variant="body2">
                  {"You already have an account? Sign in now!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* ... (Copyright component) */}
      </Container>
    </ThemeProvider>
  );
};

export default RegisterUserPage;