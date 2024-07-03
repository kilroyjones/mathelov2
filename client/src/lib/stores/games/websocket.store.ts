// Libraries and modules
import { io, Socket } from 'socket.io-client';
import { writable, type Writable } from 'svelte/store';

// Variables
import { PUBLIC_GAME_SERVER_URL } from '$env/static/public';

interface SocketStore extends Writable<Socket | null> {
	connect: () => void;
	disconnect: () => void;
	sendMessage: (event: string, data: any) => void;
	handleMessage: (callback: (event: string, data: any) => void) => void;
}

const createSocketStore = (url: string): SocketStore => {
	const { subscribe, set, update } = writable<Socket | null>(null);

	function connect() {
		update((socket) => {
			if (socket) {
				console.log('Already connected');
				return socket;
			}
			const newSocket = io(url);

			newSocket.on('connect', () => {
				console.log('Socket.IO connection established');
				set(newSocket);
			});

			newSocket.on('disconnect', () => {
				console.log('Socket.IO connection closed');
				disconnect();
				set(null);
			});

			newSocket.on('connect_error', (error) => {
				console.error('Socket.IO connection error:', error);
				set(null);
			});

			return newSocket;
		});
	}

	function disconnect() {
		update((socket) => {
			if (socket) {
				socket.off('message'); // Remove message event listener
				socket.disconnect(); // Properly disconnect the socket
			}
			return null;
		});
	}

	function sendMessage(event: string, data: any) {
		update((socket) => {
			if (socket) {
				console.log(event, data);
				socket.emit(event, data);
			}
			return socket;
		});
	}

	function handleMessage(callback: (event: string, data: any) => void) {
		update((socket) => {
			if (socket) {
				socket.off('message');
				socket.on('message', (data) => {
					callback('message', data);
				});
			}
			return socket;
		});
	}

	return {
		subscribe,
		set,
		update,
		connect,
		disconnect,
		sendMessage,
		handleMessage
	};
};

console.log(PUBLIC_GAME_SERVER_URL);

export const socketStore = createSocketStore('http://localhost:3000');
