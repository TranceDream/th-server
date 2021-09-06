import React from 'react'
import { useRouter } from 'next/router'
import { Flex, Heading, Text, Icon, Link } from '@chakra-ui/react'
import { FiHome, FiSettings, FiSliders, FiCloud } from 'react-icons/fi'

function getCurrentPage(pathname) {
	switch (pathname) {
		case '/':
			return 0
			break
		case '/control':
			return 1
			break
		case '/humidity':
			return 2
			break
		case '/settings':
			return 3
			break
		default:
			return 4
			break
	}
}

function Sidebar() {
	// const [Page, setPage] = useState('0')
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
						<Link href={'/' + '?ip=' + router.query.ip}>
							<Icon
								as={FiHome}
								fontSize='2xl'
								className={page == 0 ? 'active-icon' : ''}
							/>
						</Link>
						<Link
							href={'/' + '?ip=' + router.query.ip}
							_hover={{ textDecor: 'none' }}>
							<Text className={page == 0 ? 'active' : ''}>
								Home
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link href={'/control' + '?ip=' + router.query.ip}>
							<Icon
								as={FiSliders}
								fontSize='2xl'
								className={page == 1 ? 'active-icon' : ''}
							/>
						</Link>
						<Link href={'/control' + '?ip=' + router.query.ip} _hover={{ textDecor: 'none' }}>
							<Text className={page == 1 ? 'active' : ''}>
								Control
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link href={'/weather' + '?ip=' + router.query.ip}>
							<Icon
								as={FiCloud}
								fontSize='2xl'
								className={page == 2 ? 'active-icon' : ''}
							/>
						</Link>
						<Link href={'/weather' + '?ip=' + router.query.ip} _hover={{ textDecor: 'none' }}>
							<Text className={page == 2 ? 'active' : ''}>
								Weather
							</Text>
						</Link>
					</Flex>
				</Flex>
			</Flex>

			<Flex flexDir='column' alignItems='center' mb={10} mt={5}>
				<Icon as={FiSettings} my={2} fontSize='3xl' />
				<Text textAlign='center'>Settings</Text>
			</Flex>
		</Flex>
	)
}

export default Sidebar
