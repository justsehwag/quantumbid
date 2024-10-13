import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <FooterContainer>
      <Typography variant='body1' textAlign={'center'}>
        &copy; 2024 QUANTUMBID
      </Typography>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  color: #fff;
  background-color: #1b1b1b;
  margin-top: auto;
`;
