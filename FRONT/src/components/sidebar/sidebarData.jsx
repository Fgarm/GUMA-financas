import React from "react";
import { Icon } from '@chakra-ui/react'
import { BsGraphUp } from 'react-icons/bs'
import { TbChartInfographic } from 'react-icons/tb';
import { BiLogOut } from 'react-icons/bi'


export const SidebarData = [
    {
        title: "Gerar Gráfico",
        icon: <Icon as={TbChartInfographic}/>,
        link: "login"
    },

    {
        title: "LogOut",
        icon: <Icon as={BiLogOut}/>,
        link: "/"
    }


]
