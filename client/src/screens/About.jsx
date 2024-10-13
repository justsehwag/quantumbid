import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const About = () => {
  return (
    <Container>
      <Typography variant='h2' textAlign='center' sx={{ my: 3 }} component='h1'>
        About Us
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography mb={3} variant='body1'>
        Welcome to Quantumbid by WebZenith Solutions!
        </Typography>
        <Typography mb={3} variant='body1'>
        
        We're thrilled to introduce our real-time auction and bidding app, currently in development. Quantumbid brings the excitement of live auctions to your fingertips, allowing you to participate in a wide range of auctions from anywhere, at any time.

       </Typography>
        <Typography mb={3} variant='body1'>
        Key features:
        <br />
        - Browse upcoming and live auctions
        <br />
        - Bid in real-time
        <br />
        - Track your bids and won items
        <br />
        - Initiate your own auctions
        </Typography>
        <Typography mb={3} variant='body1'>
        We're also building resources to support both buyers and sellers, including informative blog articles and guides.
        Stay tuned as we refine and enhance Quantumbid. WebZenith Solutions is committed to delivering a seamless and engaging auction experience for enthusiasts like you!
        </Typography>
        <p class="info-link">
        For more information, visit  
        <a href="https://webzenith.tech" target="_blank" rel="noopener noreferrer">
        <span class="hover-effect"> webzenith.tech</span>
        <span class="icon">&#x2197;</span>
        </a>
        </p>
      </Paper>
    </Container>
  );
};

export default About;
