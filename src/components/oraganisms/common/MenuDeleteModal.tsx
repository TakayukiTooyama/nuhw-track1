import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { VFC } from 'react';

type Props = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
};

const MenuDeleteModal: VFC<Props> = ({ title, isOpen, onClose, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={8} mx={4}>
        <ModalHeader p={0} mb={8} fontSize={['16px', '20px']}>
          {title}を削除してもよろしいですか？
        </ModalHeader>

        <ModalFooter p={0}>
          <Button
            w="100%"
            borderRadius="30px"
            shadow="base"
            mr={3}
            onClick={onClose}
          >
            閉じる
          </Button>
          <Button
            w="100%"
            borderRadius="30px"
            shadow="base"
            colorScheme="red"
            onClick={onDelete}
          >
            削除
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MenuDeleteModal;
