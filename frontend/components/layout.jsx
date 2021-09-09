import React from 'react'
import { Flex } from '@chakra-ui/layout'
import Sidebar from '../components/Sidebar'

export default function Layout({ children }) {
	return (
		<Flex
			h={[null, null, '100vh']}
			flexDir={['column', 'column', 'row', 'row', 'row']}
			overflow='hidden'
			maxW='2000px'>
			{/* Column 1*/}
			<Flex
				w={['100%', '100%', '10%', '15%', '15%']}
				flexDir='column'
				align='center'
				backgroundColor='#020202'
				color='#fff'>
				<Sidebar />
			</Flex>

			{/* Column 2*/}
			<Flex
				w={['100%', '100%', '95%', '85%', '85%']}
				minW={[null, null, '300px', '300px', '400px']}
				p='3%'
				flexDir='column'
				overflow='auto'
				minH='100vh'>
				{children}
			</Flex>
		</Flex>
	)
}
