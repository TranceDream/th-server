import React from 'react'
import { Flex, Text } from '@chakra-ui/layout'
import MyChart from './TChart'
import { AspectRatio, Spinner } from '@chakra-ui/react'

function HomeTitle(props) {
	return (
		<Flex flexDir='column'>
			<Text fontSize='sm' color='gray'>
				{props.title}
			</Text>

			<Text fontSize='2xl' fontWeight='bold'>
				{props.value + (props.type == 'T' ? '°C' : '%rh')}
			</Text>
		</Flex>
	)
}

export default HomeTitle
