import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const CustomToast = ({ title, message, isVisible }) => {
    const toastRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            toastRef.current.fadeIn(500).then(endState => {
                if (endState.finished) {
                    setTimeout(() => {
                        toastRef.current.fadeOut(500);
                    }, 2000);
                }
            });
        }
    }, [isVisible]);

    return (
        <Animatable.View
            ref={toastRef}
            style={[styles.toastContainer, !isVisible && { display: 'none' }]}
            useNativeDriver={true}
        >
            <Text style={styles.toastTitle}>{title}</Text>
            <Text style={styles.toastMessage}>{message}</Text>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        bottom: 10,
        width: "80%",
        height: "8%",
        padding: 10,
        backgroundColor: '#FF9C01',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'center',
    },
    toastTitle: {
        fontSize: 16,
        color: '#161622',
        fontFamily: 'Poppins-Bold',
    },
    toastMessage: {
        fontSize: 16,
        color: '#161622',
        fontFamily: 'Poppins-Medium',
    },
});

export default CustomToast;
