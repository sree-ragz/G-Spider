# import socket
# import time
# import random

# # UDP target IP and port (Android device)
# UDP_IP = "192.168.36.128"  # Android IP
# UDP_PORT = 5000

# # Create UDP socket
# sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# # Frame dimensions (16:9)
# FRAME_WIDTH = 1920
# FRAME_HEIGHT = 1080

# # Initialize continuous position
# x = random.randint(0, FRAME_WIDTH)
# y = random.randint(0, FRAME_HEIGHT)

# # Random direction (velocity)
# vx = random.choice([-5, 5])
# vy = random.choice([-3, 3])

# while True:
#     # Update continuous coordinates
#     x += vx
#     y += vy

#     # Bounce on edges
#     if x <= 0 or x >= FRAME_WIDTH:
#         vx *= -1
#         x = max(0, min(FRAME_WIDTH, x))
#     if y <= 0 or y >= FRAME_HEIGHT:
#         vy *= -1
#         y = max(0, min(FRAME_HEIGHT, y))

#     # Generate other random float values
#     data = [round(random.uniform(0, 100), 5) for _ in range(13)]

#     # Replace 4th & 5th values (index 3 & 4) with continuous coordinates
#     data[3] = round(x, 2)
#     data[4] = round(y, 2)

#     # Convert to string
#     message = ",".join(map(str, data))
    
#     # Send message
#     sock.sendto(message.encode(), (UDP_IP, UDP_PORT))
#     print(f"Sent: {message}")

#     # Send every 100ms
#     time.sleep(0.1)

import socket
import time
import random

# UDP target IP and port (Android device)
UDP_IP = "192.168.36.28"  # Replace with Android device IP
UDP_PORT = 5000

# Create UDP socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

# Frame dimensions (16:9)
FRAME_WIDTH = 1920
FRAME_HEIGHT = 1080

# Initialize continuous position
x = random.randint(0, FRAME_WIDTH)
y = random.randint(0, FRAME_HEIGHT)

# Random direction (velocity)
vx = random.choice([-5, 5])
vy = random.choice([-3, 3])

# Timer for extra value
extra_value = 1
last_extra_update = time.time()

while True:
    # Update continuous coordinates
    x += vx
    y += vy

    # Bounce on edges
    if x <= 0 or x >= FRAME_WIDTH:
        vx *= -1
        x = max(0, min(FRAME_WIDTH, x))
    if y <= 0 or y >= FRAME_HEIGHT:
        vy *= -1
        y = max(0, min(FRAME_HEIGHT, y))

    # Update extra_value every 1 second (cycle 1 → 4)
    if time.time() - last_extra_update >= 1.0:
        extra_value += 1
        if extra_value > 4:
            extra_value = 1
        last_extra_update = time.time()

    # Generate 13 random float values
    data = [round(random.uniform(0, 100), 5) for _ in range(13)]

    # Replace 4th & 5th values (index 3 & 4) with continuous coordinates
    data[3] = round(x, 2)
    data[4] = round(y, 2)

    # Add the extra delayed value (1–4)
    data.append(extra_value)

    # Convert to comma-separated string
    message = ",".join(map(str, data))

    # Send message
    sock.sendto(message.encode(), (UDP_IP, UDP_PORT))
    print(f"Sent: {message}")

    # Send every 100ms
    time.sleep(0.1)
