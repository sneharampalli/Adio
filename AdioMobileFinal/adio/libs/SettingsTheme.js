import { StyleSheet } from 'react-native';

// Colors
export const deepSquidInk = '#152939';
export const linkUnderlayColor = '#FFF';
export const errorIconColor = '#DD3F5B';

// Theme
export default StyleSheet.create({
	avatar: {
        marginTop: 150,
        alignSelf: "center"
    }, 
    text: {
        alignSelf: "center",
        marginTop: 50,
        fontSize: 24,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 6,
        fontWeight: '600',

    },
    logo: {
        position: "absolute",
        bottom: 25,
        right: 25,
        height: 30,
        width: 32,
	},
	logoutButton: {
		position: "absolute",
		top: 45,
		left: 5,
		height: 30,
		width: 70,
		alignContent: "center",
		justifyContent: "center",
		borderRadius: 4,
	},
	logoutButtonText: {
		color: '#000',
		fontSize: 16,
		alignSelf: "center",
		fontWeight: '600'
	},
	sliderContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: 40,
        marginTop: 40,
	},
	sliderContainer1: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: 40,
		marginTop: 90,
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
    darkModeContainer: {
        flexDirection: 'row',
		justifyContent: 'center',
		height: 40,
		marginTop: 95,
    },
    darkModeSwitch: {
        alignSelf: "center",
		marginHorizontal: 10,
    },
    darkModeLabel: {
        alignSelf: 'center',
        fontWeight: '500',
        color: "#000"
    }
});