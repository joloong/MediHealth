import React, { Component } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	TouchableHighlight,
	ListView,
	Image
} from "react-native";
import { Container, Content, Button } from "native-base";
import { NavigationEvents } from "react-navigation";
import styles from "./appStyle";
import * as firebase from "firebase";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";

var data = [];

class AppointmentScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			<View style={{ alignSelf: "center", flex: 1 }}>
				<Text style={{ textAlign: "center" }}>Appointment</Text>
			</View>
		),
		headerRight: <View />
	});

	constructor(props) {
		super(props);

		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		this.state = {
			listViewData: data,
			appointment: "",
			location: "",
			date: "",
			time: ""
		};

		this.readUserData = this.readUserData.bind(this);
	}

	componentDidMount() {
		this.readUserData();
	}

	readUserData = () => {
		var user = firebase.auth().currentUser;
		if (user != null) {
			const uid = user.uid;

			firebase
				.database()
				.ref("/users_URW/" + uid + "/appointments/list")
				.once("value", snapshot => {
					const fbObject = snapshot.val();
					console.log("Here: ", fbObject);
					const newArr = Object.keys(fbObject).map(key => {
						fbObject[key].id = key;
						return fbObject[key];
					});
					this.setState({ listViewData: newArr });
				});
		} else {
			console.log(user);
		}
	};

	deleteAppointment(key) {
		var user = firebase.auth().currentUser;
		if (user != null) {
			const uid = user.uid;
			firebase
				.database()
				.ref("/users_URW/" + uid + "/appointments/list")
				.child(key)
				.remove();

			this.readUserData();
		} else {
			console.log(user);
		}
	}

	render() {
		return (
			<Container>
				<NavigationEvents onDidFocus={this.readUserData} />
				<Content contentContainerStyle={{ flex: 1 }}>
					<SwipeListView
						useFlatList
						data={this.state.listViewData}
						renderItem={({ item }) => (
							<SwipeRow
								rightOpenValue={-190}
								leftOpenValue={75}
								disableRightSwipe={true}
							>
								{/* Underlay */}
								<View
									style={{
										backgroundColor: "transparent",
										height: 60,
										width: 225,
										alignSelf: "center",
										borderRadius: 5,
										padding: 0,
										marginTop: 10,
										borderColor: "white",
										borderWidth: 2,
										flex: 1,
										flexDirection: "row",
										justifyContent: "flex-end"
									}}
								>
									<TouchableOpacity
										style={{ alignSelf: "center" }}
										onPress={() => {
											console.log(item);
											// this.deleteAppointment(item.id);
										}}
									>
										<View
											style={{
												backgroundColor: "#b0413e",
												height: 60,
												width: 60,
												flexDirection: "column",
												justifyContent: "center",
												borderTopWidth: 2,
												borderBottomWidth: 2,
												borderColor: "white"
											}}
										>
											<Image
												source={require("../../assets/images/delete-icon.png")}
												style={{
													tintColor: "white",
													alignSelf: "center",
													height: 24,
													width: 24
												}}
											/>
											<Text style={{ color: "white", alignSelf: "center" }}>
												Delete
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={{ alignSelf: "center" }}
										onPress={() => {
											console.log(item);
										}}
									>
										<View
											style={{
												backgroundColor: "#fcaa67",
												height: 60,
												width: 60,
												flexDirection: "column",
												justifyContent: "center",
												borderTopWidth: 2,
												borderBottomWidth: 2,
												borderRightWidth: 2,
												borderColor: "white"
											}}
										>
											<Image
												source={require("../../assets/images/update-icon.png")}
												style={{
													tintColor: "white",
													alignSelf: "center",
													height: 24,
													width: 24
												}}
											/>
											<Text style={{ color: "white", alignSelf: "center" }}>
												Edit
											</Text>
										</View>
									</TouchableOpacity>
								</View>

								{/* Overlay */}
								<TouchableHighlight
									style={{
										backgroundColor: "white",
										flexDirection: "column",
										flex: 1,
										height: 60,
										width: 225,
										borderRadius: 5,
										padding: 15,
										marginTop: 10,
										borderColor: "#28DA9A",
										borderWidth: 2,
										alignSelf: "center"
									}}
									onPress={() => this.props.navigation.navigate("Biomarker")}
									underlayColor="#aaf0d7"
									activeOpacity={0.2}
								>
									<View style={{ flex: 1 }}>
										<View style={styles.AppointmentButtonRow}>
											{/*Row 1*/}
											<View style={styles.AppointmentButtonRowLeftColumn}>
												<Text style={styles.AppointmentButtonApptText}>
													{item.appointmentName}
												</Text>
											</View>
											<View style={styles.AppointmentButtonRowRightColumn}>
												<Text style={styles.AppointmentButtonDateText}>
													{item.appointmentDate}
												</Text>
											</View>
										</View>
										<View style={styles.AppointmentButtonRow}>
											{/*Row 2*/}
											<View style={styles.AppointmentButtonRowLeftColumn}>
												<Text style={styles.AppointmentButtonLocationText}>
													{item.appointmentLocation}
												</Text>
											</View>
											<View style={styles.AppointmentButtonRowRightColumn}>
												<Text style={styles.AppointmentButtonTimeText}>
													{item.appointmentTime}
												</Text>
											</View>
										</View>
									</View>
								</TouchableHighlight>
							</SwipeRow>
						)}
						keyExtractor={item => item.appointmentDate}
						disableRightSwipe={true}
					/>
					<Button
						transparent
						title="AppointmentInput"
						accessibilityLabel="Appointment Input Button"
						onPress={() => this.props.navigation.navigate("AppointmentInput")}
						style={{ alignSelf: "flex-end", bottom: 15, right: 15 }}
					>
						<Image
							source={require("../../assets/images/plus-icon.png")}
							style={styles.appointmentInputButton}
						/>
					</Button>
				</Content>
			</Container>
		);
	}
}

export default AppointmentScreen;
