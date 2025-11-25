import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, NativeModules, NativeEventEmitter, ScrollView,TouchableOpacity,Modal ,TextInput,Animated} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');
const { UDPModule } = NativeModules;
interface LeftPanelProps {
  data?: {
    data0?: number;
    data1?: number;
    data2?: number;
    data5?: number;
    data6?: number;
    data7?: number;
    data8?: number;
    data9?: number;
    data10?: number;
    data11?: number;
    data13?: number;
  };
  isLive?: boolean; 
  calibrationData?: (data: number[]) => void;
  isStartTimer?: boolean;
}

function LeftPanel({ data,isLive,isStartTimer,calibrationData }: LeftPanelProps) {
    const [isCalibrationVisible, setIsCalibrationVisible] = useState<boolean>(false);
    const [xValue, setXValue] = useState<string>('');
    const [yValue, setYValue] = useState<string>('');
    const [zValue, setZValue] = useState<string>('');
    const [time, setTime] = useState(0);
    const formatTime = (totalSeconds: number) => {
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
    
      return `${hrs.toString().padStart(2, "0")}:` +
             `${mins.toString().padStart(2, "0")}:` +
             `${secs.toString().padStart(2, "0")}`;
    };
    useEffect(() => {
      let interval: any;

      if (isStartTimer) {
        interval = setInterval(() => {
          setTime(prev => prev + 1);   // Increases by 1 every second
        }, 1000);
      } else {
        clearInterval(interval);
        setTime(0); // Reset time when timer stops
      }

      return () => clearInterval(interval);
    }, [isStartTimer]);

    const handleSendCoordinates = () => {
      console.log('Sending coordinates:', {
        x: parseFloat(xValue) || 0,
        y: parseFloat(yValue) || 0,
        z: parseFloat(zValue) || 0
      });
      calibrationData?.([parseFloat(xValue) || 0, parseFloat(yValue) || 0, parseFloat(zValue) || 0]);
    }
    return (
      <View style={styles.leftPanel}>

{/* {isCalibrationVisible && (
            <BlurView
              style={styles.absolute}
              blurType="light" // Or "dark", "xlight", "xxdark", etc.
              blurAmount={100} // Adjust the blur intensity
              reducedTransparencyFallbackColor="white" // Fallback for platforms that don't support blur
            />
          )} */}
      <View>
        <Modal 
          visible={isCalibrationVisible} 
          onRequestClose={() => setIsCalibrationVisible(false)}  
          animationType="fade" 
          // presentationStyle='formSheet'
          transparent={true}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Calibration Settings</Text>
              
              {/* X Coordinate Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>X Coordinate:</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Enter X value"
                  value={xValue}
                  onChangeText={setXValue}
                  placeholderTextColor={"#888"}
                />
              </View>
    
              {/* Y Coordinate Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Y Coordinate:</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Enter Y value"
                  value={yValue}
                  onChangeText={setYValue}
                  placeholderTextColor={"#888"}
                />
              </View>
    
              {/* Z Coordinate Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Z Coordinate:</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Enter Z value"
                  value={zValue}
                  onChangeText={setZValue}
                  placeholderTextColor={"#888"}
                />
              </View>
    
              {/* Buttons Container */}
              {/* Replace the buttons section with this */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.closeButton]} 
                  onPress={() => setIsCalibrationVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.sendButton]} 
                  onPress={()=>{handleSendCoordinates(); setIsCalibrationVisible(false);}}
                >
                  <Text style={styles.sendButtonText}>Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
          </View>
          <TouchableOpacity onPress={()=>{setIsCalibrationVisible(true)}} style={styles.gear} >
          <Icon name="gear" size={28} color="#E7CA55" />
        </TouchableOpacity>
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
               <AnimatedCircularProgress
          style={styles.progressbar}
            size={150}
            width={15}
            fill={data?.data5 || 0}
            tintColor="#00e0ff"
            // onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#3d5875" >
            {
            () => (
              <>
              <Text style={styles.progressValue}>
              {data?.data5 || 0}%
              </Text>
              <Text style={styles.subtext}>
                purity rate
              </Text>
              </> 
              
            )
          }

        </AnimatedCircularProgress>
          <View style={styles.dataContainer}>
            {isLive?(
              <>
            {/* <Text style={styles.dataTitle}>General Data  </Text> */}
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Elapsed Time(min)  :</Text>
              <Text style={styles.dataValue}>{formatTime(time)}</Text>
            </View>
            
            {/* <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Remaining Time(min)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data6}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View> */}
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Distance Covered(m)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data8}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Waste Intake(l)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data10}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Total waste cleared(%)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data11}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
          
            </>
            ):(
               <>
            {/* <Text style={styles.dataTitle}>General Data  </Text> */}
            <View style={styles.dataRow}>
            {/* <Icons name="timelapse" size={18} color="white" style={{ marginRight: 10 }} /> */}
              
              <Text style={styles.dataLabel}>Elapsed Time(min)  :</Text>
              <Text style={styles.dataValue}>{formatTime(time)}</Text>
            </View>
            
            <View style={styles.dataRow}>
            {/* <Icon name="hourglass-end" size={18} color="white" style={{ marginRight: 10 }} /> */}
              <Text style={styles.dataLabel}>Remaining Time(min)  :</Text>
              {data?<Text style={styles.dataValue}>{formatTime(data.data6 || 0)}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
    
            <View style={styles.dataRow}>
            {/* <Icons name="zoominmaptwotone" size={18} color="white" style={{ marginRight: 10 }} /> */}
              <Text style={styles.dataLabel}>Clenaup Count(Nos)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data7}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Distance Covered(m)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data8}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Working Velocity(m/s)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data9}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>World Co-ordinate :</Text>
              {data?<Text style={[styles.dataValue,{fontSize:13}]}>{data.data0}, {data.data1}, {data.data2}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Waste Intake(l)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data10}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Total waste cleared(%)  :</Text>
              {data?<Text style={styles.dataValue}>{data.data11}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Status Code  :</Text>
              {data?<Text style={styles.dataValue}>{data.data13}</Text>:
              <Text style={styles.dataValue}></Text>}
            </View>
            </>
            )}
            
          </View>
         
            </ScrollView>
           
        </View>
    );
}

export default LeftPanel;

const styles = StyleSheet.create({
    leftPanel: {
      // alignContent: 'center',
      width: width * 0.35,
      height: height * 0.84,
      backgroundColor: '#262626',
      borderRadius: 15,
      opacity: 0.9,
      padding: 15,
    },
    title: {
      color: '#E7CA55',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    dataContainer: {
      flex: 1,
      marginLeft: 20,
    },
    dataTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 15,
      textAlign: 'center',
    },
    dataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 25,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
    dataLabel: {
      color: '#CCCCCC',
      fontSize: 15,
      flex: 1.5,
    },
    dataValue: {
      color: '#E7CA55',
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
      textAlign: 'left',
    },
    progressbar:{
      marginTop:10,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    progressValue:{
       fontSize: 20, 
       color: '#E7CA55', 
       fontWeight: 'bold', 
      //  marginBottom: 8,
      },
    subtext:{
      fontSize: 12,
      color: '#CCCCCC',
    },
    gear:{
      position:'absolute',
      top:10,
      right:10,
      zIndex:10
    },
    modalContainer:{
      // height:200,
      width: width * 0.35,
      backgroundColor: 'black',
      color: 'black',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // Optional: for a semi-transparent overlay
    },
   modalView: {
    width: '50%',
    backgroundColor: '#262626',
    borderRadius: 25,
    padding: 20,
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
  modalTitle: {
    color: '#E7CA55',
    fontSize: 20,
    // fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#E7CA55',
  },
  textInput: {
    width: '100%',
    height: 40,
    color: '#fff',
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '60%',
    marginTop: 20,
  },
  // Add this to make buttons side by side with spacing
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: '#999',
  },
  sendButton: {
    backgroundColor: '#E7CA55',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  });