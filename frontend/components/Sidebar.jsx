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
		<Flex
			flexDir='column'
			justifyContent='space-between'
			h={[null, null, '100vh']}>
			<Flex flexDir='column' as='nav'>
				<Heading
					mt={50}
					mb={[15, 25, 100]}
					textAlign='center'
					fontSize={['4xl', '4xl', 'lg', '2xl', '2xl']}
					alignSelf='center'
					letterSpacing='tight'>
					TH Server
				</Heading>
				<Flex
					flexDir={['row', 'row', 'column', 'column', 'column']}
					align={[
						'center',
						'center',
						'center',
						'flex-start',
						'flex-start',
					]}
					justifyContent='center'>
					<Flex className='sidebar-items'>
						<Link
							display={[
								'center',
								'center',
								'center',
								'flex-start',
								'flex-start',
							]}
							href={
								'/' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}>
							<Icon
								display={[
									'none',
									'none',
									'flex',
									'flex',
									'flex',
								]}
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
							<Text
								display={[
									'flex',
									'flex',
									'none',
									'flex',
									'flex',
								]}
								className={page == 0 ? 'active' : ''}>
								Home
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link
							display={[
								'center',
								'center',
								'center',
								'flex-start',
								'flex-start',
							]}
							href={
								'/control' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}>
							<Icon
								display={[
									'none',
									'none',
									'flex',
									'flex',
									'flex',
								]}
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
							<Text
								display={[
									'flex',
									'flex',
									'none',
									'flex',
									'flex',
								]}
								className={page == 1 ? 'active' : ''}>
								Control
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link
							display={[
								'center',
								'center',
								'center',
								'flex-start',
								'flex-start',
							]}
							href={
								'/weather' +
								(router.query.ip == undefined
									? ''
									: '?ip=' + router.query.ip)
							}>
							<Icon
								display={[
									'none',
									'none',
									'flex',
									'flex',
									'flex',
								]}
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
							<Text
								display={[
									'flex',
									'flex',
									'none',
									'flex',
									'flex',
								]}
								className={page == 2 ? 'active' : ''}>
								Weather
							</Text>
						</Link>
					</Flex>
				</Flex>
			</Flex>

			<Flex
				flexDir={['row', 'row', 'column', 'column', 'column']}
				justifyContent='center'
				alignItems='center'
				mb={[5, 5, 10, 10, 10]}
				mt={[2, 5, 5, 5, 5]}>
				<Link>
					<Icon
						mr={[1, 1, 0, 0, 0]}
						as={FiSettings}
						onClick={onOpen}
						my={2}
						fontSize={['xl', 'xl', '2xl', '3xl', '3xl']}
					/>
				</Link>
				<Link>
					<Text
						onClick={onOpen}
						ml={[1, 1, 0, 0, 0]}
						textAlign='center'>
						Bind IP
					</Text>
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
