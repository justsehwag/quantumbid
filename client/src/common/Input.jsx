import { Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

const Input = (props) => {
  const {
    field,
    control,
    name,
    label,
    type,
    themeColor,
    error,
    leftContent,
    rightContent,
    ...rest
  } = props;

  return (
    <FormControl fullWidth error={!!error} variant='filled' color={themeColor}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <FilledInput
              {...field}
              id={name}
              type={type}
              startAdornment={
                leftContent && (
                  <InputAdornment position='start'>
                    {leftContent()}
                  </InputAdornment>
                )
              }
              endAdornment={
                rightContent && (
                  <InputAdornment position='end'>
                    {rightContent()}
                  </InputAdornment>
                )
              }
              {...rest}
            />
          )}
        />
      ) : (
        <FilledInput
          {...field}
          id={name}
          name={name}
          type={type}
          startAdornment={
            leftContent && (
              <InputAdornment position='start'>{leftContent()}</InputAdornment>
            )
          }
          endAdornment={
            rightContent && (
              <InputAdornment position='end'>{rightContent()}</InputAdornment>
            )
          }
          {...rest}
        />
      )}

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Input;

Input.defaultProps = {
  themeColor: 'secondary',
  type: 'text',
  leftContent: null,
  rightContent: null,
  error: null,
};
