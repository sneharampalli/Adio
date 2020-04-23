import { StyleSheet } from 'react-native';

// Colors
export const deepSquidInk = '#152939';
export const linkUnderlayColor = '#FFF';
export const errorIconColor = '#DD3F5B';

// Theme
export default StyleSheet.create({
	avatar: {
		position: "absolute",
		right: 20,
		top: 30,
	}, 
	settings: {
		position: "absolute",
		left: 5,
		top: 30
	},
	button: {
		position: "absolute",
		bottom:15,
		alignItems: 'center',
		alignSelf: 'center',
		width: 120,
		height: 40,
		justifyContent: "center",
		borderRadius: 6
	},
	buttonText: {
		color: '#fff',
		fontSize: 17,
		fontWeight: '600'
    },
    playButton: {
		marginTop: 70,
    },
	playButtonLabel: {
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'center',
		width: 120,
		height: 30,
		marginTop: -10,
	},
	playButtonLabelText: {
		fontSize: 24
	},
    logo: {
        position: "absolute",
        bottom: 25,
        right: 25,
        height: 30,
        width: 32,
	},
	sliderContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: 40,
	},
	sliderContainer1: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: 40,
		marginTop: 50,
		// backgroundColor: 'rgba(255,255,255,0.4)',
	},
	sliderLabel: {
		alignSelf: 'center',
		fontWeight: '500',
	},
	sliderValue: {
		alignSelf: 'center',
		fontWeight: '600',
	},
	slider: {
		width: '40%',
		marginHorizontal: 10,
	}, 
	sliderDescription: {
		alignSelf: 'center',
		marginBottom: 5,
		marginTop: -5,
		marginLeft: 15,
		color: 'rgba(0,0,0,0.6)'
	},
	logoutButton: {
		position: "absolute",
		bottom: 20,
		left: 10,
		// backgroundColor: 'rgba(0,0,0,0.3)',
		height: 30,
		width: 70,
		alignContent: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	logoutButtonText: {
		color: '#fff',
		fontSize: 16,
		alignSelf: "center",
		fontWeight: '600'
	}
});