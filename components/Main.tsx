
import { StyleSheet,View ,ImageBackground,Text,Image,Dimensions,
        TouchableOpacity,ActivityIndicator,NativeModules, NativeEventEmitter,LayoutAnimation,
        Animated} from 'react-native';
import React, { useEffect, useState ,useRef} from 'react';
import { VLCPlayer } from 'react-native-vlc-media-player';
import CameraLabels from './cameraLabels';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialIcons';
import LeftPanel from './LeftPanel';
import { createPDF } from './saveData';
import StatusModal from './statusModal';
import ObjectMarker from './objectMarker';
const {width,height}=Dimensions.get('window')
const ORIGINAL_WIDTH = 1920;
const ORIGINAL_HEIGHT = 1080;
const { UDPModule } = NativeModules;
const today = new Date().toLocaleDateString('en-us',{
  month: 'short',
  day: 'numeric', 
  year: 'numeric'
});

function Main() {
    const [latestImage, setLatestImage] = useState<string | null>(null);
    const [isFullScreen,setIsFullScreen]=useState<boolean>(false);
    const [isLive,setIsLive]=useState<boolean>(false);
    const [isStartTimer,setIsStartTimer]=useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [layout, setLayout] = useState({ width: 0, height: 0 });
    const [coordinates, setCoordinates] = useState<[number,number]>([0,0]);
    const [joyStickmode,setjoyStickMode]=useState<number>(1);
    const [start,setStart]=useState<number>(0);
    const [homePosition,setHomePosition]=useState<number>(0);
    const [data, setData] = useState<any>(null);
    const [dataPacket,setDataPacket]=useState<number[]>([1,0,0,0]);
    const [calibrationData,setCalibrationData]=useState<number[]>([0,0,0]);
    const [record,setRecord]=useState<boolean>(false);
    const [reset,setReset]=useState<boolean>(false);
    const objectPoint = { x: 0, y:0  }; // Center of 1920x1080 image
    const LatestUpdateRef=useRef(0)
    const [xValue, setXValue] = useState<string>('');
    const [yValue, setYValue] = useState<string>('');
    const [zValue, setZValue] = useState<string>('');
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const rtspUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    const [afterData, setAfterData] = useState<number[]>([0,0,0,0]);
    // const rtspUrl="rtsp://admin:admin123@192.168.0.105"
    const webSocketUrl="ws://192.168.36.9:8080"
    // const recieverIP="192.168.36.11"
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const showStatus = (msg: string,visible:boolean) => {
    setModalMessage(msg);
    setModalVisible(visible);
    };

    const handlePlaying = (e: any) => {
      // console.log('isplaying:', e);
      setIsLoading(false);
    };
    
    const setFullScreen=()=>{
      // console.log(isFullScreen);
      setIsFullScreen(prev => !prev);
    }
    
    const setLive=()=>{
      setIsLive(prevLive => !prevLive);
      // console.log("isLive",isLive);
      if (!isLive){
        setIsLoading(true);
      }
    }
  
    const handleCalibrationData = (data: number[]) => {
      setCalibrationData(data);
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || data.length!==3) {
        console.log("WebSocket is not open. Cannot send data.");
        return;
      }
      wsRef.current.send(JSON.stringify({"calibration_data":data}));
      console.log("Sent data to sender:", data);
    }
    const onModeSetting = (index: number,value:number,send=true) => {
      setDataPacket((prev: number[]) => {
        const newArr = [...prev];
        // if (index==1){
        //   newArr[index]=newArr[index]===1?0:1;
        // }
        // else{
          
          newArr[index] = value;
        // }
  
        if (send){
          const dataToSend=calibrationData.concat(newArr);
          console.log("Data to send:",dataToSend);
          sendDatatoCS(dataToSend);
        }
        
        return newArr;
      });
    };
    
    const wsRef = useRef<WebSocket | null>(null);
    useEffect(() => {
      let reconnectTimer: NodeJS.Timeout;
    
      const connect = () => {
        console.log("Connecting WebSocket...");
        wsRef.current = new WebSocket(webSocketUrl);
    
        wsRef.current.onopen = () => {
          console.log("Connected to sender");
        };
    
        wsRef.current.onmessage = (msg) => {
          let ack=JSON.parse(msg.data);
          console.log("ack from sender ",ack);
          if ("image" in ack){
            setLatestImage(`data:image/jpeg;base64,${ack.image}`);
          }
          if ("mode_ack" in ack && ack.mode_ack===1){
            onModeSetting(1,0,false);
            setHomePosition(0)
          }
          wsRef.current?.send(JSON.stringify({"image_ack":"1"})); // Acknowledge / request next frame
          // console.log( "Sent image acknowledgment to sender" );
        };
    
        wsRef.current.onerror = (err) => {
          console.log("WebSocket error:", err.message);
        };
    
        wsRef.current.onclose = () => {
          console.log("WebSocket closed, retrying in 3s...");
          reconnectTimer = setTimeout(connect, 3000);
        };
      };
  
      connect();
    
      return () => {
        console.log("Cleaning WebSocket...");
        wsRef.current?.close();
        clearTimeout(reconnectTimer);
      };
    }, []);
  
    useEffect(() => {
      fadeAnim.setValue(1);
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,   // Fade out
            duration: 800,
            useNativeDriver: true
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,   // Fade in
            duration: 800,
            useNativeDriver: true
          })
        ])
      ).start();
    }, [record]);
  
    const sendDatatoCS=(dataToSend:number[])=>{
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.log("WebSocket is not open. Cannot send data.");
        return;
      }
      wsRef.current.send(JSON.stringify({"mode":dataToSend}));
      console.log("Sent data to sender:", dataToSend);
    }
  
     useEffect(() => {
        // Start UDP server on port 5000
        UDPModule.startUDP(5000);
        // UDPModule.udpModeSender(recieverIP,5001);
        // UDPModule.udpCalibrationSender(recieverIP,5002);
        console.log("Starting UDP listener on port 5000...");
        const eventEmitter = new NativeEventEmitter(UDPModule);        
        const subscription = eventEmitter.addListener("onUDPData", (event) => {
        const now=Date.now();
        // console.log("UDP data received:", event);
        const truncatedData = Object.fromEntries(
          Object.entries(event).map(([key, value]) => {
            if (typeof value === "number") {
              // truncate (not round) to 2 digits
              const truncated = Math.trunc(value * 100) / 100;
              return [key, truncated];
            }
            return [key, value];
          })
        )as Record<string, number>;
  
        const fastData = {
          data0: truncatedData.data0,
          data1: truncatedData.data1,
          data2: truncatedData.data2,
          data3: truncatedData.data3,
          data4: truncatedData.data4,
        };
        setCoordinates([truncatedData.data3, truncatedData.data4]); // still fast
       if (now - LatestUpdateRef.current >= 1000) {
        LatestUpdateRef.current = now;
        setData({
          ...truncatedData,
          ...fastData, // keep the latest fast values too
        });
      }
  
        
        });
  
        return () => {
            UDPModule.stopUDP();
            subscription.remove();
        };
    }, []);
  
    const handleImageLayout = (e: any) => {
      const { width, height } = e.nativeEvent.layout;
      setLayout({ width, height });
    };
    // console.log("camera labels ",data?.data13);
    return (
  
      <View style={styles.container}>
  
        <ImageBackground
          source={require('../assets/images/SPIDER_BACKGROUND.png')}
          resizeMode="cover" 
          style={styles.backgroundImage}
        >
          <View>
          <StatusModal visible={modalVisible} message={modalMessage} onClose={()=>setModalVisible(false)}/>
          </View>
          <View style={styles.header}>
          <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
            <Text style={styles.logo}>G Spider</Text>
            <View style={{width:1.3,height:35,backgroundColor:"#E7CA55"}}></View>
            <Text style={styles.date}>{today}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',gap:20,paddingBottom:20}}>
              {isLive ? (
                <TouchableOpacity style={[styles.liveButton,{borderWidth:2,borderColor:"#FF0000",backgroundColor:"#FF0000"}]} onPress={setLive}>
                  <Text style={[styles.buttonText,{color:"white"}]}>Live</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.liveButton,{ borderWidth:2, borderColor:'#E7CA55'}]} onPress={setLive}>
                  <Text style={styles.buttonText}>Live</Text>
                </TouchableOpacity>
              )}
  
            {isFullScreen ? (
              <TouchableOpacity style={styles.servicebutton} onPress={setFullScreen}>
                <Text style={[styles.servicebuttontext,{color:"white"}]}>Service</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.servicebuttonFullscreen} onPress={setFullScreen}>
                 {/* <Icon name="arrow-left" size={24} color={"%000"} /> */}
                <Text style={[styles.servicebuttontext,{color:"black"}]}>Home</Text>
              </TouchableOpacity>
            )}
            </View>
          </View>
          
          {isFullScreen ? (
            <View style={styles.fullScreenMainContent}>
              <View 
                style={styles.fullSCreenRightPanel}
                // onLayout={handleImageLayout}
              >
                {isLive ? (
                  <>
                    <VLCPlayer
                      style={styles.fullScreenLiveVideo}
                      videoAspectRatio="16:9"
                      source={{ 
                        uri: rtspUrl,
                        initType: 2,
                        initOptions: [
                          "--network-caching=50",
                          "--rtsp-tcp",
                          "--live-caching=50",
                          "--file-caching=50",
                          "--clock-jitter=0",
                          "--clock-synchro=0",
                          "--avcodec-hw=any",
                          "--skip-frames",
                          "--fast-seek"
                        ]
                      }}
                      onError={(e) => {
                        console.log("VLC Error:", e);
                        setIsLoading(false);
                      }}
                      onPlaying={handlePlaying}
                      onLoad={() => setIsLoading(false)}
                      autoplay={true}
                    />
                    {isLoading && (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#E7CA55" />
                        <Text style={styles.loadingText}>Loading stream...</Text>
                      </View>
                    )}
                  </>
                ) : latestImage ? (
                  <>
                    <Image
                      source={{ uri: latestImage }}
                      style={styles.fullScreenliveImage}
                      resizeMode="contain"
                      onLayout={handleImageLayout}
                    />
                    <CameraLabels cameraIndex={data?.data12}/>
                    {layout.width > 0 && layout.height > 0 && (
                      <ObjectMarker
                        x={coordinates[0]}
                        y={coordinates[1]}
                        imageWidth={ORIGINAL_WIDTH}
                        imageHeight={ORIGINAL_HEIGHT}
                        containerWidth={layout.width}
                        containerHeight={layout.height}
                      />
                    )}
                  </>
                ) : (
                  <Text style={styles.panelText}>Waiting for Topview...</Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.mainContent}>
              
              <LeftPanel data={data} isLive={isLive} isStartTimer={isStartTimer}calibrationData={handleCalibrationData}/>
              <View style={styles.rightPanelContainer}>
                <View 
                  style={styles.rightPanel}
                  // onLayout={handleImageLayout}
                >
                  {isLive ? (
                    <>
                      <VLCPlayer
                        style={styles.LiveVideo}
                        videoAspectRatio="16:9"
                        source={{ 
                          uri: rtspUrl,
                          initType: 2,
                          initOptions: [
                            "--network-caching=50",
                            "--rtsp-tcp",
                            "--live-caching=50",
                            "--file-caching=50",
                            "--clock-jitter=0",
                            "--clock-synchro=0",
                            "--avcodec-hw=any",
                            "--skip-frames",
                            "--fast-seek"
                          ]
                        }}
                        onError={(e) => {
                          console.log("VLC Error:", e);
                          setIsLoading(false);
                        }}
                        onPlaying={handlePlaying}
                        onLoad={() => setIsLoading(false)}
                        autoplay={true}
                      />
                      {isLoading && (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="large" color="#E7CA55" />
                          <Text style={styles.loadingText}>Loading stream...</Text>
                        </View>
                      )}
                    </>
                  ) : latestImage ? (
                    <>
                      <Image
                        source={{ uri: latestImage }}
                        style={styles.liveImage}
                        resizeMode="contain"
                        onLayout={handleImageLayout}
                      />
                      <CameraLabels cameraIndex={data?.data13}/>
                      {layout.width > 0 && layout.height > 0 && (
                        <ObjectMarker
                          x={coordinates[0]}
                          y={coordinates[1]}
                          imageWidth={ORIGINAL_WIDTH}
                          imageHeight={ORIGINAL_HEIGHT}
                          containerWidth={layout.width}
                          containerHeight={layout.height}
                        />
                      )}
                    </>
                  ) : (
                    <Text style={styles.panelText}>Waiting for Topview...</Text>
                  )}
                </View>
                <View style={styles.buttonContainer}>
  
  
                <View style={{ flexDirection: "row", gap: 15,borderWidth:1.5,borderColor:'#E7CA55',padding:8,borderRadius:30}}>
                  <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: joyStickmode ? "#E7CA55" : "#000" },
                  ]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    const val = 1;
                    setjoyStickMode(1)
                    onModeSetting(0,1,false);
                    // UDPModule.sendMode(true);
                  }}
                  disabled={start?true:false}
                >
                  <Icon name="gamepad" size={26} color={joyStickmode ? "#000" : "#A7A7A7"} />
                 
                </TouchableOpacity>
  
                    
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: !joyStickmode ? "#E7CA55" : "#000" },
                  ]}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setjoyStickMode(0)
                    onModeSetting(0,0,false);
                    onModeSetting(2,0,false);
                    setRecord(false)
  
                    // UDPModule.sendMode(false);
                  }}
                  disabled={start?true:false}
                >
                  <Icons name="route" size={26} color={!joyStickmode ? "#000" : "#A7A7A7"} />
                </TouchableOpacity>
  
              </View>
  
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  { backgroundColor: homePosition? "#E7CA55" : "#000",},
                ]}
                onPress={() => {
                  const newMode = Number(!homePosition);
                  setHomePosition(newMode)
                  if (newMode===1)
                    onModeSetting(1,1,false);
                  else
                    onModeSetting(1,0,false);
                  // UDPModule.sendMode(newMode);
                }}
                disabled={start?true:false}
              >
                <Icon name="street-view" size={28} color={homePosition ===1 ? "#000" : "#A7A7A7"} />
              </TouchableOpacity>
              
              <View style={{ flexDirection: "row", gap: 15,borderWidth:1.5,borderColor:'#E7CA55',padding:8,borderRadius:30}}>
                
                  <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: start ? "#E7CA55" : "#000" },
                  ]}
                  onPress={() => {
                    const val= 1;
                    setStart(1);
                    onModeSetting(3,1,true);
                    setIsStartTimer(true);
                    showStatus("started",true)
                    
                  }}
                  disabled={start?true:false}
                  
                >
                  <Icon name="play" size={26} color={start ? "#000" : "#A7A7A7"} />
                </TouchableOpacity>
  
                {/* Automatic Mode Button */}
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: !start ? "#E7CA55" : "#000" },
                  ]}
                  onPress={() => {
                    setStart(0);
                    onModeSetting(2,0,false);
                    onModeSetting(3,0,true);
                    setRecord(false);
                    setIsStartTimer(false)
                    // setAfterData([data]);
                    showStatus("stopped",true,)
                    // console.log("data ",data);
                    createPDF(data);          
            
                  }}
                  disabled={!start?true:false}
                >
                  <Icon name="stop" size={26} color={!start ? "#000" : "#A7A7A7"} />
                </TouchableOpacity>
              </View>
  
                {joyStickmode?( <TouchableOpacity
                  
                  style={record?styles.recordButtonPressed:!record&&start?[styles.recordbutton,{backgroundColor:'#96031A'}]:styles.recordbutton}
                  onPress={() => {
                   setRecord(prev=>!prev);
                   const currentState=!record
                   currentState?onModeSetting(2,1,false):onModeSetting(2,0,false)
                  }}  
                  disabled={start?true:false}
                >
                  {record ? <Animated.View style={[styles.square,{opacity:start?fadeAnim:1}]} /> : null}
                  
                </TouchableOpacity>):null}
                     {/* <Text style={{ color: "#fff" }}>Rec</Text> */}
                </View>   
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      flex: 1,
      height: '100%',
      width: '100%'
    },
    header:{
      flexDirection:'row',
      justifyContent:'space-between',
      marginLeft:40,
      marginRight:40,
      zIndex: 1000,
      elevation: 1000,
      position: 'relative',
    },
    logo:{
      fontSize:40,
      color:"white",
      fontFamily:'PostNoBillsJaffna-ExtraBold',
    },
    mainContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: width * 0.04,
      marginBottom:height*0.08,
    },
    leftPanel:{
      width:width*0.35,
      height:height*0.8,
      backgroundColor:'#262626',
      borderRadius:15,
      opacity:0.9,
    },
    rightPanelContainer: {
      flex: 1,
      marginLeft: 20,
      justifyContent: 'space-between',
    },
    rightPanel: {
      height: height * 0.7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#262626',
      borderRadius: 15,
      marginBottom: height * 0.02,
      position: 'relative', 
    },
    fullScreenMainContent: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      marginBottom:height*0.06,
    },
    fullSCreenRightPanel: {
      height: height*0.9,
      width:width*0.92,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor : '#262626',
      borderRadius: 15,
      borderColor:'#E7CA55',
      borderWidth:2,
      position: 'relative',    
    },
    liveImage: { 
      width: '100%',
      height: '100%',
      borderRadius: 8,
      opacity: 0.8,
    },
    fullScreenliveImage: { 
      width: '100%',
      height: '100%',
      opacity: 0.8,
    },
    fullScreenLiveVideo: {
      width: '100%',
      height: '100%',
    },
    LiveVideo: {
      width: '100%',
      height: '100%',
    },
    panelText: { 
      color: '#fff' 
    },
    servicebutton: {
      marginTop:20,
      height:40,
      backgroundColor: '#000',
      paddingVertical: 6,
      paddingHorizontal: 24,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      borderWidth:2,
      borderColor:'#E7CA55',
    },
    servicebuttonFullscreen: {
      marginTop:20,
      height:40,
      backgroundColor: '#E7CA55',
      paddingVertical: 8,
      paddingHorizontal: 24,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    servicebuttontext: {
      color: '#000',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    loadingText: {
      color: 'white',
      marginTop: 10,
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      gap:25,
    },
    joystickButton: {
      backgroundColor: '#000',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 8,
      width: '20%',
      alignItems: 'center',
      borderWidth:2,
      borderColor:'#E7CA55',
    },
    liveButton: {
      marginTop:20,
      height:40,
      backgroundColor: '#000',
      paddingVertical: 6,
      paddingHorizontal: 24,
      borderRadius: 20,
      // borderWidth:2,
      // borderColor:'#E7CA55',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    iconButton: {
      width: 50,
      height: 50,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: '#E7CA55',
      justifyContent: "center",
      alignItems: "center",
    },
    recordbutton:{
      marginLeft:500,
      position:'absolute',
      width:25,
      height:25,
      borderRadius:25,
      // borderWidth:2,
      borderColor:'#FF0000',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#FF0000',
    },
    recordButtonPressed:{
      marginLeft:500,
      position:'absolute',
      width:35,
      height:35,
      borderRadius:25,
      borderWidth:1.2,
      borderColor:'#fff',
      justifyContent:'center',
      alignItems:'center',
      // backgroundColor:'#FF0000',
    },
    square:{
      width:15,
      height:15,
      borderRadius:3,
      backgroundColor:'#FF0000',
    },
    date:{
      color:'#fff',
      fontSize:23,
      // marginTop:20,
      marginLeft:5,
      fontFamily:'PostNoBillsJaffna-Bold',
    }
  });
  
  export default Main;