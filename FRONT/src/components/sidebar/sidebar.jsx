import React from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Text, Heading, Button } from '@chakra-ui/react';
import { SidebarData } from "./sidebarData";

export default function Sidebar() {

    return (
        <div className="sidebar">
            <ul className="sidebar-list">
                {SidebarData.map((val, key) => {
                    return (
                        <li key={key}
                            className="row"
                            onClick={() => {
                            window.location.pathname = val.link
                        }}>
                            {""}
                            <div>{val.icon}</div>{""}
                            <div>{val.title}</div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )

}

{/* <Box bg="gray.200" h="100vh" w="250px" position="fixed" top="0" left="0" className="container">
     <Box p="4">
       <Heading size="md" mb="4">
         My App
       </Heading>
       <Text mb="4">
         This is a sample sidebar component for your React app.
       </Text>
       <Button colorScheme="blue">Logout</Button>
     </Box>
   </Box> */}
