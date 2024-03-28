import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:10000";

// socket for socket.io -> used to communicate with other people in the same room
export const socket = io.connect();


