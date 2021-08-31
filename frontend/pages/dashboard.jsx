import React, { useState } from 'react'
import {
	Flex,
	Heading,
	Avatar,
	AvatarGroup,
	Text,
	Icon,
	IconButton,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Divider,
	Link,
	Box,
	Button,
	Input,
	InputGroup,
	InputLeftElement,
} from '@chakra-ui/react'
import {
	FiHome,
	FiPieChart,
	FiDollarSign,
	FiBox,
	FiCalendar,
	FiChevronDown,
	FiChevronUp,
	FiPlus,
	FiThermometer,
	FiDropLet,
	FiCreditCard,
	FiSearch,
	FiBell,
	FiDroplet,
	FiActivity,
	FiSettings,
} from 'react-icons/fi'
import MyChart from '../components/MyChart'

export default function dashboard() {
	const [expand, changeExpand] = useState('false')
	return (
		<Flex h='100vh' flexDir='row' overflow='hidden' maxW='2000px'>
			{/* Column 1*/}
			<Flex
				w='15%'
				flexDir='column'
				align='center'
				backgroundColor='#020202'
				color='#fff'>
				<Flex flexDir='column' justifyContent='space-between' h='100vh'>
					<Flex flexDir='column' as='nav'>
						<Heading
							mt={50}
							mb={100}
							fontSize='2xl'
							alignSelf='center'
							letterSpacing='tight'>
							TH Server
						</Heading>
						<Flex
							flexDir='column'
							align='flex-start'
							justifyContent='center'>
							<Flex className='sidebar-items'>
								<Link>
									<Icon
										as={FiHome}
										fontSize='2xl'
										className='active-icon'
									/>
								</Link>
								<Link _hover={{ textDecor: 'none' }}>
									<Text className='active'>Home</Text>
								</Link>
							</Flex>
							<Flex className='sidebar-items'>
								<Link>
									<Icon as={FiThermometer} fontSize='2xl' />
								</Link>
								<Link _hover={{ textDecor: 'none' }}>
									<Text>Temperature</Text>
								</Link>
							</Flex>
							<Flex className='sidebar-items'>
								<Link>
									<Icon as={FiDroplet} fontSize='2xl' />
								</Link>
								<Link _hover={{ textDecor: 'none' }}>
									<Text>Humidity</Text>
								</Link>
							</Flex>
							<Flex className='sidebar-items'>
								<Link>
									<Icon as={FiActivity} fontSize='2xl' />
								</Link>
								<Link _hover={{ textDecor: 'none' }}>
									{/* TODO */}
									<Text>TODO</Text>
								</Link>
							</Flex>
						</Flex>
					</Flex>

					<Flex flexDir='column' alignItems='center' mb={10} mt={5}>
						<Icon as={FiSettings} my={2} fontSize='3xl' />
						<Text textAlign='center'>Settings</Text>
					</Flex>
				</Flex>
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
				<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
					Welcome back.
				</Heading>
				<Flex flexDir='row' maxW='100%'>
					<Flex flexDir='column' flex={1} mr={2}>
						<Text fontSize='sm' color='gray'>
							Temperature
						</Text>
						<Text fontSize='2xl' fontWeight='bold'>
							28&deg;C
						</Text>
						<MyChart />
					</Flex>
					<Flex flexDir='column' flex={1} ml={2}>
						<Text fontSize='sm' color='gray'>
							Humidity
						</Text>
						<Text fontSize='2xl' fontWeight='bold'>
							100%rh
						</Text>
						<MyChart />
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
													<Text fontWeight='bold'>
														5
													</Text>
												</Flex>
												%rh
											</Td>
										</Tr>
										<Tr>
											<Td>2021/9/1</Td>
											<Td>
												<Flex display='inline-table'>
													<Text fontWeight='bold'>
														9
													</Text>
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
								expand == true ? (
									<FiChevronUp />
								) : (
									<FiChevronDown />
								)
							}
							onClick={() => {
								changeExpand(!expand)
							}}
						/>
						<Divider />
					</Flex>
				</Flex>
			</Flex>

			{/* Column 3*/}
			{/* <Flex
				w='0%'
				bgColor='#f5f5f5'
				p='3%'
				flexDir='column'
				overflow='auto'></Flex> */}
		</Flex>
	)
}
