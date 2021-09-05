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
	Switch,
} from '@chakra-ui/react'
import React from 'react'
import { FiCheckCircle, FiSun } from 'react-icons/fi'

export default function ControlPanel() {
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
						<Switch size='md' colorScheme='facebook' />
					</Stat>
					<Stat>
						<StatLabel fontSize='sm' color='gray'>
							Brightness
						</StatLabel>
						<StatNumber fontSize='2xl'>20%</StatNumber>
						<Slider
                            aria-label='slider'
							mt={2}
							isDisabled={false}
							defaultValue={60}
                            onChangeEnd={(value) => {
                                console.log(value)
                            }}
							min={10}
							max={100}
							step={10}>
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
