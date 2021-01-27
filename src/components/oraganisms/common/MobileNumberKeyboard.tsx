import {
  Box,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Grid,
  Icon,
  IconButton,
  Text,
} from '@chakra-ui/react';
import React, { FC, Dispatch, SetStateAction } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { BsFillBackspaceFill } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { useScreenHeight } from '../../../hooks';

type Props = {
  disableStrings?: string[];
  idx: number;
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  writeRecode: (inputValue: string, idx: number) => void;
  label: string;
  format?: (input: string) => string;
};

const keybordeStyle = {
  w: '45px',
  h: '45px',
  lineHeight: '45px',
  borderRadius: 'full',
  align: 'center',
};

const MobileNumberKeyboard: FC<Props> = ({
  disableStrings,
  idx,
  isOpen,
  onClose,
  inputValue,
  setInputValue,
  writeRecode,
  format,
  label,
  children,
}) => {
  const { screenHeight } = useScreenHeight();
  const inputValues = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+/-',
    '0',
    '.',
  ];

  const keyboardIcons = [
    {
      id: 'delete',
      icon: BsFillBackspaceFill,
      color: 'orange.400',
      bg: 'gray.200',
    },
    {
      id: 'finish',
      icon: FiChevronDown,
      color: 'gray.500',
      bg: 'whtie',
    },
    {
      id: 'confirm',
      icon: FaCheck,
      color: 'white',
      bg: 'blue.400',
    },
  ];

  const InputOperation = async (id: string) => {
    switch (id) {
      case '+/-':
        const firstNumber = inputValue.slice(0, 1);
        const newinputValue = inputValue.slice(1);
        firstNumber !== '-'
          ? setInputValue((prev) => '-' + prev)
          : setInputValue(newinputValue);
        break;
      case 'delete':
        const newInputNubmer = inputValue.slice(0, -1);
        setInputValue(newInputNubmer);
        break;
      case 'finish':
        onClose();
        setInputValue('');
        break;
      case 'confirm':
        writeRecode(inputValue, idx);
        setInputValue('');
        break;
      default:
        inputValue.length >= 5
          ? setInputValue(inputValue)
          : setInputValue((prev) => prev + id);
    }
  };

  return (
    <>
      {isOpen && (
        <Box
          pos="fixed"
          bottom="391px"
          left="50%"
          transform="translateX(-50%)"
          w="calc(100% - 32px)"
          maxW="400px"
          maxH={`calc(${screenHeight}px - 407px)`}
          zIndex="modal"
          borderRadius="10px"
        >
          {children}
        </Box>
      )}
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        blockScrollOnMount
        closeOnOverlayClick
        isCentered
        motionPreset="slideInBottom"
      >
        <DrawerOverlay bg="rgba(0, 0, 0, 0.7)">
          <DrawerContent
            mx="auto"
            bg="gray.200"
            borderTopRightRadius="10px"
            borderTopLeftRadius="10px"
            w="calc(100% - 32px)"
            h="343px"
            shadow="base"
          >
            <Box pt={4} w="167px" mx="auto" align="center">
              <Box
                bg="white"
                borderRadius="10px"
                h="40px"
                lineHeight="40px"
                textAlign="right"
                px={4}
                mb={4}
              >
                {inputValue === '' ? (
                  <Text color="gray.400">{`${idx + 1}${label}`}</Text>
                ) : (
                  <Text>{format ? format(inputValue) : inputValue}</Text>
                )}
              </Box>
              <Grid templateColumns="repeat(3, 45px)" rowGap={2} columnGap={4}>
                {inputValues.map((value) => (
                  <Button
                    key={value}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{ boxShadow: 'none' }}
                    _active={{ bg: 'gray.200' }}
                    {...keybordeStyle}
                    onClick={() => InputOperation(value)}
                    isDisabled={
                      (disableStrings && disableStrings.includes(value)) ||
                      (inputValue === '' && value === '0')
                    }
                  >
                    {value}
                  </Button>
                ))}
                {keyboardIcons.map((item) => (
                  <IconButton
                    key={item.id}
                    aria-label={`${item.id}-keyboardIcon`}
                    bg={item.bg}
                    {...keybordeStyle}
                    onClick={() => InputOperation(item.id)}
                    _hover={{ bg: `${item.bg}` }}
                    _focus={{ boxShadow: 'none' }}
                    _active={{ bg: `${item.bg}` }}
                  >
                    <Icon as={item.icon} color={item.color} w={6} h={6} />
                  </IconButton>
                ))}
              </Grid>
            </Box>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default MobileNumberKeyboard;
