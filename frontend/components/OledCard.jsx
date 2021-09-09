import { AspectRatio, Flex, Image, Link } from '@chakra-ui/react'
import React from 'react'

export default function OledCard(props) {
	return (
		<Link onClick={props.onClick}>
			<AspectRatio ratio={4 / 3}>
				<Flex overflow='hidden' borderRadius='lg' borderWidth={2}>
					<Image h='inherit' w='inherit'
						src={props.image}
						alt={props.alt}
						fit='contain'
					/>
				</Flex>
			</AspectRatio>
		</Link>
	)
}
