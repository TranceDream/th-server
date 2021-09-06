import {
	Flex,
	Text,
	Heading,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
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
import { FiCheckCircle, FiSun } from 'react-icons/fi'

async function setLedRequest(ledOn, ip, callback) {
	const res = await fetch(
		'http://' + ip + '/setLed?status=' + (ledOn ? 'ON' : 'OFF'),
		{
			method: 'GET',
			mode: 'cors',
		}
	)
	console.log(res)
	callback()
}

async function setBrightnessRequest(value, ip, callback) {
	await fetch('http://' + ip + '/adjustLed?brightness=' + value, {
		method: 'GET',
		mode: 'cors',
	})
	callback()
}

export default function ControlPanel() {
	const [ledStatus, setLedStatus] = useState({ l: false, s: 'ON' })
	const [brightness, setBrightness] = useState({ l: false, b: 100 })
	const [ip, setIp] = useState('')
	useEffect(async () => {
		const params = new URLSearchParams(window.location.search)
		let ip = params.get('ip')
		setIp(ip)
		const res = await fetch('http://' + ip + '/ledStatus', {
			method: 'GET',
			mode: 'cors',
		})
		const txt = await res.text()
		setLedStatus({ l: true, s: txt })
		console.log(txt)
	}, [])
	return (
		<>
			<Heading fontWeight='bold' mb={4} letterSpacing='tight'>
				Set up your ESP8266.
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
							<Icon
								fontSize='2xl'
								color='green.400'
								as={FiCheckCircle}
							/>
							<StatNumber ml={4} fontSize='4xl'>
								ON
							</StatNumber>
						</Flex>
						<Switch
							checkedIcon={false}
							uncheckedIcon={false}
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
						<StatNumber fontSize='2xl'>{brightness.b}</StatNumber>
						<Slider
							aria-label='slider'
							mt={2}
							isDisabled={false}
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
