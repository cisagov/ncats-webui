import * as io from "socket.io-client";

import { CyhyDataSource } from "./cyhy-data-source";

export class CyhySocketIODataSource extends CyhyDataSource<string> {
  private _server: string;
  private _room: string;
  private _data_event: string;
  private _data_request_event: string;
  private _socket: SocketIOClient.Socket;
  private _connected: boolean;

  constructor(
    name: string,
    socketio_server: string,
    socketio_room: string,
    data_event: string,
    data_request_event?: string
  ) {
    super();
    this._name = name;
    this._server = socketio_server;
    this._room = socketio_room;
    this._data_event = data_event;
    this._data_request_event = data_request_event;
    this._socket = io(socketio_server);

    this.initialize();
  }

  initialize(): void {
    this.update(null);

    this._setupSocketHandlers();
  }

  isConnected(): boolean {
    return this._connected;
  }

  _joinSocketRooms(): void {
    this._socket.emit("join", { room: this._room });

    if (this._data_request_event) {
      this._socket.emit(this._data_request_event);
    }

    console.log("connected (" + this._room + ")");
  }

  _setupSocketHandlers(): void {
    this._socket.on("connect", () => {
      this._joinSocketRooms();
      this._connected = true;
    });

    this._socket.on("disconnect", () => {
      this._connected = false;
    });

    this._socket.on(this._data_event, (msg) => {
      this.update(msg);
    });
  }
}
