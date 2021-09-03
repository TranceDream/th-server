import React from 'react'
import { Flex, Text } from '@chakra-ui/layout'
import MyChart from './MyChart'

function HomeChart(props) {
	return (
		<Flex flexDir='column'>
			<Text fontSize='sm' color='gray'>
				{props.title}
			</Text>
			<Text fontSize='2xl' fontWeight='bold'>
				{props.value + (props.type == 'T' ? '°C' : '%rh')}
			</Text>
			<MyChart />
		</Flex>
	)
}

export default HomeChart
