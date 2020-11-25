import React, { FC } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';

import FormButton from '../../components/molecules/FormButton';
import FormInput from '../../components/molecules/FormInput';

type FormValues = {
  teamName: string;
  password: string;
};

type Props = {
  userJoinToTeam: (
    teamName: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => Promise<void>;
  submitErrorMessage: string;
  setSubmitErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const TeamJoin: FC<Props> = ({
  userJoinToTeam,
  setSubmitErrorMessage,
  submitErrorMessage,
}) => {
  const initialValues: FormValues = {
    teamName: '',
    password: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        teamName: yup.string().required('必須項目'),
        password: yup.string().required('必須項目'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        userJoinToTeam(values.teamName, values.password, setSubmitting);
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form>
          <Stack spacing={8}>
            <FormInput
              label="団体名"
              name="teamName"
              setSubmitErrorMessage={setSubmitErrorMessage}
            />
            <FormInput
              label="パスワード"
              name="password"
              type="password"
              setSubmitErrorMessage={setSubmitErrorMessage}
            />
          </Stack>
          <Box mb={10}></Box>
          <FormButton
            type="submit"
            label="参加"
            bg="blue.400"
            isLoading={isSubmitting}
            disabled={!isValid || !dirty}
          />
          <Box mb={4}></Box>
          <Text color="red.400" textAlign="center">
            {submitErrorMessage}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default TeamJoin;
