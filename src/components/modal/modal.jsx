import React from 'react';
import QRCode from 'qrcode.react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

const CustomModal = ({ isOpen, onClose, userData, onDownloadQRCode, onNewResponse }) => {
  const handleNewResponse = () => {
    onClose(); // Close the modal
    onNewResponse(); // Handle new response action

    // Reload the page to clear the input
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Registration Successful</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" flexDirection="column" alignItems="center">
            {userData && <QRCode id="qrcode" value={JSON.stringify(userData)} />}
          </Box>
          <Box mt={4} color="white" textAlign="center">
            <p>Congratulations! You have successfully registered for Praise Chapel National Convention 2023.</p>
            <p>Your Ticket No is: {userData && userData.ticketNo}</p>
          </Box>
          <Box mt={4} color="yellow" textAlign="center">
            <p>You can submit your QR code, Ticket Number, Phone Number, Email, or any other details for easy verification at the Registration stand.</p>
          </Box>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            colorScheme="red"
            mr={3}
            fontSize={{ base: 'sm', md: 'md' }} // Responsive font size
            onClick={onDownloadQRCode}
          >
            Download QR Code
          </Button>
          <Button
            colorScheme="teal"
            fontSize={{ base: 'sm', md: 'md' }} // Responsive font size
            onClick={handleNewResponse}
          >
            Submit Another Response
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
