import * as yup from 'yup';
import {
  validateFileType,
  validateFileSize,
  addMinutesToDate,
} from '../utils/utilityFunctions';

const schema = yup.object().shape({
  itemName: yup.string().min(2).max(32).trim().required().label('Item name'),
  description: yup
    .string()
    .min(8)
    .max(2048)
    .trim()
    .required()
    .label('Description'),
  minimumBid: yup.number().min(0).label('Minimum bid'),
  address: yup.string().max(256).trim().label('Address'),
  state: yup
    .string()
    .max(28)
    .required('Please provide your state!')
    .label('State'),
  startTime: yup
    .date()
    .required()
    .label('Starting time')
    .test({
      test: 'min',
      exclusive: false,
      message: ({ label }) => {
        const minutes = 3;
        const currDateTime = new Date();
        const allowedTime = addMinutesToDate(currDateTime, minutes).toString();

        return `${label} can't be less than ${allowedTime}`;
      },
      test: (value) => {
        const minutes = 3;
        const currDateTime = new Date();
        const minimumAllowedTime = addMinutesToDate(currDateTime, minutes);

        return value > minimumAllowedTime;
      },
    }),
  endTime: yup
    .date()
    .required()
    .label('Ending time')
    .test({
      name: 'min',
      exclusive: false,
      params: { startTime: yup.ref('startTime') },
      message: ({ label, startTime }) => {
        const minutes = 3;
        const minimumAllowedTime = addMinutesToDate(startTime, minutes);

        return `${label} can't be less than ${minimumAllowedTime.toString()}`;
      },
      test: (value, testContext) => {
        const minutes = 3;
        const startTime = new Date(testContext.parent.startTime);
        const minimumAllowedTime = addMinutesToDate(startTime, minutes);

        return value > minimumAllowedTime;
      },
    }),
});

export const areValidImages = (images) => {
  if (!images.length)
    return { error: 'Please upload at least 1 image!', isValid: false };
  if (images.length > 4)
    return { error: 'Maximum image upload limit is 4!', isValid: false };

  let isValidType = true;
  let isValidSize = true;

  images.forEach((image) => {
    const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
    const allowedSizeInBytes = 2 * 1024 * 1024; // 2MB is the file (image) size limit.
    isValidType = isValidType && validateFileType(image, allowedTypes);
    isValidSize = isValidSize && validateFileSize(image, allowedSizeInBytes);
  });

  if (!isValidType)
    return { error: 'Invalid image file type!', isValid: false };
  if (!isValidSize)
    return { error: 'Image file size limit is 2MB', isValid: false };

  return { isValid: true, error: null };
};

export default schema;
