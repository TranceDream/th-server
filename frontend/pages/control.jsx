import {
	Flex,
	Heading,
	Stat,
	StatLabel,
	StatNumber,
	StatGroup,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	IconButton,
	Icon,
} from '@chakra-ui/react'
import Switch from 'react-switch'
import React, { useState, useEffect } from 'react'
import { FiCheckCircle, FiSun, FiXCircle } from 'react-icons/fi'

let requestLock = true

async function setLedRequest(ledOn, ip, callback) {
	console.log(requestLock)
	if (requestLock) {
		requestLock = false
		await fetch(
			'http://' + ip + '/setLed?status=' + (ledOn ? 'ON' : 'OFF'),
			{
				method: 'GET',
				mode: 'cors',
			}
		)
			.then((res) => {
				requestLock = true
				callback()
			})
			.catch((error) => {
				console.log(error)
				requestLock = true
				alert('Request failed, please check your ESP8266 connection.')
			})
	}
}

async function setBrightnessRequest(value, ip, callback) {
	if (requestLock) {
		requestLock = false
		console.log(requestLock)
		await fetch('http://' + ip + '/adjustLed?brightness=' + value, {
			method: 'GET',
			mode: 'cors',
		})
			.then((res) => {
				requestLock = true
				callback()
			})
			.catch((error) => {
				console.log(error)
				console.log(requestLock)
				requestLock = true
				alert('Request failed, please check your ESP8266 connection.')
			})
	}
}

export default function ControlPanel() {
	const [ledStatus, setLedStatus] = useState({ l: false, s: 'ON' })
	const [brightness, setBrightness] = useState({ l: false, b: 100 })
	const [ip, setIp] = useState('')
	useEffect(async () => {
		const params = new URLSearchParams(window.location.search)
		let ip = params.get('ip')
		if (ip != undefined) {
			setIp(ip)
			requestLock = false
			await fetch('http://' + ip + '/ledStatus', {
				method: 'GET',
				mode: 'cors',
			})
				.then((res) => {
					return res.text()
				})
				.then((txt) => {
					requestLock = true
					setLedStatus({ l: true, s: txt })
				})
				.catch((error) => {
					console.log(error)
					requestLock = true
					alert(
						'Request failed, please check your ESP8266 connection.'
					)
				})
		} else {
			alert('IP is not bound.')
		}
	}, [])
	return (
		<>
			<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
				Configure your ESP8266.
			</Heading>
			<Flex flexDir='column' pr={2} mt={8}>
				<Heading as='h2' size='lg' letterSpacing='tight'>
					LED Configuration
				</Heading>
				<StatGroup mt={4}>
					<Stat>
						<StatLabel fontSize='sm' color='gray'>
							Status
						</StatLabel>
						<Flex alignItems='center'>
							{ledStatus.s == 'ON' ? (
								<Icon
									fontSize='2xl'
									color='green.400'
									as={FiCheckCircle}
								/>
							) : (
								<Icon
									fontSize='2xl'
									color='red.400'
									as={FiXCircle}
								/>
							)}
							<StatNumber ml={4} fontSize='4xl'>
								{ledStatus.s}
							</StatNumber>
						</Flex>
						<Switch
							checkedIcon={false}
							uncheckedIcon={false}
							disabled={ip == ''}
							checked={ledStatus.s == 'ON'}
							onChange={(checked) => {
								setLedRequest(checked, ip, () => {
									setLedStatus({
										l: true,
										s: checked ? 'ON' : 'OFF',
									})
								})
								console.log(checked)
							}}></Switch>
					</Stat>
					<Stat>
						<StatLabel fontSize='sm' color='gray'>
							Brightness
						</StatLabel>
						<StatNumber fontSize='2xl'>
							{ledStatus.s == 'ON' ? brightness.b : 'N/A'}
						</StatNumber>
						<Slider
							aria-label='slider'
							mt={2}
							isDisabled={
								ip == '' ||
								ledStatus.s == 'OFF' ||
								ledStatus.l == false
							}
							defaultValue={100}
							min={0}
							max={255}
							step={1}
							onChange={(value) => {
								setBrightness({ l: true, b: value })
							}}
							onChangeEnd={(value) => {
								setBrightnessRequest(
									value,
									ip,
									setBrightness({ l: true, b: value })
								)
							}}>
							<SliderTrack bg='#f5f5f5'>
								<Flex position='relative' right={10} />
								<SliderFilledTrack bg='#b57295' />
							</SliderTrack>
							<SliderThumb boxSize={6}>
								<Icon as={FiSun} color='#b57295' />
							</SliderThumb>
						</Slider>
					</Stat>
				</StatGroup>
			</Flex>
			<Flex flexDir='column' mt={8}>
				<Heading as='h2' size='lg' letterSpacing='tight'>
					OLED Monitor Configuration
				</Heading>
			</Flex>
		</>
	)
}
