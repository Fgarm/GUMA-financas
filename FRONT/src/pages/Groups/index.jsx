import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import Groups from '../../modals/createGroup';

import { useDisclosure } from '@chakra-ui/react';

export default function MyPage() {
  const { isOpen: isCreateGroupOpen, onOpen: openCreateGroup, onClose: closeCreateGroup } = useDisclosure();

  const handleCreateClick = () => {
    openCreateGroup();
  };

  const handleClose = () => {
    closeCreateGroup();
  };

  return (
    <div>
      <Button onClick={handleCreateClick}>Criar</Button>
      <Groups isOpen={isCreateGroupOpen} onClose={closeCreateGroup}>
        <Button onClick={handleClose}>Fechar</Button>
      </Groups>
    </div>
  );
}

