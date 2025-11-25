package com.frontend;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReadableArray;

public class UDPModule extends ReactContextBaseJavaModule {
    private UDPServer udpServer;
    private UDPSender udpModeSender;
    private UDPSender udpCalibrationSender;
    public UDPModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    
    @Override
    public String getName() {
        return "UDPModule";
    }
    
    @ReactMethod
    public void startUDP(int port) {
        udpServer = new UDPServer(port, this::sendDataToJS);
        udpServer.start();
    }
    
    @ReactMethod
    public void stopUDP() {
        if (udpServer != null) {
            udpServer.stopServer();
        }
    }

    @ReactMethod                   
    public void udpModeSender(String host, int port) {
        udpModeSender = new UDPSender(host, port);
    }
    @ReactMethod                   
    public void udpCalibrationSender(String host, int port) {
        udpCalibrationSender = new UDPSender(host, port);
    }

    @ReactMethod
    public void sendMode(boolean state) {
        if (udpModeSender != null) {
            udpModeSender.sendMode(state);
        }
    }
    
    @ReactMethod
    public void sendCalibration(ReadableArray data) {
        if (udpCalibrationSender != null && data.size() == 3) {
            float[] floatData = new float[3];
            floatData[0] = (float) data.getDouble(0);
            floatData[1] = (float) data.getDouble(1);
            floatData[2] = (float) data.getDouble(2);
            udpCalibrationSender.sendArray(floatData);
        }
    }

    private void sendDataToJS(float[] data) {
        android.util.Log.d("UDPModule", "Sending data to JS: " + java.util.Arrays.toString(data));
        WritableMap params = Arguments.createMap();
        params.putDouble("data0", data[0]);
        params.putDouble("data1", data[1]);
        params.putDouble("data2", data[2]);
        params.putDouble("data3", data[3]);
        params.putDouble("data4", data[4]);
        params.putDouble("data5", data[5]);
        params.putDouble("data6", data[6]);
        params.putDouble("data7", data[7]);
        params.putDouble("data8", data[8]);
        params.putDouble("data9", data[9]);
        params.putDouble("data10", data[10]);
        params.putDouble("data11", data[11]);
        params.putDouble("data12", data[12]);
        params.putDouble("data13", data[13]);
        
        // ... add other data points
        
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onUDPData", params);
    }
}