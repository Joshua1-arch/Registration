import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  extendTheme,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import WheelComponent from "react-wheel-of-prizes";
import Confetti from "react-confetti";
import axios from 'axios';


const customTheme = extendTheme({
  fonts: {
    heading: "Sometype Mono, monospace",
    body: "Sometype Mono, monospace",
  },
  styles: {
    global: {
      body: {
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "Sometype Mono, monospace",
        margin: 0,
      },
    },
  },
});

const RaffleSpinPage = () => {
  const segments = [
    "Generator",
    "Cash Prize",
    "Thank you",
    "Television",
    "Cash Prize",
    "CashBack",
    "Refrigerator",
    "Thank you",
    "Cashback",
    "Thank you",
  ];
  const segColors = [
    "#cd4548",
    "#1691d4",
    "#62b48c",
    "#ffa20f",
    "#7b6bb7",
    "#909a8c",
    "#7a1f1f",
    "#d1a365",
    "#114a96",
    "#009D4E",
  ];
  const [displayConfetti, setDisplayConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);

  useEffect(() => {
    const storedSpinsCount = localStorage.getItem('spinsCount');
    const storedTicketNumber = localStorage.getItem('ticketNumber');
    const existingTicketNumber = localStorage.getItem('permanentTicketNumber');

    if (storedSpinsCount && Number(storedSpinsCount) >= 1 && storedTicketNumber) {
      setShowModal(true);
    }

    if (!existingTicketNumber && storedTicketNumber) {
      localStorage.setItem('permanentTicketNumber', storedTicketNumber);
    }

    if (existingTicketNumber) {
      setTicketNumber(existingTicketNumber);
    }

    // Test API connection on load
    // testUpdatePrizeAndIP();
  }, []);

  const onFinished = (winner) => {
    const storedSpinsCount = localStorage.getItem('spinsCount');
    const storedTicketNumber = localStorage.getItem('ticketNumber');
    const existingTicketNumber = localStorage.getItem('permanentTicketNumber');
    const storedPrize = localStorage.getItem('prize');
  
    if (storedSpinsCount && Number(storedSpinsCount) >= 1 && storedTicketNumber) {
      setShowModal(true);
      return;
    }
  
    setWinner(winner);
    setDisplayConfetti(true);
    setTimeout(() => setDisplayConfetti(false), 3000);
  
    if (!existingTicketNumber && storedTicketNumber) {
      localStorage.setItem('permanentTicketNumber', storedTicketNumber);
    }
  
    if (existingTicketNumber) {
      setTicketNumber(existingTicketNumber);
    }
  
    // Save the prize in local storage if it doesn't already exist
    if (!storedPrize) {
      localStorage.setItem('prize', winner);
    }
  
    localStorage.setItem('spinsCount', 1);
    localStorage.setItem('ticketNumber', storedTicketNumber);
  
    // Call the function to update prize and IP
    updatePrizeAndIP(winner);
  };
  
  
  
  const updatePrizeAndIP = async () => {
    try {
      const storedTicketNumber = localStorage.getItem('ticketNumber'); // Get the ticket number from browser storage
      const storedPrize = localStorage.getItem('prize');
      const { data: { ip } } = await axios.get('https://api.ipify.org?format=json');
  
      const response = await axios.put(`https://luckydraw-ccb9.onrender.com/api/v1/updatePrize/${storedTicketNumber}`, { prize: storedPrize, ipAddress: ip });
     
      if (response.status === 200) {
        // console.log(response.data.message); // The success message received from the server
      } else {
        // console.error('Error updating prize and IP:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        // console.error('Server Error:', error.response.data);
        // console.error('Status Code:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        // console.error('Request Error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.error('Error:', error.message);
      }
    }
  };
  

  // const testUpdatePrizeAndIP = async () => {
  //   try {
  //     const dummyPrize = "Dummy Prize";
  //     const dummyTicketNumber = "T-243241";
  //     const dummyIp = "192.168.0.1";
  
  //     const response = await axios.put(`http://localhost:3000/api/v1/updatePrize/${dummyTicketNumber}`, { prize: dummyPrize, ipAddress: dummyIp });
  //     console.log(response.data.message); // The success message received from the server
  //   } catch (error) {
  //     console.error('Error testing update prize and IP:', error);
  //   }
  // };
  

  const goBack = () => {
    window.history.back();
  };



  return (
    <ChakraProvider theme={customTheme}>
      <br />
      <Text
        fontSize={{ base: "2xl", md: "4xl" }}
        fontWeight="bold"
        style={{
          position: "absolute",
          top: "6%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: "1",
        }}
      >
        Spin Page
      </Text>

      <Button
        colorScheme="yellow"
        size="md"
        onClick={goBack}
        position="absolute"
        bottom="100px"
        left="50%"
        transform="translateX(-50%)"
      >
        Go Back
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: "auto",
          marginTop: "10px",
          marginBottom: "200px",
          marginLeft: "400px",
          marginRight: "0px",
        }}
      >
        <WheelComponent
          segments={segments}
          segColors={segColors}
          winningSegment="MM"
          onFinished={onFinished}
          primaryColor="green"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={!localStorage.getItem('spinsCount')}
          size={190}
          upDuration={500}
          downDuration={600}
          fontFamily="Helvetica"
        />
      </div>
      {displayConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
        />
      )}
       {showModal ? (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
          <ModalOverlay />
          <ModalContent bg="gray.900" color="white" border="1px" borderColor="gray.700">
            <ModalHeader borderBottom="1px" borderColor="gray.700" textAlign="center">
              Sorry, you have already participated!.
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              {ticketNumber && ( // Check if ticketNumber exists before rendering
                <Text fontSize="sm" mt={4} textAlign="center">
                  Your ticket Number is: {ticketNumber}.
                </Text>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : winner !== null ? (
        <Modal isOpen={true} onClose={() => setShowModal(false)} size="md">
          <ModalOverlay />
          <ModalContent bg="gray.900" color="white" border="1px" borderColor="gray.700">
            <ModalHeader borderBottom="1px" borderColor="gray.700" textAlign="center">
              Congratulations!
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <Text fontSize="xl" textAlign="center">
                You won: {winner}
              </Text>
              {ticketNumber && ( // Check if ticketNumber exists before rendering
                <Text fontSize="sm" mt={4} textAlign="center">
                  Ticket Number: {ticketNumber}.
                </Text>
              )}
              <Text fontSize="sm" mt={4} textAlign="center">
                Please keep for reference purpose.
              </Text>
              <Text fontSize="sm" mt={4} textAlign="center">
                Enjoy your prize and thank you for participating!
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : null}
    </ChakraProvider>
  );
};

export default RaffleSpinPage;