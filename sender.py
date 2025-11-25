# sender_server.py
import asyncio
import websockets
import base64
import socket
import json
# --- Detect current IP automatically ---
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

async def send_image(websocket):
    print("Client connected ✅")
    try:
        while True:
            with open("shaded_output_fullHD.jpg", "rb") as f:
                image_data = base64.b64encode(f.read()).decode("utf-8")
            await websocket.send(json.dumps({"image":image_data}))
            ack = await websocket.recv()
            print(ack)
            print("✅ Sent image")
            await asyncio.sleep(20)
    except websockets.ConnectionClosed:
        print("❌ Client disconnected")

async def main():
    ip = get_local_ip()
    port = 8080
    print(f"Server running on ws://{ip}:{port}")
    async with websockets.serve(send_image, "0.0.0.0", port):
        await asyncio.Future()  # run forever

asyncio.run(main())
