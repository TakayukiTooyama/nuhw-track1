import { Button } from '@chakra-ui/react';
import React, { FC } from 'react';

type Props = {
  label: string;
  bg: string;
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  isLoading?: boolean;
  onClick?: any;
  disabled?: boolean;
};

const FormButton: FC<Props> = ({
  label = '',
  bg = 'blue.400',
  type = 'button',
  color = 'white',
  isLoading,
  onClick = () => undefined,
  disabled,
}) => {
  const style = {
    w: '100%',
    h: '50px',
    fontSize: { base: 'md', sm: 'lg' },
    boxShadow: 'lg',
  };

  return (
    <Button
      {...style}
      bg={bg}
      color={color}
      type={type}
      isLoading={isLoading}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default FormButton;
