import ForecastItem from '@/components/ForecastItem'
import {
	Flex,
	Heading,
	Text,
	Skeleton,
	Image,
	SimpleGrid,
} from '@chakra-ui/react'
import Head from 'next/head'
import React, { useState, useEffect } from 'react'

export default function Weather() {
	const [weather, setWeather] = useState({})
	const [forecastWeather, setForecast] = useState({})
	useEffect(async () => {
		await fetch(
			'https://devapi.qweather.com/v7/weather/now?key=ff1cad5160704890959e50a2ad914051&location=101030100&lang=en',
			{
				method: 'GET',
				mode: 'cors',
			}
		)
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				setWeather(data)
			})
			.catch((error) => {
				alert('Get weather failed.')
			})
	}, [])
	useEffect(async () => {
		await fetch(
			'https://devapi.qweather.com/v7/weather/3d?key=ff1cad5160704890959e50a2ad914051&location=101030100&lang=en',
			{
				method: 'GET',
				mode: 'cors',
			}
		)
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				setForecast(data)
			})
			.catch((error) => {
				console.log(error)
				alert('Get weather failed.')
			})
	}, [])
	return (
		<>
			<Head>
				<title>TH Server | Weather</title>
			</Head>
			<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
				Check out the weather.
			</Heading>
			<Flex flexDir='column'>
				<Heading as='h2' size='lg' letterSpacing='tight'>
					Current weather
				</Heading>
				<Skeleton isLoaded={weather.now != null}>
					<Flex flexDir='row' alignItems='center' mt={4}>
						<Image
							h={12}
							src={
								'/' +
								(weather.now == null
									? '999'
									: weather.now.icon) +
								'.png'
							}
							display='inline'
						/>
						<Text fontSize='2xl' fontWeight='bold'>
							{weather.now == null ? 'N/A' : weather.now.text}
						</Text>
					</Flex>
				</Skeleton>
				<SimpleGrid columns={[2, 3, 3, 3, 3]} spacing={10} mt={4}>
					<Flex flexDir='column'>
						<Text fontSize='sm' color='gray'>
							Feels like
						</Text>
						<Skeleton isLoaded={weather.now != null}>
							<Text fontSize='2xl' fontWeight='bold'>
								{weather.now == null
									? 'N/A'
									: weather.now.feelsLike + '°C'}
							</Text>
						</Skeleton>
					</Flex>
					<Flex flexDir='column'>
						<Text fontSize='sm' color='gray'>
							Cloud
						</Text>
						<Skeleton isLoaded={weather.now != null}>
							<Text fontSize='2xl' fontWeight='bold'>
								{weather.now == null
									? 'N/A'
									: weather.now.cloud}
							</Text>
						</Skeleton>
					</Flex>
					<Flex flexDir='column'>
						<Text fontSize='sm' color='gray'>
							Visibility
						</Text>
						<Skeleton isLoaded={weather.now != null}>
							<Text fontSize='2xl' fontWeight='bold'>
								{weather.now == null ? 'N/A' : weather.now.vis}
							</Text>
						</Skeleton>
					</Flex>
					<Flex flexDir='column'>
						<Text fontSize='sm' color='gray'>
							Wind direction
						</Text>
						<Skeleton isLoaded={weather.now != null}>
							<Text fontSize='2xl' fontWeight='bold'>
								{weather.now == null
									? 'N/A'
									: weather.now.windDir}
							</Text>
						</Skeleton>
					</Flex>
					<Flex flexDir='column'>
						<Text fontSize='sm' color='gray'>
							Wind scale
						</Text>
						<Skeleton isLoaded={weather.now != null}>
							<Text fontSize='2xl' fontWeight='bold'>
								{weather.now == null
									? 'N/A'
									: weather.now.windScale}
							</Text>
						</Skeleton>
					</Flex>
					<Flex flexDir='column'>
						<Text fontSize='sm' color='gray'>
							Wind scale
						</Text>
						<Skeleton isLoaded={weather.now != null}>
							<Text fontSize='2xl' fontWeight='bold'>
								{weather.now == null
									? 'N/A'
									: weather.now.windSpeed}
							</Text>
						</Skeleton>
					</Flex>
				</SimpleGrid>
				<Heading as='h2' size='lg' letterSpacing='tight' mt={8}>
					Forecast
				</Heading>
				<SimpleGrid columns={[1, 1, 3, 3, 3]} mt={4}>
					{forecastWeather.daily == undefined ? (
						<></>
					) : (
						forecastWeather.daily.map((element, index) => {
							return (
								<ForecastItem
									key={'weather-forecast-item-index' + index}
									weather={element}
								/>
							)
						})
					)}
				</SimpleGrid>
			</Flex>
		</>
	)
}
