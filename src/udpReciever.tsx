// import React, { useEffect } from 'react';
// import dgram from 'react-native-udp';
// import { Buffer } from 'buffer';

// export default function UdpReceiver({ port = 5005, onData }) {
//   useEffect(() => {
//     const socket = dgram.createSocket({type:'udp4'});

//     socket.bind(port);
//     console.log(`UDP socket listening on port ${port}`);

//     socket.on('message', (msg, rinfo) => {
//       const data = msg.toString();
//       console.log('Received UDP data:', data);
//       onData?.(data, rinfo); // Send data back to parent
//     });

//     return () => {
//       console.log('Closing UDP socket');
//       socket.close();
//     };
//   }, [port]);

//   return null; // no UI needed
// }
