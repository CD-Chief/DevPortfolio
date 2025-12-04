---
id: 4
title: "Gaze-Guided Remote Camera (DurHackX 2025)"
size: "M"
tech: ["Raspberry Pi", "Python", "Flask", "React", "MediaPipe", "Gemini API"]
summary: "A gaze-controlled remote camera system using face tracking, a Raspberry Pi servo mount, and AI-generated scene descriptions for accessibility."
link: "#"
image: "/projects/Durhack1.png"
showMoreButton: true
---

# Gaze-Guided Remote Camera (DurHackX 2025)

At DurHackX 2025, our team built a remote camera system that mimics the experience of looking through a window by moving a physical camera based on the viewer’s head position.

## Project Overview

The system uses a camera mounted on a servo-driven Raspberry Pi as a remote “window” into another space. On the client side, a laptop tracks the user’s face with MediaPipe and sends head-position data to the Raspberry Pi, which turns the camera in the opposite direction. As you move your head, the camera adjusts, making it feel like you are looking around the remote environment in real time. To improve accessibility, the system also uses the Gemini API to generate textual descriptions of what the camera sees and reads them aloud via text-to-speech.

## Key Features

- **Gaze-Based Camera Control**: Face tracking on the client controls the camera angle, creating a natural “look-around” effect.
- **Remote Exploration**: Users can explore a physical environment remotely through live video and audio descriptions.
- **Accessibility Focus**: Designed with physically impaired users in mind, offering both visual and spoken descriptions of the scene.
- **Hackathon-Ready Implementation**: Built end-to-end in a weekend, from hardware setup to API design and front-end interface.

## Technical Implementation

- **Frontend**: React-based interface running on a laptop, integrating MediaPipe for real-time face tracking and sending head-position data to the backend.
- **Backend**: Flask API that receives face tracking data, calculates the appropriate servo angle, and forwards commands to the Raspberry Pi.
- **Hardware**: Raspberry Pi controlling a servo-mounted camera, translating API commands into smooth physical camera movement.
- **AI Integration**: Gemini API used to generate descriptions of the camera feed, which are then converted to speech to narrate the scene to the user.

## Challenges & Solutions

One of the main challenges was converting raw face tracking data into stable camera movement. Early versions were jittery and oversensitive to small head movements. To address this, the team refined the mapping and smoothing logic, adjusting the calculations and adding constraints so the servo responded more predictably and comfortably. There were also hardware timing and latency issues between the laptop, API, and Raspberry Pi, which were mitigated by tuning update intervals and simplifying the control loop.

## Impact

The prototype demonstrates how computer vision, lightweight hardware, and AI can combine to give users with limited mobility a more intuitive way to explore remote spaces. It also highlights practical experience in bridging frontend, backend, and embedded systems under time constraints.
