package com.frontend;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.SocketException;
import java.net.InetAddress;

public class UDPServer extends Thread {
    private int port;
    private boolean running;
    private DatagramSocket socket;
    private DataCallback callback;
    public interface DataCallback {
        void onDataReceived(float[] data);
    }

    public UDPServer(int port, DataCallback callback) {
        this.port = port;
        this.callback = callback;
    }

    @Override
    public void run() {
        running = true;
        try {
            socket = new DatagramSocket(port);
            byte[] buffer = new byte[1024];
            while (running) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);
                String message = new String(packet.getData(), 0, packet.getLength());
                // Example: parse float values from incoming data
                String[] parts = message.split(",");
                float[] data = new float[parts.length];
                for (int i = 0; i < parts.length; i++) {
                    try {
                        float value = Float.parseFloat(parts[i]);
                        data[i] = value;
                    } catch (NumberFormatException e) {
                        data[i] = 0;
                    }
                }

                callback.onDataReceived(data);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (socket != null && !socket.isClosed()) {
                socket.close();
            }
        }
    }

    public void stopServer() {
        running = false;
        if (socket != null && !socket.isClosed()) {
            socket.close();
        }
    }
}

