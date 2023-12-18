// VerifyPage.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';

const VerifyPage = () => {
  const [verificationData, setVerificationData] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleVerify = (data) => {
    // If the data is a valid JSON string, assume it contains user details
    try {
      const userData = JSON.parse(data);
      setUserDetails(userData);
      toast({
        title: 'User verified successfully',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    } catch (error) {
      console.error('Invalid JSON data:', error);
      toast({
        title: 'Invalid data. Please upload a valid QR code image.',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const handleError = (error) => {
    console.error('Error reading QR code:', error);
    // Handle error (e.g., display an error message to the user)
  };

  const handleScan = (data) => {
    if (data) {
      setVerificationData(data);
      handleVerify(data);
    }
  };

  const handleManualInput = () => {
    // Perform verification logic based on manually entered data
    handleVerify(verificationData);
  };

  const handleUpload = (event) => {
    // Implement logic to handle file upload (e.g., read file contents, extract data)
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedData = e.target.result;
        setVerificationData(uploadedData);
        handleVerifyQRImage(uploadedData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerifyQRImage = (imageDataUrl) => {
    const image = new Image();
    image.src = imageDataUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        const decodedData = code.data;
        handleVerify(decodedData);
      } else {
        console.error('Unable to decode QR code from the image.');
        toast({
          title: 'Unable to decode QR code from the image.',
          status: 'error',
          duration: 3000,
          position: 'top',
          isClosable: true,
        });
      }
    };
  };

  const handleStartScanning = () => {
    setIsScanning(true);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
  };

  useEffect(() => {
    // Additional logic can be added here when userDetails changes
  }, [userDetails]);

  return (
    <Flex direction="column" align="center" mt="8">
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Attendance Page
      </Text>
      <Button
        colorScheme="teal"
        onClick={isScanning ? handleStopScanning : handleStartScanning}
        mb="4"
      >
        {isScanning ? 'Stop Scanning' : 'Scan QR'}
      </Button>
      {isScanning && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      )}
      {!isScanning && (
        <Flex direction="column" align="center" mb="4">
          <Input
            placeholder="Enter Ticket Number, Phone Number, or Email"
            value={verificationData}
            onChange={(e) => setVerificationData(e.target.value)}
            mb="2"
            size="sm" // Make the input smaller
          />
          <Button colorScheme="teal" onClick={handleManualInput} mb="2">
            Verify
          </Button>
          <br />
          <Text fontSize="lg" fontWeight="bold" mb="2">
            Upload QR:
          </Text>
          <Input type="file" accept=".png, .jpg, .jpeg" onChange={handleUpload} mb="2" />
        </Flex>
      )}
      {userDetails && (
        <Box mb="4">
          <Text fontSize="lg" fontWeight="bold" mb="2">
            User Details:
          </Text>
          <Text>Name: {userDetails.name}</Text>
          <Text>Phone Number: {userDetails.phoneNumber}</Text>
          <Text>Email: {userDetails.email}</Text>
          <Text>Ticket Number: {userDetails.ticketNo}</Text>
          <Text>Church: {userDetails.church}</Text>
          <Text>Membership: {userDetails.isMember}</Text>
          <Text>Gender: {userDetails.gender}</Text>
          <Text>Age Group: {userDetails.ageGroup}</Text>
          <Text>Status: {userDetails.attendanceStatus}</Text>

          <Button colorScheme="green" onClick={handleStartScanning} mt="4">
            Mark Attendance
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default VerifyPage;
