import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

export default function ForecastItem(weather) {
	console.log(weather)
	return (
		<Flex flex={1} flexDir='column' justifyContent='center'>
			<Text fontSize='xl' fontWeight='bold'>
				{weather.weather.fxDate}
			</Text>
			<Flex flexDir='row' mt={2}>
				<Flex flexDir='column' flex={1}>
					<Text fontSize='sm' color='gray'>
						Day
					</Text>
					<Image
						h={12}
						w={12}
						src={'/' + weather.weather.iconDay + '.png'}
					/>
					<Text mt={2}>{weather.weather.textDay}</Text>
				</Flex>
				<Flex flexDir='column' flex={1}>
					<Text fontSize='sm' color='gray'>
						Night
					</Text>
					<Image
						h={12}
						w={12}
						src={'/' + weather.weather.iconNight + '.png'}
					/>
					<Text letterSpacing='tight' overflow='auto' mt={2}>{weather.weather.textNight}</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}
