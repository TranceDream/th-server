import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
	Flex,
	Button,
	Heading,
	Text,
	Icon,
	Link,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Input,
} from '@chakra-ui/react'
import { FiHome, FiSettings, FiSliders, FiCloud } from 'react-icons/fi'

function getCurrentPage(pathname) {
	switch (pathname) {
		case '/':
			return 0
		case '/control':
			return 1
		case '/weather':
			return 2
		default:
			return 0
	}
}

function Sidebar() {
	const [ipValue, setIpValue] = useState('')
	const handleChange = (event) => setIpValue(event.target.value)
	const { isOpen, onOpen, onClose } = useDisclosure()
	let router = useRouter()
	let page = getCurrentPage(router.pathname)
	return (
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
						<Link
							href={
								'/' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}>
							<Icon
								as={FiHome}
								fontSize='2xl'
								className={page == 0 ? 'active-icon' : ''}
							/>
						</Link>
						<Link
							href={
								'/' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}
							_hover={{ textDecor: 'none' }}>
							<Text className={page == 0 ? 'active' : ''}>
								Home
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link
							href={
								'/control' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}>
							<Icon
								as={FiSliders}
								fontSize='2xl'
								className={page == 1 ? 'active-icon' : ''}
							/>
						</Link>
						<Link
							href={
								'/control' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}
							_hover={{ textDecor: 'none' }}>
							<Text className={page == 1 ? 'active' : ''}>
								Control
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link
							href={
								'/weather' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}>
							<Icon
								as={FiCloud}
								fontSize='2xl'
								className={page == 2 ? 'active-icon' : ''}
							/>
						</Link>
						<Link
							href={
								'/weather' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}
							_hover={{ textDecor: 'none' }}>
							<Text className={page == 2 ? 'active' : ''}>
								Weather
							</Text>
						</Link>
					</Flex>
				</Flex>
			</Flex>

			<Flex flexDir='column' alignItems='center' mb={10} mt={5}>
				<Link>
					<Icon
						as={FiSettings}
						onClick={onOpen}
						my={2}
						fontSize='3xl'
					/>
				</Link>
				<Link>
					<Text textAlign='center'>Bind IP</Text>
				</Link>
			</Flex>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						Type the IP address of your ESP8266
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							placeholder='Enter IP here.'
							value={ipValue}
							onChange={handleChange}></Input>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
								onClose()
								window.location.href =
									window.location.origin +
									window.location.pathname +
									'?ip=' +
									ipValue
							}}>
							Bind
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}

export default Sidebar
