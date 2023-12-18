import React from 'react';
import { motion } from 'framer-motion';
import { Box, Card, Heading, extendTheme } from '@chakra-ui/react';
import Form from '../../components/form/form';

const customTheme = extendTheme({
  fonts: {
    heading: 'Sometype Mono, monospace',
    body: 'Sometype Mono, monospace',
  },
  styles: {
    global: {
      body: {
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'Sometype Mono, monospace',
        margin: 0,
      },
    },
  },
});

function Home() {
  return (
    <Box textAlign="center" fontSize="xl">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          maxW="md"
          mx="auto"
          mt={100}
          p={8}
          rounded="md"
          shadow="md"
          sx={{
            backgroundColor: '#ffffff',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            padding: '40px',
            borderRadius: '12px',
            width: '400px',
            textAlign: 'center',
          }}
        >
          <Heading as="h2" size="xl">
            REGISTRATION
          </Heading>
          <Form />
        </Card>
      </motion.div>
    </Box>
  );
}

export default Home;
