# ChatApplication

# Real-Time Chat Application with Angular and .NET SignalR

This project is a real-time chat application built using Angular for the frontend and .NET with SignalR for the backend. The application demonstrates seamless real-time communication between users, enabling them to send and receive messages instantly.

### Key Features:
- **Real-Time Messaging**: Users can send and receive messages in real-time, leveraging the capabilities of .NET SignalR.
- **User Authentication**: Users must authenticate before joining the chat, ensuring secure and controlled access.
- **Group Chat**: Users can join and manage chat rooms, facilitating group conversations.
- **Modern UI**: The Angular frontend provides a user-friendly and responsive interface, enhancing the overall user experience.

### Technologies Used:
- **Frontend**: Angular
- **Backend**: .NET Core with SignalR
- **Real-Time Communication**: SignalR

### Architecture
```mermaid
graph LR
    A[User Input] --> B[Angular Frontend]
    B --> C[SignalR Real-time Messaging]
    C --> D[.NET Core Backend]
    D --> C
    C --> B
    B --> A
