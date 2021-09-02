import React, { useState } from 'react'
import {
	Flex,
	Heading,
	Text,
	IconButton,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Divider,
} from '@chakra-ui/react'
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import HomeChart from '../components/HomeChart'

export async function getStaticProps() {
	const res = await fetch('http://localhost:9000/api/all')
	const all = await res.json()

	return {
		props: {
			all,
		},
	}
}

export default function Home({ all }) {
	// const [expand, changeExpand] = useState(false)
	return (
		<>
			<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
				Welcome back.
			</Heading>
			<Flex flexDir='row' maxW='100%'>
				<Flex flexDir='column' flex={1} mr={2}>
					<HomeChart
						title='Temperature'
						type='T'
						value={all.data[0].temperature}
					/>
				</Flex>
				<Flex flexDir='column' flex={1} ml={2}>
					<HomeChart
						title='Humidity'
						type='H'
						value={all.data[0].humidity}
					/>
				</Flex>
			</Flex>
			<Flex justifyContent='space-between' mt={8}>
				<Flex align='flex-end'>
					<Heading as='h2' size='lg' letterSpacing='tight'>
						Data of the week
					</Heading>
					<Text fontSize='small' color='gray' ml={4}>
						Aug 2021
					</Text>
				</Flex>
				<IconButton icon={<FiCalendar />} />
			</Flex>
			<Flex flexDir='column'>
				<Flex overflow='auto'>
					<Table variant='unstyled' mt={4}>
						<Thead>
							<Tr color='gray'>
								<Th>Date</Th>
								<Th isNumeric>Temperature</Th>
								<Th isNumeric>Humidity</Th>
							</Tr>
						</Thead>
						<Tbody>
							{all.data.map((element) => {
								const elementDate = new Date(element.date)
								return (
									<Tr key={element._id}>
										<Td>
											{elementDate.getFullYear() +
												'/' +
												(elementDate.getMonth() + 1) +
												'/' +
												elementDate.getDate()}
										</Td>
										<Td>
											<Flex display='inline-table'>
												<Text fontWeight='bold'>
													{element.temperature}
												</Text>
											</Flex>
											&deg;C
										</Td>
										<Td>
											<Flex display='inline-table'>
												<Text fontWeight='bold'>
													{element.humidity}
												</Text>
											</Flex>
											%rh
										</Td>
									</Tr>
								)
							})}
						</Tbody>
					</Table>
				</Flex>
				{/* <Flex align='center'>
					<Divider />
					<IconButton
						icon={
							expand == true ? <FiChevronUp /> : <FiChevronDown />
						}
						onClick={() => {
							console.log(expand)
							changeExpand(!expand)
						}}
					/>
					<Divider />
				</Flex> */}
			</Flex>
		</>
	)
}
