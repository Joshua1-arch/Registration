import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Stack,
  Text,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';
import CustomModal from '../../components/modal/modal';
import Navbar from '../../components/navbar/navbar';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    church: '',
    gender: '',
    email: '',
    isMember: '',
    ageGroup: [],
  });

  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('Attended Convention');
  const navigate = useNavigate();

  const handleClose = () => setIsOpen(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUserData(null);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (e.target.id === 'ageGroup') {
      const selectedAgeGroup = e.target.value;

      setFormData({
        ...formData,
        ageGroup: [selectedAgeGroup],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: value,
      });
    }
  };

  const handleNewResponse = () => {
    setIsModalOpen(false);
    setUserData(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.gender) {
      setError('Please select Gender.');
      setIsOpen(true);
      return;
    }

    if (formData.isMember === null) {
      setError('Please select Membership.');
      setIsOpen(true);
      return;
    }

    // Check if a membership option is selected
    if (!formData.isMember) {
      // Display a pop-up or alert
      setError('Please select Membership.');
      setIsOpen(true);
      return;
    }

    if (formData.ageGroup.length === 0) {
      setError('Please select at least one Age Group.');
      setIsOpen(true);
      return;
    }

    try {
      // Add attendanceStatus to the formData
      const formDataWithAttendance = {
        ...formData,
        attendanceStatus,
      };

    //   console.log('Data sent to API:', formDataWithAttendance);

      const response = await axios.post(
        'https://hhpm.onrender.com/api/v1/addUserFromAdmin',
        formDataWithAttendance, // Send formDataWithAttendance to the API
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { id, ticketNo, ...userData } = response.data;

      setUserData({
        ...userData,
        ticketNo,
      });
      setIsModalOpen(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else if (error.request) {
        setError('Request failed. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setIsOpen(true);
    }
  };

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrcode');
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };


  return (
    <>
    <Navbar />
    <Box maxW="md" mx="auto" p={4} bg="white" boxShadow="md" borderRadius="md" color="black">
      <form onSubmit={handleFormSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input type="text" id="name" value={formData.name} onChange={(e) => handleChange(e, 'name')} />
        </FormControl>

        <FormControl id="phoneNumber" isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input type="tel" id="phoneNumber" value={formData.phoneNumber} onChange={(e) => handleChange(e, 'phoneNumber')} />
        </FormControl>

        <FormControl id="church" isRequired>
          <FormLabel>Church</FormLabel>
          <Input type="text" id="church" value={formData.church} onChange={(e) => handleChange(e, 'church')} />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="text" id="email" value={formData.email} onChange={(e) => handleChange(e, 'email')} />
        </FormControl>

        <FormControl id="gender" >
            <FormLabel>Gender</FormLabel>
            <Stack direction="row">
              <Checkbox
                id="isMale"
                isChecked={formData.gender === 'male'}
                onChange={() => setFormData({ ...formData, gender: 'male' })}
              >
                Male
              </Checkbox>
              <Checkbox
                id="isFemale"
                isChecked={formData.gender === 'female'}
                onChange={() => setFormData({ ...formData, gender: 'female' })}
              >
                Female
              </Checkbox>
            </Stack>
          </FormControl>
          <br />

     <FormControl id="isMember">
  <FormLabel>Membership</FormLabel>
  <Stack direction="row">
    <Checkbox
      isChecked={formData.isMember === 'Existing'}
      onChange={() => setFormData({ ...formData, isMember: 'Existing' })}
    >
      Member
    </Checkbox>
    <Checkbox
      isChecked={formData.isMember === 'New'}
      onChange={() => setFormData({ ...formData, isMember: 'New' })}
    >
      Non-Member
    </Checkbox>
  </Stack>
</FormControl>


<br />

<FormControl id="ageGroup" >
            <FormLabel>Age Group</FormLabel>
            <Stack direction="row">
              <Checkbox
                id="ageGroup"
                value="adult"
                isChecked={formData.ageGroup.includes('adult')}
                onChange={handleChange}
              >
                Adult
              </Checkbox>
              <Checkbox
                id="ageGroup"
                value="youth"
                isChecked={formData.ageGroup.includes('youth')}
                onChange={handleChange}
              >
                Youth
              </Checkbox>
              <Checkbox
                id="ageGroup"
                value="teenager"
                isChecked={formData.ageGroup.includes('teenager')}
                onChange={handleChange}
              >
                Teenager
              </Checkbox>
              <Checkbox
                id="ageGroup"
                value="children"
                isChecked={formData.ageGroup.includes('children')}
                onChange={handleChange}
              >
                Child
              </Checkbox>
            </Stack>
          </FormControl>


        <FormControl id="attendanceStatus" mt={4}>
          <FormLabel>Attendance Status</FormLabel>
          <Select
            id="attendanceStatus"
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
          >
            <option value="Attended Convention">Attended Convention</option>
            <option value="Not Checked In">Not Checked In</option>
            <option value="Checked In">Checked In</option>
          
          </Select>
        </FormControl>

        <Button
          colorScheme="black"
          mt={6}
          type="submit"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s',
            width: '100%',
            _hover: {
              backgroundColor: 'gray',
            },
          }}
        >
          Submit
        </Button>
      </form>

      <Text mt={4} fontWeight="bold">
        Attendance Status: {attendanceStatus}
      </Text>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={handleClose}>
        <AlertDialogOverlay />
        <AlertDialogContent bg="gray.800" borderWidth="1px" borderStyle="solid" borderColor="gray.600" borderRadius="md" color="white">
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
            An error occurred
          </AlertDialogHeader>

          <AlertDialogBody color="white">{error}</AlertDialogBody>

          <AlertDialogFooter>
            <Button colorScheme="red" onClick={handleClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CustomModal
  isOpen={isModalOpen}
  onClose={handleModalClose}
  userData={userData}
  onDownloadQRCode={handleDownloadQRCode}
  onNewResponse={handleNewResponse}
/>
    </Box>
    <br />

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Button colorScheme="yellow" mb="4" onClick={() => navigate(-1)}>
    Go Back
  </Button>
</div>

    </>
  );
};

export default AddUser;
