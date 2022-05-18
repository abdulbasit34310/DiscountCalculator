import React from "react";
import { TouchableOpacity, StyleSheet, Text, View, } from 'react-native';

const MyButton = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.5}
            onPress={props.onPress}
            style={{...styles.headerButton, backgroundColor: props.backgroundColor}}>
            <Text style={{ color: 'black' }}>{props.text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    headerButton: {
        backgroundColor: 'rgb(36,36,36)',
        padding: 5,
        margin: 10,
        borderRadius: 3,
        height: 40,
        width: 80,
        justifyContent: "center",
        alignItems: 'center',
    },
})

export default MyButton;