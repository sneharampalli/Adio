import { StyleSheet } from 'react-native';

// Colors
export const deepSquidInk = '#152939';
export const linkUnderlayColor = '#FFF';
export const errorIconColor = '#DD3F5B';

// Theme
export default StyleSheet.create({
	avatar: {
        marginTop: 80,
        alignSelf: "center",
		marginBottom: 10,
        backgroundColor: "#fff",
        color: "#000",
    }, 
    text: {
        alignSelf: "center",
        justifyContent: "center",
        textAlign: "center",
        marginTop: 5,
        marginBottom: 5,
        fontSize: 20,
        borderRadius: 6,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 1.0)'
    },
    chartHeader: {
    	alignSelf: "center",
    	marginLeft: 10,
    	marginRight: 10,
        marginTop: 60,
        marginBottom: 2,
        fontSize: 28,
        borderRadius: 6,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 1)',
    },
    revenueHeader: {
    	alignSelf: "center",
    	justifyContent: "center",
        textAlign: "center",
        fontSize: 16,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 1.0)',
    },
    revenueVal: {
    	alignSelf: "center",
    	justifyContent: "center",
        textAlign: "center",
        marginTop: 10,
        fontSize: 28,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, 1)',
    },
    chart: {
    	alignSelf: "center",
        marginTop: 5,
    },
    selector: {
    	width: 200,
    	alignSelf: "center",
    	color: 'rgba(255,255,255,1)',
		marginTop: 10,
    },
    profileContainer: {
    	marginLeft: 40,
    	marginRight:30,
    	marginTop: 10,
    	marginBottom: 0,
    	borderRadius: 10
    },
    bubble: {
    	backgroundColor: 'rgba(255, 255, 255, 0.40)',
    	alignItems: "center",
    	justifyContent: "center",
    	marginLeft: 40,
    	marginBottom: 0,
    	borderRadius: 120,
    	height: 150,
    	width: 150,
    	shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.00,

		elevation: 24
    },
    revenueRow: {
    	flexDirection: 'row',
    	alignItems: 'center',
    	marginTop: 50
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
		color: '#fff',
		fontSize: 16,
		alignSelf: "center",
		fontWeight: '600'
	}
});