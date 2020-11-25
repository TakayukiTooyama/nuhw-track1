import React, { FC } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import FormButton from '../../components/molecules/FormButton';
import FormInput from '../molecules/FormInput';

export type Values = {
  teamName: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  createTeam: (
    teamName: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => Promise<void>;
  submitErrorMessage: string;
  setSubmitErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

const TeamCreate: FC<Props> = ({
  createTeam,
  setSubmitErrorMessage,
  submitErrorMessage,
}) => {
  const initialValues: Values = {
    teamName: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        teamName: yup
          .string()
          .max(30, '30文字以内で入力してください')
          .required('必須項目'),
        password: yup
          .string()
          .matches(/^[0-9a-zA-Z]+$/, '半角英数字のみ')
          .min(6, '6文字以上で入力してください')
          .required('必須項目'),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], 'パスワードと異なります')
          .required('必須項目'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        createTeam(values.teamName, values.password, setSubmitting);
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
            <FormInput
              label="パスワード確認"
              name="confirmPassword"
              type="password"
              setSubmitErrorMessage={setSubmitErrorMessage}
            />
          </Stack>
          <Box mb={10}></Box>
          <FormButton
            type="submit"
            label="作成"
            bg="orange.400"
            isLoading={isSubmitting}
            disabled={!isValid || !dirty}
          />
          <Box mb={4}></Box>
          <Text textAlign="center" color="red.400">
            {submitErrorMessage}
          </Text>
        </Form>
      )}
    </Formik>
  );
};

export default TeamCreate;
