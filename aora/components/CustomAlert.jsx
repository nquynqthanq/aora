import React from 'react';
import { Modal, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { images } from '../constants';

const CustomAlert = ({ visible, title, message, onClose, onConfirm }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Image source={images.cancel} resizeMode="contain" style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText} numberOfLines={2}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
                            <Text style={styles.textStyle}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.noButton} onPress={onClose}>
                            <Text style={styles.textStyle}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: '75%',
        position: 'relative',
        backgroundColor: '#FF9C01',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontFamily: 'Poppins-Bold',
    },
    modalText: {
        marginBottom: 10,
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 50,
    },
    yesButton: {
        marginTop: 10,
        backgroundColor: '#4793AF',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
    },
    noButton: {
        marginTop: 10,
        backgroundColor: '#C40C0C',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
    },
    textStyle: {
        color: '#FFFBDA',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    icon: {
        width: 30,
        height: 30,
    }
});

export default CustomAlert;
