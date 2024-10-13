import { toast } from 'react-toastify';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CopyAllIcon from '@mui/icons-material/CopyAll';

const CopyText = ({ title, elementRef, ...rest }) => {
  const copyText = async () => {
    const element = elementRef.current;
    const text = element.innerText || element.textContent || element.value;

    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      toast.error('Please manually select text and copy!');
      console.error(error);
    }
  };

  return (
    <Tooltip title={title}>
      <IconButton
        color='secondary'
        aria-label='Copy Text'
        onClick={copyText}
        {...rest}
      >
        <CopyAllIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CopyText;

CopyText.defaultProps = {
  title: 'Copy',
};
