## G_Spider Code ##

# import socket
# UDP_IP = "127.0.0.1"
# UDP_PORT = 5005
# MESSAGE = b"Hello, helen!"
 
# print("UDP target IP: %s" % UDP_IP)
# print("UDP target port: %s" % UDP_PORT)
# print("message: %s" % MESSAGE)
 
# sock = socket.socket(socket.AF_INET, # Internet
#                      socket.SOCK_DGRAM) # UDP
# sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))


# import socket
# import json
# import threading
# import time

# joystick_enabled = False

# flag_lock = threading.Lock()

# def set_joystick_flag(state: bool):
#     global joystick_enabled
#     with flag_lock:
#         joystick_enabled = state

# def get_joystick_flag() -> bool:
#     with flag_lock:
#         return joystick_enabled

# def ui_listener():
#     """
#     Listens for JSON packets from Android.
#     Expected JSON format:
#        {"joystick": 1}   -> enable
#        {"joystick": 0}   -> disable
#     """
#     UDP_IP = "127.0.0.1"     
#     UDP_PORT = 5008        
    
#     sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
#     sock.bind((UDP_IP, UDP_PORT))

#     print(f"[UI] Listening for joystick messages on UDP {UDP_IP}:{UDP_PORT}")

#     while True:
#         data, addr = sock.recvfrom(1024)
#         try:
#             msg = json.loads(data.decode('utf-8'))
#             if "joystick" in msg:
#                 state = bool(int(msg["joystick"]))
#                 set_joystick_flag(state)
#                 print(f"[UI] Joystick state updated to {state} from {addr}")
#         except Exception as e:
#             print("[UI] Invalid message:", e)


# def main_loop():
#     """
#     Example loop showing the flag is persistent.
#     Replace this with your real robot logic.
#     """
#     while True:
#         state = get_joystick_flag()
#         print(f"Joystick Enabled: {state}")
#         time.sleep(1)

# if __name__ == "__main__":
#     t = threading.Thread(target=ui_listener, daemon=True)
#     t.start()

#     main_loop()


# import asyncio
# import websockets
# import json
# import numpy as np

# from g_spider_functions import process_images


# # ------------------------ WEBSOCKET TRIGGER FUNCTION -------------------------- #
# async def my_function(ws):
#     print("Trigger received → Processing images...")

#     result_array = process_images()

#     if result_array is None:
#         await ws.send(json.dumps({"status": "no_images"}))
#         return

#     await ws.send(json.dumps({
#         "status": "done",
#         "array": result_array.tolist()
#     }))

#     print("Response sent back to Android.")


# # ---------------------------- WEBSOCKET HANDLER ------------------------------ #
# async def handler(ws):
#     print("Client connected!")

#     async for msg in ws:
#         print("Message from Android:", msg)
#         #await ws.send(json.dumps({"signal": True}))
#         try:
#             data = json.loads(msg)

#             # Android trigger format: [0,0,0,1,0,1]
#             if isinstance(data, list) and len(data) == 6 and data[5] == 1:
#                 await my_function(ws)

#         except Exception as e:
#             print("Invalid message:", e)


# # ----------------------------- SERVER MAIN ----------------------------------- #
# async def main():
#     print("Server running at ws://0.0.0.0:8083")
#     async with websockets.serve(handler, "0.0.0.0", 8083):
#         await asyncio.Future()  # keep alive

# asyncio.run(main())


# def process_images():
#     cam1, cam2 = get_latest_images(cam1_folder, cam2_folder)
#     cam1_u = undistort_image(cam1)
#     cam2_u = undistort_image(cam2)
#     cv2.imwrite("cam1_processed.jpg", cam1_u)
#     cv2.imwrite("cam2_processed.jpg", cam2_u)
#     result_array = np.array([1,2,3,4], dtype=np.float32)
#     return result_array

import asyncio
import websockets
import json
import cv2
# from g_spider_functions import process_images
import base64

##-------------------------------Image-----------------------------------------##
async def send_image(ws):
    # img = cv2.imread()
    # _, jpeg_buffer = cv2.imencode('image.png', img, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    # img_b64 = base64.b64encode(jpeg_buffer).decode('utf-8')

    # print(f"Sending image of size {len(img_b64)} bytes...")
    
    # Send image
    # await ws.send(json.dumps({
    #     "type": "image",
    #     "data": img_b64
    # }))
    with open("shaded_output_fullHD.jpg", "rb") as f:
                image_data = base64.b64encode(f.read()).decode("utf-8")
    await ws.send(json.dumps({"image": image_data}))
    print("Image sent! Waiting for acknowledgment...")
    
    ack = await ws.recv()
    print("Acknowledgment received:", ack)



# ---------------------------- WEBSOCKET HANDLER ------------------------------ #
async def handler(ws):
    print("Client connected!")

    async for msg in ws:
        print("Message from Android:", msg)

        try:
            data = json.loads(msg)
            print("data ",data)
            # If Android sends [0,0,0,1,0,1]
            if len(data["mode"]) == 7 and data["mode"][6] == 1:  
                print("Trigger received → Sending TRUE signal...")
                await ws.send(json.dumps({"mode_ack": 1}))
                # img1,img2=process_images()
                await send_image(ws)
                


            # else:
            #     await ws.send(json.dumps({"signal": False}))
        except Exception as e:
            print("Invalid message:", e)
        


# ----------------------------- SERVER MAIN ----------------------------------- #
async def main():
    print("Server running at ws://0.0.0.0:8080")
    async with websockets.serve(handler, "0.0.0.0", 8080):
        await asyncio.Future()  

asyncio.run(main())
