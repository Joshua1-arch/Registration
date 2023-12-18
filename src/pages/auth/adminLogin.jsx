import React, { useState } from "react";
import axios from "axios";
import {
  ChakraProvider,
  extendTheme,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "black",
        color: "white",
      },
    },
  },
});

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("https://hhpm.onrender.com/api/v1/admin/login", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setIsModalOpen(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Error logging in. Please check username and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="gray.700" color="white">
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} bg="gray.800" color="white" size="lg" />
          </FormControl>
          <FormControl id="password" isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} bg="gray.800" color="white" size="lg" />
          </FormControl>
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
            </Alert>
          )}
          <Button colorScheme="teal" variant="solid" width="full" mt={6} onClick={handleLogin} _hover={{ bg: "teal.500" }}>
            Sign In
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="#2d3748" color="white">
          <ModalHeader>Please wait, you are being logged in</ModalHeader>
          <ModalBody display="flex" alignItems="center" justifyContent="center">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default AdminLogin;
