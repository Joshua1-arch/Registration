import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash"
import {
  Toast,
  Box,
  SimpleGrid,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import Navbar from "../../components/navbar/navbar";

const AdminLandingPage = () => {
  const [participants, setParticipants] = useState([]);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [isSuccessMessageOpen, setIsSuccessMessageOpen] = useState(false);
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCount, setFilteredCount] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(10); 
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalPendingUsers, setTotalPendingUsers] = useState(0);
  const [totalAttendedUsers, setTotalAttendedUsers] = useState(0);
  


const [editedName, setEditedName] = useState("");
const [editedPhoneNumber, setEditedPhoneNumber] = useState("");
const [editedEmail, setEditedEmail] = useState("");
const [editedChurch, setEditedChurch] = useState("");
const [editedGender, setEditedGender] = useState("");
const [editedIsMember, setEditedIsMember] = useState("");
const [editedAgeGroup, setEditedAgeGroup] = useState("");
const [editedAttendanceStatus, setEditedAttendanceStatus] = useState("");

  

  const handleView = (participant) => {
    setSelectedParticipant(participant);
    setIsViewOpen(true);
  };
  
  const handleEdit = (participant) => {
    setSelectedParticipant(participant);
    setIsEditOpen(true);
  };
  
  
  

  const handleDelete = (participant) => {
    // console.log("Selected participant:", participant);
    setSelectedParticipant(participant);
    setIsDeleteAlertOpen(true);
  };
  
  
  const confirmDelete = async () => {
    try {
      if (!selectedParticipant) {
        console.error("No participant selected for deletion.");
        return;
      }
  
      const deleteUrl = `https://hhpm.onrender.com/api/v1/admin/deleteUser/${selectedParticipant.ticketNo}`;
      const response = await axios.delete(deleteUrl);
  
      // Check if the deletion was successful
      if (response.status === 200) {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((participant) => participant.ticketNo !== selectedParticipant.ticketNo)
        );
  
        toast({
          title: "User deleted successfully",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
      } else {
        // Handle other status codes or errors as needed
        console.error("Error deleting participant. Status:", response.status);
      }
  
      setIsDeleteAlertOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting participant:", error);
      // Error handling logic...
    }
  };
  
  
  


    // Handle changes for the number of items to show
    const handleItemsToShowChange = (event) => {
      setItemsToShow(parseInt(event.target.value, 10));
    };
  
  
    const handleEditButtonClose = () => {
      setIsEditOpen(false);
    };


  const handleViewClose = () => {
    setIsViewOpen(false);
  };

  const handleEditClose = async () => {
    try {
      const editUrl = `https://hhpm.onrender.com/api/v1/admin/editUser/${selectedParticipant.ticketNo}`;
      const response = await axios.put(editUrl, {
        name: editedName,
        phoneNumber: editedPhoneNumber,
        ticketNo: selectedParticipant.ticketNo,
        email: editedEmail,
        church: editedChurch,
        gender: editedGender,
        isMember: editedIsMember,
        ageGroup: editedAgeGroup,
        attendanceStatus: editedAttendanceStatus,
      });
  
      // console.log(response.data);
  
      // Update the local state with the edited participant
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.ticketNo === selectedParticipant.ticketNo
            ? {
                ...participant,
                name: editedName,
                phoneNumber: editedPhoneNumber,
                email: editedEmail,
                church: editedChurch,
                gender: editedGender,
                isMember: editedIsMember,
                ageGroup: editedAgeGroup,
                attendanceStatus: editedAttendanceStatus,
              }
            : participant
        )
      );
  
      // Clear the edited fields
      setEditedName("");
      setEditedPhoneNumber("");
      setEditedEmail("");
      setEditedChurch("");
      setEditedGender("");
      setEditedIsMember("");
      setEditedAgeGroup("");
      setEditedAttendanceStatus("");
  
      // Close the modal
      setIsEditOpen(false);
  
      toast({
        title: "User information updated successfully",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error editing participant:", error);
      // Error handling logic...
    }
  };
  
  
  

  
  const fetchParticipants = async () => {
    try {
      const response = await axios.get("https://hhpm.onrender.com/api/v1/admin/getAllUsers");
      const responseData = response.data;
  
      const totalParticipantsCount = Object.keys(responseData).length;
      const filteredParticipants = Object.keys(responseData)
        .filter((key) => {
          const participant = responseData[key];
          return (
            _.includes(participant.name.toLowerCase(), searchQuery.toLowerCase()) ||
            _.includes(participant.ticketNo, searchQuery) ||
            _.includes(participant.phoneNumber, searchQuery) ||
            _.includes(participant.email, searchQuery) ||
            _.includes(participant.church, searchQuery) ||
            _.includes(participant.isMember, searchQuery) ||
            _.includes(participant.gender, searchQuery) ||
            _.includes(participant.ageGroup, searchQuery) ||
            _.includes(participant.attendanceStatus, searchQuery)
          );
        })
        .map((key) => ({
          id: key,
          name: responseData[key].name,
          ticketNo: responseData[key].ticketNo,
          phoneNumber: responseData[key].phoneNumber,
          email: responseData[key].email || "",
          church: responseData[key].church,
          isMember: responseData[key].isMember,
          gender: responseData[key].gender,
          ageGroup: responseData[key].ageGroup,
          attendanceStatus: responseData[key].attendanceStatus,
        }));
  
      setParticipants(filteredParticipants);
      setFilteredCount(filteredParticipants.length);
      // setLoading(false);
  
      const totalPendingUsersCount = Object.values(responseData).filter(participant => participant.attendanceStatus === 'Pending').length;
      const totalAttendedUsersCount = Object.values(responseData).filter(participant => participant.attendanceStatus === 'Attended Convention').length;
  
      setTotalParticipants(totalParticipantsCount);
      setTotalPendingUsers(totalPendingUsersCount);
      setTotalAttendedUsers(totalAttendedUsersCount);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };
  
  
  useEffect(() => {
    fetchParticipants();
  }, [searchQuery]);


  
  return (
    
    <Box mt="4" p="4" bg="black" color="white" rounded="md">
        <Navbar /> 
      <Flex direction="column" align="center">
        <Text fontSize="xl" fontWeight="bold" mb="4" color="white">
          Registration Dashboard
        </Text>
      </Flex>
      <Flex direction="column" align="center" justify="center">
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="4">
      <Box bg="black" p="6" rounded="md" shadow="md">
        <Text fontSize="xl" fontWeight="bold" mb="4" color="white">
          Total Participants: {totalParticipants}
        </Text>
        <Text fontSize="xl" fontWeight="bold" mb="4" color="white">
          Total Pending Users: {totalPendingUsers}
        </Text>
        <Text fontSize="xl" fontWeight="bold" mb="4" color="white">
          Total Attended Users: {totalAttendedUsers}
        </Text>
      </Box>
    </SimpleGrid>
  </Flex>

      <Box mt="8">
        <Text fontSize="2xl" fontWeight="bold" mb="4" color="white">
          Participants Information
        </Text>
    
        <Flex mb="4" align="center">
        <Input
      placeholder="Search"
      bg="gray.800"
      color="white"
      flex="1"
      mr="4"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
            <Box>
          <Text as="span" mr="4" color="white">
            Show
          </Text>
          <Input
            as="select"
            bg="gray.800"
            color="white"
            w="24"
            value={itemsToShow}
            onChange={handleItemsToShowChange}
            mr="4"
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </Input>
        </Box>
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon />}
            colorScheme="teal"
            mr="2"
          />
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon />}
            colorScheme="teal"
          />
        </Flex>
        <Table variant="simple" bg="gray.700" rounded="md" shadow="md" color="white" fontSize="sm">
      
        <Thead>
          <Tr>
            <Th color="white">S/N</Th>
            <Th color="white">Name</Th>
            <Th color="white">Ticket No</Th>
            <Th color="white">Phone Number</Th>
            <Th color="white">Email </Th>
            <Th color="white">Church </Th>
            <Th color="white">Gender</Th>
            <Th color="white">Member</Th>
            <Th color="white">Age Group</Th>
            <Th color="white">Attendance Status</Th>

          </Tr>
        </Thead>
        <Tbody>
        {
  participants.length === 0 ? (
    <Tr>
      <Td colSpan="9">No participants found.</Td>
    </Tr>
  ) : (
    participants.map((participant, index) => (
      <Tr key={participant.id}>
        <Td color="white">{index + 1}</Td>
        <Td color="white">{participant.name}</Td>
        <Td color="yellow">{participant.ticketNo}</Td>
        <Td color="white">{participant.phoneNumber}</Td>
        <Td color="white">{participant.email}</Td>
        <Td color="white">{participant.church}</Td>
        <Td color="white">{participant.gender}</Td>
        <Td color="white">{participant.isMember}</Td>
        <Td color="white">{participant.ageGroup}</Td>
        <Td color="yellow">{participant.attendanceStatus}</Td>

        <Td color="white">
          <IconButton
            aria-label="Edit"
            icon={<EditIcon />}
            colorScheme="teal"
            mr="2"
            onClick={() => handleEdit(participant)}
          />
          <IconButton
            aria-label="View"
            icon={<ViewIcon />}
            colorScheme="blue"
            mr="2"
            onClick={() => handleView(participant)}
          />
          <IconButton
            aria-label="Delete"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => handleDelete(participant)}
          />
        </Td>
      </Tr>
    ))
  )
}

</Tbody>

      </Table>
      </Box>

         {/* View Participant Modal */}
    <Modal isOpen={isViewOpen} onClose={handleViewClose}>
      <ModalOverlay />
      <ModalContent bg="#2d3748" color="white">
        <ModalHeader>Participant Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedParticipant && (
            <Box>
              <Text>Name: {selectedParticipant.name}</Text>
              <Text>Phone Number: {selectedParticipant.phoneNumber}</Text>
              <Text>Ticket No: {selectedParticipant.ticketNo}</Text>
              <Text>Email: {selectedParticipant.email}</Text>
              <Text>Church: {selectedParticipant.church}</Text>
              <Text>Gender: {selectedParticipant.gender}</Text>
              <Text>Member: {selectedParticipant.isMember}</Text>
              <Text>Age Group: {selectedParticipant.ageGroup}</Text>
              <Text>Attendance: {selectedParticipant.attendanceStatus}</Text>
        

            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleViewClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>


    

    {/* Edit Participant Modal */}
     <Modal isOpen={isEditOpen} onClose={handleEditButtonClose}>
        <ModalOverlay />
        <ModalContent bg="#2d3748" color="white">
          <ModalHeader>Edit Participant</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedParticipant && (
              <Box>
                <Input defaultValue={selectedParticipant.name } mb={3} />
                <Input defaultValue={selectedParticipant.phoneNumber} mb={3} />
                <Input isReadOnly defaultValue={selectedParticipant.ticketNo} mb={3} />
                <Input defaultValue={selectedParticipant.email} mb={3} />
                <Input defaultValue={selectedParticipant.church} mb={3} />
                <Input defaultValue={selectedParticipant.gender} mb={3} />
                <Input defaultValue={selectedParticipant.isMember} mb={3} />
                <Input defaultValue={selectedParticipant.ageGroup} mb={3} />
                <Input defaultValue={selectedParticipant.attendanceStatus} mb={3} />

              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditClose}>
              Save
            </Button>
            <Button variant="ghost" onClick={handleEditButtonClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>  

    


      {/* Delete Participant Confirmation Dialog */}
     
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="#2d3748" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Participant
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this participant? This action is irreversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteAlertOpen(false)}>Cancel</Button>
              <Button colorScheme="red" ml={3} onClick={confirmDelete}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>

    
  );
};

export default AdminLandingPage;