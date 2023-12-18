import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../components/modal/modal';



import {
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
 
} from '@chakra-ui/react';
import axios from 'axios';


const CustomLoadingModal = () => (
  <div className="loading-modal">
    <p>Loading...</p>
  </div>
);


const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    church: '',
    gender: '',
    email: '',
    isMember: '',
    ageGroup: '',
  });

  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

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
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.gender) {
      setError('Please select Gender.');
      setIsOpen(true);
      setIsLoading(false);
      return;
      
    }
  
    if (formData.isMember === null) {
      setError('Please select Membership.');
      setIsOpen(true);
      setIsLoading(false);
      return;
    }

     // Check if a membership option is selected
  if (!formData.isMember) {
    // Display a pop-up or alert
    setError('Please select Membership.');
    setIsOpen(true);
    setIsLoading(false);
    return;
  }
    if (formData.ageGroup.length === 0) {
      setError('Please select at least one Age Group.');
      setIsOpen(true);
      setIsLoading(false);
      return;
    }

     
    
  
    try {
      // console.log('Data sent to API:', formData);
  
      const response = await axios.post(
        'https://hhpm.onrender.com/api/v1/addUser',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const { id, ticketNo, ...userData } = response.data; // Extract ticketNo from response
  
      setUserData({
        ...userData,
        ticketNo, // Include ticketNo in userData
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
    setIsLoading(false);
  };
  


  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrcode');
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  const handleNewResponse = () => {
    setIsModalOpen(false);
    setUserData(null);
  };

    return (
      <>
        <form onSubmit={handleFormSubmit}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="phoneNumber" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="church" isRequired>
            <FormLabel>Church</FormLabel>
            <Input
              type="text"
              id="church"
              value={formData.church}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="text"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
<br />
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
          {isLoading && <CustomLoadingModal />}
        </form>

        <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={handleClose}>
          <AlertDialogOverlay />
          <AlertDialogContent
            bg="gray.800"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.600"
            borderRadius="md"
            color="white"
          >
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
    </>
  );

};


export default Form;