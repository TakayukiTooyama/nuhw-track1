/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CheckIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Field } from 'formik';
import React, { FC } from 'react';

type Props = {
  label: string;
  name: string;
  type?: string;
  setSubmitErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const FormInput: FC<Props> = ({
  label,
  name,
  type = 'text',
  setSubmitErrorMessage,
}) => (
  <Field name={name}>
    {({ field, form: { errors, touched } }: any) => (
      <FormControl isInvalid={errors[name] && touched[name]} isRequired>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <InputGroup>
          <Input
            {...field}
            id={name}
            type={type}
            onFocus={() => setSubmitErrorMessage('')}
          />
          <InputRightElement
            // eslint-disable-next-line react/no-children-prop
            children={
              !errors[name] && field.value !== '' ? (
                <CheckIcon color="green.500" />
              ) : null
            }
          />
        </InputGroup>
        <FormErrorMessage color="red.400">{errors[name]}</FormErrorMessage>
      </FormControl>
    )}
  </Field>
);

export default FormInput;
