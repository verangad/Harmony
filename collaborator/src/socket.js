import { reactive } from "vue";
import {io} from "socket.io-client";


export const state = reactive({
    connected: false,
})
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:9999";

export const socket = io.connect();

socket.on('initialize', (msg) => {
    state.connected = true
    console.log(msg)
})

socket.on('scoreChangeBroadcast', (msg) => {
    console.log(msg)
})