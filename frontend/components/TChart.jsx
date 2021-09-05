import React from 'react'
import { Line } from 'react-chartjs-2'

const getData = (data) => {
	console.log(data)
	return {
		datasets: [
			{
				label: 'Temperature',
				fill: false,
				lineTension: 0.5,
				backgroundColor: '#db86b2',
				borderColor: '#B57295',
				borderCapStyle: 'butt',
				borderDashOffset: 0.0,
				borderJoinStyle: '#B57295',
				pointBorderColor: '#B57295',
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: '#B57295',
				pointHoverBorderColor: '#B57295',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: data,
			},
		],
	}
}

const options = {
	maintainAspectRatio: true,
	scales: {
		xAxes: [
			{
				type: 'time',
				time: {
					parser: 'HH:mm:ss',
					unit: 'hour',
					unitStepSize: 1
				},
				distribution: 'linear',
				ticks: {
					min: '00:00:00',
					max: '23:59:59',
				}
			},
		],
		yAxes: {
			grid: {
				borderDash: [3, 3],
			},
			beginAtZero: true, // this works
		},
	},
}

const TChart = (props) => <Line data={getData(props.tdata)} options={options} />

export default TChart
