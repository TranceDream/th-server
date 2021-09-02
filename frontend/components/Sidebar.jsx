import React from 'react'
import { useRouter } from 'next/router'
import { Flex, Heading, Text, Icon, Link } from '@chakra-ui/react'
import {
	FiHome,
	FiPieChart,
	FiDollarSign,
	FiBox,
	FiCalendar,
	FiChevronDown,
	FiChevronUp,
	FiPlus,
	FiThermometer,
	FiDropLet,
	FiCreditCard,
	FiSearch,
	FiBell,
	FiDroplet,
	FiActivity,
	FiSettings,
} from 'react-icons/fi'

function getCurrentPage(pathname) {
	switch (pathname) {
		case '/':
			return 0
			break
		case '/temperature':
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
						<Link href='C:/Users/tranced/Resources/selab/th-server/frontend/out/'>
							<Icon
								as={FiHome}
								fontSize='2xl'
								className={page == 0 ? 'active-icon' : ''}
							/>
						</Link>
						<Link href='/' _hover={{ textDecor: 'none' }}>
							<Text className={page == 0 ? 'active' : ''}>
								Home
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link href='/temperature'>
							<Icon
								as={FiThermometer}
								fontSize='2xl'
								className={page == 1 ? 'active-icon' : ''}
							/>
						</Link>
						<Link
							href='/temperature'
							_hover={{ textDecor: 'none' }}>
							<Text className={page == 1 ? 'active' : ''}>
								Temperature
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link href='/humidity'>
							<Icon
								as={FiDroplet}
								fontSize='2xl'
								className={page == 2 ? 'active-icon' : ''}
							/>
						</Link>
						<Link href='/humidity' _hover={{ textDecor: 'none' }}>
							<Text className={page == 2 ? 'active' : ''}>
								Humidity
							</Text>
						</Link>
					</Flex>
					<Flex className='sidebar-items'>
						<Link>
							<Icon
								as={FiActivity}
								fontSize='2xl'
								className={page == 3 ? 'active-icon' : ''}
							/>
						</Link>
						<Link _hover={{ textDecor: 'none' }}>
							{/* TODO */}
							<Text className={page == 3 ? 'active' : ''}>
								TODO
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
