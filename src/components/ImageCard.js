import React from 'react';
import {Box, Image} from '@chakra-ui/react'

export const ImageCard = ({ name, src, href, ...props }) => (
  <Box
    as="a"
    maxW="sm"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    href={href}
    target="_blank"
    {...props}
  >
    <Image src={src} alt={name} srl_gallery_image="true" />
  </Box>
);
