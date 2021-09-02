import React from 'react'
import { Flex } from '@chakra-ui/layout'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
	return (
		<Flex h='100vh' flexDir='row' overflow='hidden' maxW='2000px'>
			{/* Column 1*/}
			<Flex
				w='15%'
				flexDir='column'
				align='center'
				backgroundColor='#020202'
				color='#fff'>
				<Sidebar />
			</Flex>

			{/* Column 2*/}
			<Flex
				w='85%'
				p='3%'
				flexDir='column'
				overflow='auto'
				minH='100vh'
				sx={{
					'&::-webkit-scrollbar': {
						width: '8px',
						borderRadius: '4px',
						backgroundColor: '#f5f5f5',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: '#555555',
						borderRadius: '4px',
						cursor: 'pointer',
					},
				}}>
				{children}
			</Flex>
		</Flex>
	)
}
