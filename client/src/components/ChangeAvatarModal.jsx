import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { changeAvatar, resetChangeAvatar } from '../features/profileSlice';
import avatars from '../utils/avatars.json';
import {
  convertToBase64,
  validateFileType,
  validateFileSize,
} from '../utils/utilityFunctions';

const ChangeAvatarModal = ({ openState, closeHandler }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile.userProfile);
  const { loading, error, success } = useSelector(
    (state) => state.profile.changeAvatar
  );

  const [avatarImage, setAvatarImage] = useState(data.avatar);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    if (success) {
      toast.success('Profile avatar has been updated!');
      closeHandler();
    }
    if (error) toast.error(error);
    if (success || error) dispatch(resetChangeAvatar());
  }, [success, error]);

  const uploadAvatar = () => {
    dispatch(changeAvatar({ avatar: avatarImage }));
  };

  const avatarSelectHandler = (avatar) => {
    if (imageError) setImageError(null);
    setAvatarImage(avatar);
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];

    const base64String = await convertToBase64(imageFile);

    setAvatarImage(() => {
      const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
      const allowedSizeInBytes = 2 * 1024 * 1024; // 2MB is the file (image) size limit.
      const isValidType = validateFileType(base64String, allowedTypes);
      const isValidSize = validateFileSize(base64String, allowedSizeInBytes);

      let message = null;
      if (!isValidType) message = 'Please select valid image file type!';
      else if (!isValidSize) message = 'Image file size limit is 2MB!';

      setImageError(message);

      if (isValidType && isValidSize) setAvatarImage(base64String);

      return base64String;
    });
  };

  return (
    <section>
      <CustomDialog
        onClose={closeHandler}
        aria-labelledby='Change Avatar'
        open={openState}
      >
        <DialogueTitle color='secondary' onClose={closeHandler}>
          Change Avatar
        </DialogueTitle>
        <DialogContent sx={{ mx: 3 }} dividers>
          <Stack justifyContent='center' alignItems='center'>
            <Box
              sx={{
                p: 0.5,
                border: '4px solid',
                borderColor: 'secondary.main',
                borderRadius: '50%',
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                }}
                alt={data.name}
                src={avatarImage}
              />
            </Box>

            <Box
              as={Stack}
              direction='row'
              justifyContent='center'
              spacing={1}
              sx={{ flexWrap: 'wrap' }}
            >
              {avatars.map((avatar) => (
                <Avatar
                  onClick={() => avatarSelectHandler(avatar)}
                  key={avatar}
                  sx={{
                    p: 0.5,
                    width: 50,
                    height: 50,
                    borderWidth: avatarImage === avatar ? '2px' : '0',
                    borderStyle: 'solid',
                    borderColor: 'secondary.main',
                  }}
                  alt={avatar}
                  src={avatar}
                />
              ))}
            </Box>

            <Divider sx={{ my: 3 }} flexItem my={5}>
              <Chip label='OR' />
            </Divider>

            <input
              type='file'
              name='image'
              id='imageAvatar'
              onChange={handleImageChange}
              accept='image/png, image/jpg, image/jpeg, image/webp'
            />
            {imageError && (
              <Typography variant='subtitle1' mt={1} color='error' gutterBottom>
                {imageError}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            variant='contained'
            disabled={loading || !!imageError}
            onClick={uploadAvatar}
          >
            {loading ? 'Uploading...' : 'Save changes'}
          </Button>
        </DialogActions>
      </CustomDialog>
    </section>
  );
};

export default ChangeAvatarModal;

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const DialogueTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

DialogueTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
