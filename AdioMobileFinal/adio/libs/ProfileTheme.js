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
		bottom: 20,
		left: 10,
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