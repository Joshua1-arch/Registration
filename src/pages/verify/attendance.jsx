import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const VerifyPage = () => {
  const [verificationData, setVerificationData] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const toast = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [QrDetails, setUserQrDetails] = useState('');
  const navigate = useNavigate();



// Function to handle user verification
const handleVerify = async (data, isQRCode) => {
  try {
    // Make a request to the backend endpoint for user verification
    const response = await axios.get('https://hhpm.onrender.com/api/v1/verifyUser', {
      params: { value: data, isQRCode },
    });

    const responseData = response.data;
    // console.log('Response Data:', responseData);

    if (responseData.user) {
      const userData = responseData.user;
      setUserDetails(userData);

      const userKey = Object.keys(responseData.user)[0];
      const ticketNo = responseData.user[userKey].ticketNo;

      if (ticketNo) {
        localStorage.setItem('ticketNo', ticketNo);
      } else {
        console.error('Ticket number is undefined in user data');
      }

      toast({
        title: 'User verified successfully',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    } else {
      // Display the backend error message
      toast({
        title: `Verification failed: ${responseData.error || 'Unknown error'}`,
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    }
  } catch (error) {
    console.error('Error verifying user:', error.response);

    // Display the network or unexpected error message
    toast({
      title: `Error verifying user: ${error.response?.data?.error || 'Network error'}`,
      status: 'error',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });
  }
};


  const handleQrVerify = (data) => {
    try {
      // Check if the data is already an object
      const userData = typeof data === 'object' ? data : JSON.parse(data);
  
      // Update userDetails state with the user data
      setUserQrDetails(userData);
  
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
  

  const handleScan = (data) => {
    if (data) {
      // Pass the raw QR code data to handleVerify
      handleVerify(data, true);
      // Stop scanning after a successful scan
      handleStopScanning();
    }
  };


  // Function to handle manual input verification
  const handleManualInputVerification = () => {
    handleVerify(verificationData, false);
    // console.log('Manual Input Data:', verificationData);
  };

// Function to handle QR code verification from an uploaded image
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

      // Update userDetails state with the decoded data
      handleQrVerify(decodedData);

      // Clear verificationData state
      setVerificationData('');
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


// Function to handle marking attendance
const handleMarkAttendance = async () => {
  try {
    // Get ticketNo from browser storage
    const storedTicketNo = localStorage.getItem('ticketNo');

    // Check if storedTicketNo is available
    if (!storedTicketNo) {
      console.error('No ticketNo available for marking attendance');
      toast({
        title: 'Ticket number not available for marking attendance.',
        status: 'warning',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
      return;
    }

    // Verify the user with the stored ticketNo
    const verifyResponse = await axios.get('https://hhpm.onrender.com/api/v1/verifyUser', {
      params: { value: storedTicketNo, isQRCode: false },
    });

    const verifyData = verifyResponse.data;
    // console.log('Verify Response Data:', verifyData);

    if (verifyData.user) {
      // Check if the user has already attended the convention
      if (verifyData.user.attendanceStatus === 'Attended Convention') {
        console.error('User has already attended the convention.');
        toast({
          title: 'User has already attended the convention.',
          status: 'error',
          duration: 3000,
          position: 'top',
          isClosable: true,
        });
        return;
      }

      // Mark attendance only if the user is verified and not attended yet
      await axios.post('https://hhpm.onrender.com/api/v1/markAttendance', { ticketNo: storedTicketNo });

      toast({
        title: 'Attendance marked successfully',
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });

      // Reset state or perform any additional logic as needed
      setVerificationData('');
      setUserDetails(null);
      setUserQrDetails(null);
    } else {
      console.error('User not verified. Unable to mark attendance.');
      toast({
        title: 'User not verified. Unable to mark attendance.',
        status: 'error',
        duration: 3000,
        position: 'top',
        isClosable: true,
      });
    }
  } catch (error) {
    console.error('Error marking attendance:', error);

    // Display backend error dynamically in UI
    const errorMessage = error.response ? error.response.data.error : 'Failed to mark attendance';
    toast({
      title: `Error marking attendance: ${errorMessage}`,
      status: 'error',
      duration: 3000,
      position: 'top',
      isClosable: true,
    });
  }
};



  // Function to handle QR code scanning error
  const handleError = (error) => {
    console.error('Error reading QR code:', error);
    // Handle error (e.g., display an error message to the user)
  };

  // Function to start QR code scanning
  const handleStartScanning = () => {
    setIsScanning(true);
  };

  // Function to stop QR code scanning
  const handleStopScanning = () => {
    setIsScanning(false);
  };

  // Function to handle file upload for QR code verification
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




useEffect(() => {
  // Logic to run when QrDetails is updated
  if (QrDetails) {
    // Store the ticketNo in localStorage when QrDetails is available
    localStorage.setItem('ticketNo', QrDetails.ticketNo);
    setUserDetails(null); // Reset userDetails
    // Optionally, you can start scanning here if needed
    // handleStartScanning();
  }
}, [QrDetails]);


useEffect(() => {
  // Logic to run when userDetails is updated
  if (userDetails) {
    setUserQrDetails(null); // Reset QrDetails
  }
}, [userDetails]);


  return (
    <Flex direction="column" align="center" mt="8">
        <Button colorScheme="yellow" mb="4" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <Text fontSize="xl" fontWeight="bold" mb="4">
        Attendance Page
      </Text>
      {/* <Button
        colorScheme="teal"
        onClick={isScanning ? handleStopScanning : handleStartScanning}
        mb="4"
      >
        {isScanning ? 'Stop Scanning' : 'Scan QR'}
      </Button> */}

      {isScanning && (
  <QrScanner
    onScan={handleScan}
    onError={handleError}
    facingMode="environment"  // Set the facingMode to 'environment' for the back camera
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
          size="sm"
        />
        <Button colorScheme="teal" onClick={handleManualInputVerification} mb="2">
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
      {Object.values(userDetails).map((userData) => (
        <div key={`${userData.ticketNo}-${userData.email}`}>
          <Text>Name: {userData.name}</Text>
          <Text>Phone Number: {userData.phoneNumber}</Text>
          <Text>Email: {userData.email}</Text>
          <Text>Ticket Number: {userData.ticketNo}</Text>
          <Text>Church: {userData.church}</Text>
          <Text>Membership: {userData.isMember}</Text>
          <Text>Gender: {userData.gender}</Text>
          <Text>Age Group: {userData.ageGroup}</Text>
          <Text>Status: {userData.attendanceStatus}</Text>

          <Button colorScheme="green" onClick={handleMarkAttendance} mt="4">
            Mark Attendance
          </Button>
        </div>
      ))}
    </Box>
  )}

{!isScanning && QrDetails && (
  <Box mb="4">
    <Text fontSize="lg" fontWeight="bold" mb="2">
      User Details:
    </Text>
    <Text>Name: {QrDetails.name}</Text>
    <Text>Phone Number: {QrDetails.phoneNumber}</Text>
    <Text>Email: {QrDetails.email}</Text>
    <Text>Ticket Number: {QrDetails.ticketNo}</Text>
    <Text>Church: {QrDetails.church}</Text>
    <Text>Membership: {QrDetails.isMember}</Text>
    <Text>Gender: {QrDetails.gender}</Text>
    <Text>Age Group: {QrDetails.ageGroup}</Text>
    <Text>Status: {QrDetails.attendanceStatus}</Text>

    {/* Add the following code to store the ticketNo in browser storage */}
    <Button colorScheme="green" onClick={handleMarkAttendance} mt="4">
            Mark Attendance
          </Button>
  </Box>
)}


    </Flex>
  );
};

export default VerifyPage;
