// CameraLabels.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CameraLabelsProps {
  labels?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
  labelStyle?: any;
  textStyle?: any;
  cameraIndex?: number;
}

const CameraLabels: React.FC<CameraLabelsProps> = ({ 
  labels = {
    topLeft: 'Camera 4',
    topRight: 'Camera 3',
    bottomRight: 'Camera 2',
    bottomLeft: 'Camera 1',
    
  },
  labelStyle,
  textStyle,
  cameraIndex
}) => {
  // console.log("Camera Index in CameraLabels:", cameraIndex);
  return (
    <>
      {cameraIndex==4?(<View style={[styles.topLeftLabel, labelStyle,{backgroundColor:'rgba(134, 133, 133, 0.7)'}]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.topLeft}</Text>
      </View>): <View style={[styles.topLeftLabel, labelStyle,{ backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}>
        <Text style={[styles.cameraLabelText, textStyle,]}>{labels.topLeft}</Text>
      </View>}
      
      {cameraIndex==3?(  <View style={[styles.topRightLabel, labelStyle,{backgroundColor:'rgba(134, 133, 133, 0.7)'}]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.topRight}</Text>
      </View>): <View style={[styles.topRightLabel, labelStyle]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.topRight}</Text>
      </View>}
     
      {cameraIndex==1?( <View style={[styles.bottomLeftLabel, labelStyle,{backgroundColor:'rgba(134, 133, 133, 0.7)'}]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.bottomLeft}</Text>
      </View>): <View style={[styles.bottomLeftLabel, labelStyle]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.bottomLeft}</Text>
      </View>}
     
      {cameraIndex==2?( <View style={[styles.bottomRightLabel, labelStyle,{backgroundColor:'rgba(134, 133, 133, 0.7)'}]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.bottomRight}</Text>
      </View>): <View style={[styles.bottomRightLabel, labelStyle]}>
        <Text style={[styles.cameraLabelText, textStyle]}>{labels.bottomRight}</Text>
      </View>}
     
    </>
  );
};

const styles = StyleSheet.create({
  topLeftLabel: {
    position: 'absolute',
    top: 5,
    left: 60,
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    // 'rgba(134, 133, 133, 0.7)'
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#E7CA55',
  },
  topRightLabel: {
    position: 'absolute',
    top: 5,
    right: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#E7CA55',
  },
  bottomLeftLabel: {
    position: 'absolute',
    bottom: 5,
    left: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#E7CA55',
  },
  bottomRightLabel: {
    position: 'absolute',
    bottom: 5,
    right: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#E7CA55',
  },
  cameraLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CameraLabels;