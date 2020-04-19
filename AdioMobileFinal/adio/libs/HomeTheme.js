import { StyleSheet } from 'react-native';

// Colors
export const deepSquidInk = '#152939';
export const linkUnderlayColor = '#FFF';
export const errorIconColor = '#DD3F5B';

// Theme
export default StyleSheet.create({
	button: {
		backgroundColor: '#000',
		alignItems: 'center',
		padding: 16,
        borderRadius: 5,
	},
	buttonDisabled: {
		backgroundColor: '#ff990080',
		alignItems: 'center',
		padding: 16,
		borderRadius: 5
	},
	buttonText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600'
    },
    playButton: {
        marginTop: 10
    },
    logo: {
        position: "absolute",
        bottom: 25,
        right: 25,
        height: 30,
        width: 32
    }
});