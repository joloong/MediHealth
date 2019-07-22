import React, { Component } from "react";
import {
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight,
	Image,
	ListView
} from "react-native";
import { Container, Content } from "native-base";
import { NavigationEvents } from "react-navigation";
import styles from "./appStyle";
import * as firebase from "firebase";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";

const { width, height } = Dimensions.get("screen");

class MedicineScreen extends Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			<View style={{ alignSelf: "center", flex: 1 }}>
				<Text
					style={{
						textAlign: "center",
						fontWeight: "bold",
						fontSize: 18,
						color: "black"
					}}
				>
					Medicine
				</Text>
			</View>
		),
		headerRight: (
			<TouchableOpacity
				accessibilityLabel="Medicine Input Button"
				onPress={() => navigation.navigate("MedicineInput")}
				style={{ alignSelf: "center" }}
			>
				<Image
					source={require("../../assets/images/plus-icon.png")}
					style={styles.medicineInputButton}
				/>
			</TouchableOpacity>
		),
		headerRightContainerStyle: { right: 20 }
	});

	constructor(props) {
		super(props);

		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

		this.state = {
			listViewData: [],
			medDate: "",
			medFreq: "",
			medName: "",
			medTime: ""
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
				.ref("/users_URW/" + uid + "/medications/list")
				.once("value", snapshot => {
					const fbObject = snapshot.val();
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

	deleteMedication(key) {
		var user = firebase.auth().currentUser;
		if (user != null) {
			const uid = user.uid;
			firebase
				.database()
				.ref("/users_URW/" + uid + "/medications/list")
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
						swipeRowStyle={{ width: Math.min(height, width) * 0.68 }}
						data={this.state.listViewData}
						renderItem={({ item }) => (
							<SwipeRow
								rightOpenValue={-122}
								leftOpenValue={75}
								disableRightSwipe={true}
								style={{
									width: Math.min(height, width) * 0.68,
									alignSelf: "center"
								}}
							>
								{/* Underlay */}
								<View
									style={{
										backgroundColor: "transparent",
										height: 60,
										width: Math.min(height, width) * 0.68,
										alignSelf: "center",
										borderRadius: 5,
										padding: 0,
										marginTop: 5,
										marginBottom: 5,
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
											// this.deleteMedication(item.id);
										}}
									>
										<View
											style={{
												backgroundColor: "#FE2F34",
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
											this.props.navigation.navigate("MedicineInput", {
												key: item.id
											});
										}}
									>
										<View
											style={{
												backgroundColor: "#FF9A2F",
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
										flex: 1,
										height: 60,
										width: Math.min(height, width) * 0.68,
										borderRadius: 5,
										padding: 15,
										marginTop: 5,
										marginBottom: 5,
										borderColor: "#28DA9A",
										borderWidth: 2,
										alignSelf: "center"
									}}
									onPress={() => this.props.navigation.navigate("Biomarker")}
									underlayColor="#aaf0d7"
									activeOpacity={0.2}
								>
									<Text style={styles.MedicineButtonText}>{item.medName}</Text>
								</TouchableHighlight>
							</SwipeRow>
						)}
						keyExtractor={item => item.id}
						disableRightSwipe={true}
					/>
				</Content>
			</Container>
		);
	}
}

export default MedicineScreen;
