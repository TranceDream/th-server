import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
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
	AspectRatio,
	Divider,
} from '@chakra-ui/react'
import { FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import HomeTitle from '../components/HomeLabel'
import { useRouter } from 'next/router'
import TChart from '@/components/TChart'
import HChart from '@/components/HChart'

// export async function getStaticProps() {
// const res = await fetch(
// 	'https://th-server-backend-tranced.vercel.app/api/date',
// 	{
// 		method: 'POST',
// 		headers: {
// 			'Content-Type':
// 				'application/x-www-form-urlencoded;charset=UTF-8',
// 		},
// 		body: new URLSearchParams({
// 			date: new Date('2021/9/4'),
// 		}),
// 	}
// )
// // const res = await fetch(
// // 	'http://localhost:9000/api/all'
// // )
// const thdata = await res.json()
// return {
// 	props: {
// 		thdata,
// 	},
// }
// }

export default function Home({ thdata }) {
	// const router = useRouter()
	// console.log(router.query.ip)

	const [currentTH, setCurrentTH] = useState({ t: null, h: null })
	const [dateTH, setDateTH] = useState({ l: false, thdata: [] })
	const [tdata, setTdata] = useState([])
	const [hdata, setHdata] = useState([])
	const [selectedDate, setSelectedDate] = useState({ d: new Date() })

	useEffect(async () => {
		const res = await fetch(
			'https://th-server-backend-tranced.vercel.app/api/date',
			{
				method: 'POST',
				headers: {
					'Content-Type':
						'application/x-www-form-urlencoded;charset=UTF-8',
				},
				body: new URLSearchParams({
					date: new Date('2021/9/4'),
				}),
			}
		)
		await res.json().then((value) => {
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
					<HomeTitle
						title='Temperature'
						type='T'
						value={
							dateTH.l
								? dateTH.thdata.data[0].temperature
								: 'wait'
						}
					/>
				</Flex>
				<Flex flexDir='column' flex={1} ml={2}>
					<HomeTitle
						title='Humidity'
						type='H'
						value={
							dateTH.l ? dateTH.thdata.data[0].humidity : 'wait'
						}
					/>
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
									<Td></Td>
									<Td></Td>
									<Td></Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</Flex>
			</Flex>
		</>
	)
}
