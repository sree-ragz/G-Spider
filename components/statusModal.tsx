import React, {useState,useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

interface StatusModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ visible, message, onClose }) => {
  // const [modalVisible, setModalVisible] = useState(true);
  useEffect(() => {
    if (visible){
    const timer = setTimeout(() => {
      onClose()
    }, 1500); 

    return () => clearTimeout(timer); // Cleanup on unmount
  }
  }, [visible]);
  
  return (
    <SafeAreaProvider >
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          >
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: message==='stopped' ? 'red' : 'green'}]}>
              <Text style={styles.modalText}>{message}</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 6,
    paddingHorizontal:40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    // marginBottom: 15,
    color: 'white',
    textAlign: 'center',
  },
});

export default StatusModal;