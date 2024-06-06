import { Box, Link, Typography } from "@mui/material";

function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
      </Typography>
    );
  }

const Footer = () => {
    return(
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
                2024
            </Typography>
            <Typography
                variant="subtitle1"
                align="center"
                color="text.secondary"
                component="p"
            >
                Intern Project
            </Typography>
            <Copyright />
        </Box>
    )
}

export default Footer;