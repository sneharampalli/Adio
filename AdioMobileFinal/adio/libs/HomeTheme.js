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
		color: '#fff'
	}, 
	button: {
		backgroundColor: 'rgba(255,255,255,0.3)',
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: 20,
		width: 120,
		borderWidth: 1
	},
	buttonText: {
		color: '#000',
		fontSize: 16,
		fontWeight: '600'
    },
    playButton: {
		marginTop: 50,
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
	sliderLabel: {
		alignSelf: 'center',
		fontWeight: '500',
	},
	sliderValue: {
		alignSelf: 'center',
		fontWeight: '600',
	},
	volumeSlider: {
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
		backgroundColor: 'rgba(0,0,0,0.3)',
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