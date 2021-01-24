import { Box, Stack, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC, useState } from 'react';
import * as yup from 'yup';

import { useAuthentication } from '../../../hooks';
import { userJoinToTeam } from '../../../lib/firestore/teams';
import { FormButton, FormInput } from '../../molecules';

type FormValues = {
  teamName: string;
  password: string;
};

const TeamJoin: FC = () => {
  // Global State
  const { userAuth } = useAuthentication();

  // Local State
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');

  // Formik State
  const initialValues: FormValues = {
    teamName: '新潟医療福祉大学',
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
        userJoinToTeam(
          values.password,
          userAuth,
          setSubmitting,
          setSubmitErrorMessage
        );
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
          <Box mb={10} />
          <FormButton
            type="submit"
            label="参加"
            bg="blue.400"
            isLoading={isSubmitting}
            disabled={!isValid || !dirty}
          />
          <Box mb={4} />
          <Text color="red.400" textAlign="center">
            {submitErrorMessage}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default TeamJoin;
