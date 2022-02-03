import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView  } from 'react-native';
import * as Location from 'expo-location';
import { format } from "date-fns";
import { Card } from 'react-native-shadow-cards';

var date = new Date();
var yesterday = format(addDays(date, -2), "yyyy-MM-dd");
var today = format(date, "yyyy-MM-dd");
var inaweek = format(addDays(date, 7), "yyyy-MM-dd");
var inamonth = format(addMonths(date, 1), "yyyy-MM-dd");

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days + 1);
	return result;
}

function addMonths(date, month) {
	var result = new Date(date);
	result.setMonth(result.getMonth() + month);
	return result;
}

function substractTime(date1, date2) {
	var returnme = ""
	if (date1 != null && date2 != null) {
		var d1 = parseInt(date1.substring(0, 2)) * 60 * 60 + parseInt(date1.substring(3, 5)) * 60 + parseInt(date1.substring(6, 9))
		var d2 = parseInt(date2.substring(0, 2)) * 60 * 60 + parseInt(date2.substring(3, 5)) * 60 + parseInt(date2.substring(6, 9))
		var res = d2 - d1
		let hours = Math.floor(res / 3600); // get hours
		let minutes = Math.floor((res - (hours * 3600)) / 60); // get minutes
		let seconds = res - (hours * 3600) - (minutes * 60); //  get seconds
		// add 0 if value < 10; Example: 2 => 02
		if (hours < 10) { hours = "0" + hours; }
		if (minutes < 10) { minutes = "0" + minutes; }
		if (seconds < 10) { seconds = "0" + seconds; }
		returnme = hours + ':' + minutes + ':' + seconds
	}
	return returnme; // Return is HH : MM : SS	}
}

function ProccessDaylimit(start, end) {
	start = start.substring(0,8).trim()

	end = end.substring(0,8).trim()
	end = (parseInt(end.substring(0,end[1] == ':' ? 1:2)) + 12).toString() + end.substring(1,8)

	return start + ' - ' + end
}
export default function App() {
	const [location, setLocation] = useState(null);
	const [timeYesterday, setTimeYesterday] = useState(null);
	const [timeToday, setTime] = useState(null);
	const [timeinaweek, setTimeinaweek] = useState(null);
	const [timeinamonth, setTimeinamonth] = useState(null);
	const [daylimit, setdaylimit] = useState(null);
	const [daylimitinaweek, setdaylimitinaweek] = useState(null);
	const [daylimitinamonth, setdaylimitinamonth] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
			let timeYesterday = await fetch("https://api.sunrise-sunset.org/json?lat=" + location.coords.latitude + "&lng=" + location.coords.longitude + "&date=" + yesterday).then((response) => { return response.json() })
			setTimeYesterday(timeYesterday.results.day_length)
			let timeToday = await fetch("https://api.sunrise-sunset.org/json?lat=" + location.coords.latitude + "&lng=" + location.coords.longitude + "&date=" + today).then((response) => { return response.json() })
			setTime(timeToday.results.day_length)
			setdaylimit(ProccessDaylimit(timeToday.results.civil_twilight_begin,timeToday.results.civil_twilight_end ))
			let timeinaweek = await fetch("https://api.sunrise-sunset.org/json?lat=" + location.coords.latitude + "&lng=" + location.coords.longitude + "&date=" + inaweek).then((response) => { return response.json() })
			setTimeinaweek(timeinaweek.results.day_length)
			setdaylimitinaweek(ProccessDaylimit(timeinaweek.results.civil_twilight_begin,timeinaweek.results.civil_twilight_end ))
			let timeinamonth = await fetch("https://api.sunrise-sunset.org/json?lat=" + location.coords.latitude + "&lng=" + location.coords.longitude + "&date=" + inamonth).then((response) => { return response.json() })
			setTimeinamonth(timeinamonth.results.day_length)
			setdaylimitinamonth(ProccessDaylimit(timeinamonth.results.civil_twilight_begin,timeinamonth.results.civil_twilight_end ))
		})();
	}, []);

	let text = 'Waiting..';
	let textTime = 'Waiting..';
	let textyes = 'Waiting..';
	let textweek = 'Waiting..';
	let textmonth = 'Waiting..';
	let textdaylimit = 'Waiting..';
	let textdaylimitweek = 'Waiting..';
	let textdaylimitmonth = 'Waiting..';

	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = location;
		textyes = timeYesterday;
		textTime = substractTime(textyes, timeToday);
		textweek = substractTime(textyes, timeinaweek);
		textmonth = substractTime(textyes, timeinamonth);
		textdaylimit = daylimit
		textdaylimitweek = daylimitinaweek
		textdaylimitmonth = daylimitinamonth
	}
	return (
		<View style={styles.container}>
			<ScrollView horizontal={true}>
				<Card style={styles.card} backgroundColor={"#fff"}>
					<Text style={styles.title}>Aujourd'hui</Text>
					<Text >{textTime} </Text>
					<Text >{textdaylimit} </Text>
				</Card>
				<Card style={styles.card} >
					<Text style={styles.title}>7 Prochains Jours</Text>
					<Text >{textweek} </Text>
					<Text >{textdaylimitweek} </Text>
				</Card>
				<Card style={styles.card} >
					<Text style={styles.title}>Prochain Mois</Text>
					<Text >{textmonth}</Text>
					<Text >{textdaylimitmonth} </Text>
				</Card>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:"white",
	},
	title: {
		fontSize:17,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	card: {
		backgroundColor:"white",
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
		margin: 10,
		height: 100,
		width: 150
	}
});
