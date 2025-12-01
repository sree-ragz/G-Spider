import { View ,Dimensions,} from 'react-native';
import React, { useEffect, useState ,useRef} from 'react';
const {width,height}=Dimensions.get('window')
const ORIGINAL_WIDTH = 1920;
const ORIGINAL_HEIGHT = 1080;
const  ObjectMarker: React.FC<{ 
  x: number; 
  y: number; 
  imageWidth: number; 
  imageHeight: number;
  containerWidth: number;
  containerHeight: number;
}> = ({ x, y, imageWidth, imageHeight, containerWidth, containerHeight }) => {
  // Calculate the actual displayed image dimensions (centered in container)
  const scale = Math.min(containerWidth / ORIGINAL_WIDTH, containerHeight / ORIGINAL_HEIGHT);
  const displayedWidth = ORIGINAL_WIDTH * scale;
  const displayedHeight = ORIGINAL_HEIGHT * scale;
  
  // Calculate offsets for centered image
  const offsetX = (containerWidth - displayedWidth) / 2;
  const offsetY = (containerHeight - displayedHeight) / 2;

  // Normalize the coordinate based on the original size and apply scaling
  const plottedX = (x / ORIGINAL_WIDTH) * displayedWidth + offsetX;
  const plottedY = (y / ORIGINAL_HEIGHT) * displayedHeight + offsetY;
  return (
    <View
      style={{
        position: "absolute",
        left: plottedX - 10,
        top: plottedY - 10,
        width: 35,
        height: 35,
        borderRadius: 15,
        backgroundColor: "red",
        borderWidth: 2,
        borderColor: "white",
      }}
    />
  );
};
export default ObjectMarker;