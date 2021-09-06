import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }) {
	return (
		<ChakraProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	)
}

export default MyApp
