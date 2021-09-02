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

export default function Home() {
	const [expand, changeExpand] = useState(false)
	return (
		<>
			<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
				Welcome back.
			</Heading>
			<Flex flexDir='row' maxW='100%'>
				<Flex flexDir='column' flex={1} mr={2}>
					<HomeChart title='Temperature' type='T' value='37.8' />
				</Flex>
				<Flex flexDir='column' flex={1} ml={2}>
					<HomeChart title='Humidity' type='H' value='55' />
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
							<Tr>
								<Td>2021/8/30</Td>
								<Td>
									<Flex display='inline-table'>
										<Text fontWeight='bold'>888</Text>
									</Flex>
									&deg;C
								</Td>
								<Td>
									<Flex display='inline-table'>
										<Text fontWeight='bold'>20</Text>
									</Flex>
									%rh
								</Td>
							</Tr>
							<Tr>
								<Td>2021/8/31</Td>
								<Td>
									<Flex display='inline-table'>
										<Text fontWeight='bold'>36.5</Text>
									</Flex>
									&deg;C
								</Td>
								<Td>
									<Flex display='inline-table'>
										<Text fontWeight='bold'>21</Text>
									</Flex>
									%rh
								</Td>
							</Tr>
							<Tr>
								<Td>2021/8/32</Td>
								<Td>
									<Flex display='inline-table'>
										<Text fontWeight='bold'>37.25</Text>
									</Flex>
									&deg;C
								</Td>
								<Td>
									<Flex display='inline-table'>
										<Text fontWeight='bold'>55.5</Text>
									</Flex>
									%rh
								</Td>
							</Tr>
							{expand == true && (
								<>
									<Tr>
										<Td>2021/8/33</Td>
										<Td>
											<Flex display='inline-table'>
												<Text fontWeight='bold'>
													-9
												</Text>
											</Flex>
											&deg;C
										</Td>
										<Td>
											<Flex display='inline-table'>
												<Text fontWeight='bold'>5</Text>
											</Flex>
											%rh
										</Td>
									</Tr>
									<Tr>
										<Td>2021/9/1</Td>
										<Td>
											<Flex display='inline-table'>
												<Text fontWeight='bold'>9</Text>
											</Flex>
											&deg;C
										</Td>
										<Td>
											<Flex display='inline-table'>
												<Text fontWeight='bold'>
													9.9
												</Text>
											</Flex>
											%rh
										</Td>
									</Tr>
								</>
							)}
						</Tbody>
					</Table>
				</Flex>
				<Flex align='center'>
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
				</Flex>
			</Flex>
		</>
	)
}
