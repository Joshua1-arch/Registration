import React from 'react';
import { Box, Text, Center, Link } from '@chakra-ui/react';

const Footer = () => {
  const whatsappNumber = '07049670618';
  const whatsappMessage = 'Hello%20Poolot!';

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <Box as="footer" mt="8">
      <Center>
        <Link href={whatsappLink} isExternal>
          <Text fontSize="sm" color="gray.500">
            Powered with Love by Poolot
          </Text>
        </Link>
      </Center>
    </Box>
  );
};

export default Footer;
