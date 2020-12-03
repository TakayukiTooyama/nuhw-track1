import React, { FC } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Field } from 'formik';
import { CheckIcon } from '@chakra-ui/icons';

type Props = {
  label: string;
  name: string;
  type?: string;
  setSubmitErrorMessage: any;
};

const FormInput: FC<Props> = ({
  label,
  name,
  type = 'text',
  setSubmitErrorMessage,
}) => {
  return (
    <Field name={name}>
      {({ field, form: { errors, touched } }: any) => {
        return (
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
                children={
                  !errors[name] && field.value !== '' ? (
                    <CheckIcon color="green.500" />
                  ) : null
                }
              />
            </InputGroup>
            <FormErrorMessage color="red.400">{errors[name]}</FormErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
};

export default FormInput;
