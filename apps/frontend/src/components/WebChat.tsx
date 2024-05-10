// https://github.com/schuettc/react-websocket-reader-for-kds/blob/main/site/src/WebSocketReader.tsx
// https://www.npmjs.com/package/react-use-websocket

import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
const WEB_SOCKET_URL =
  'wss://p788zz04m7.execute-api.ap-southeast-1.amazonaws.com/production';

const MessageItem = ({ message }: MessageEvent<any>) => {
  console.log(message);
  return (
    <div className="chat-message">
      <div
        className={`flex items-end ${
          message.origin === 'self' ? 'justify-end' : ''
        }`}
      >
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <span
              className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${
                message.origin === 'self'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {message ? message.data : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
const WebChat = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState(WEB_SOCKET_URL);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    setSocketUrl(WEB_SOCKET_URL);
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl(WEB_SOCKET_URL),
    []
  );

  const handleClickSendMessage = useCallback(() => {
    const message = { action: 'sendmessage', message: newMessage };
    console.log('message', message);
    sendMessage(JSON.stringify(message));
    const lastMessage = {
      data: newMessage,
      origin: 'self',
    } as MessageEvent<any>;
    console.log('lastMessage', lastMessage);
    setMessageHistory((prev) => prev.concat(lastMessage));

    setNewMessage('');
  }, [newMessage, sendMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <>
      <span>The WebSocket is currently {connectionStatus}</span>
      {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messageHistory.map((message, idx) => (
            <MessageItem key={idx} message={message}></MessageItem>
          ))}
        </div>
        <ul></ul>
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            value={newMessage || ''}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
          ></input>

          <button
            type="button"
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
            className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
          >
            <span className="font-bold">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-6 w-6 ml-2 transform rotate-90"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default WebChat;
