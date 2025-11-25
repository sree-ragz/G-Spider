package com.frontend;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPSender {
    private String host;
    private int port;
    
    public UDPSender(String host, int port) {
        this.host = host;
        this.port = port;
    }
    // Send single integer
    public void sendMode(boolean value) {
        new Thread(() -> {
            try {
                String message = String.valueOf(value);
                sendMessage(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    
    // Send array with exactly 3 elements
    public void sendArray(float[] data) {
        if (data.length != 3) {
            throw new IllegalArgumentException("Array must contain exactly 3 elements");
        }
        new Thread(() -> {
            try {
                String message = data[0] + "," + data[1] + "," + data[2];
                sendMessage(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    
    private void sendMessage(String message) {
        try {
            DatagramSocket socket = new DatagramSocket();
            InetAddress address = InetAddress.getByName(host);
            byte[] buffer = message.getBytes();
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length, address, port);
            
            socket.send(packet);
            socket.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}