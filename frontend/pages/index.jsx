import React, { useState, useEffect } from 'react'
import {
	Flex,
	Heading,
	Text,
	IconButton,
	Skeleton,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	AspectRatio,
	Divider,
} from '@chakra-ui/react'
import { FiCalendar } from 'react-icons/fi'
import { withRouter } from 'next/router'
import TChart from '@/components/TChart'
import HChart from '@/components/HChart'

function Home() {
	const [currentTH, setCurrentTH] = useState({ l: false, t: null, h: null })
	const [dateTH, setDateTH] = useState({ l: false, thdata: {data: []} })
	const [tdata, setTdata] = useState([])
	const [hdata, setHdata] = useState([])

	const [selectedDate, setSelectedDate] = useState({ d: new Date() })

	useEffect( async () => {
		const params = new URLSearchParams(window.location.search)
		let ip = params.get('ip')
		fetch('http://' + ip + '/getTH', {
			method: 'GET',
			mode: 'cors',
		})
			.then((value) => {
				console.log(value)
				return value.json()
			})
			.then((value) => {
				setCurrentTH({
					l: true,
					t: value.temperature,
					h: value.humidity,
				})
			})
		fetch('https://th-server-backend-tranced.vercel.app/api/date', {
			method: 'POST',
			headers: {
				'Content-Type':
					'application/x-www-form-urlencoded;charset=UTF-8',
			},
			body: new URLSearchParams({
				date: new Date('2021/9/4'),
			}),
		})
			.then((res) => {
				return res.json()
			})
			.then((value) => {
				setDateTH({
					l: true,
					thdata: value,
				})
				const tempT = []
				const tempH = []
				value.data.map((element) => {
					const elementDate = new Date(element.date)
					const str =
						'' +
						elementDate.getHours() +
						':' +
						elementDate.getMinutes() +
						':' +
						elementDate.getSeconds()
					tempT.push({ x: str, y: element.temperature })
					tempH.push({ x: str, y: element.humidity })
				})
				setTdata(tempT)
				setHdata(tempH)
			})
	}, [])

	return (
		<>
			<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
				Welcome back.
			</Heading>
			<Flex flexDir='row' maxW='100%'>
				<Flex flexDir='column' flex={1} mr={2}>
					<Text fontSize='sm' color='gray'>
						Temperature
					</Text>
					<Skeleton isLoaded={currentTH.l}>
						<Text fontSize='2xl' fontWeight='bold'>
							{(currentTH.l ? currentTH.t : 'null') + '°C'}
						</Text>
					</Skeleton>
				</Flex>
				<Flex flexDir='column' flex={1} ml={2}>
					<Text fontSize='sm' color='gray'>
						Humidity
					</Text>
					<Skeleton isLoaded={currentTH.l}>
						<Text fontSize='2xl' fontWeight='bold'>
							{(currentTH.l ? currentTH.h : 'null') + '%rh'}
						</Text>
					</Skeleton>
				</Flex>
			</Flex>
			<Divider mt={2} />
			<Flex justifyContent='space-between' mt={4}>
				<Flex align='flex-end'>
					<Heading as='h2' size='lg' letterSpacing='tight'>
						Overview
					</Heading>
					<Text fontSize='small' color='gray' ml={4}>
						2021/9/4
					</Text>
				</Flex>
				<IconButton icon={<FiCalendar />} />
			</Flex>

			<Flex flexDir='row' maxW='100%'>
				<Flex flexDir='column' flex={1} mr={2}>
					<AspectRatio ratio={18 / 9}>
						<TChart tdata={tdata} />
					</AspectRatio>
				</Flex>
				<Flex flexDir='column' flex={1} ml={2}>
					<AspectRatio ratio={18 / 9}>
						<HChart hdata={hdata} />
					</AspectRatio>
				</Flex>
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
							{console.log(dateTH)}
							{dateTH.l ? (
								dateTH.thdata.data.map((element) => {
									const elementDate = new Date(element.date)
									return (
										<Tr key={element._id}>
											<Td>
												{elementDate.getFullYear() +
													'/' +
													(elementDate.getMonth() +
														1) +
													'/' +
													elementDate.getDate() +
													' ' +
													elementDate.getHours() +
													':' +
													elementDate.getMinutes() +
													':' +
													elementDate.getSeconds()}
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
								})
							) : (
								<Tr>
									<Td>
										<Skeleton isLoaded={dateTH.l} />
									</Td>
									<Td>
										<Skeleton isLoaded={dateTH.l} />
									</Td>
									<Td>
										<Skeleton isLoaded={dateTH.l} />
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</Flex>
			</Flex>
		</>
	)
}

export default withRouter(Home)
