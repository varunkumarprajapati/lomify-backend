declare global {
  interface IMessage {
    senderId: string;
    receiverId: string;
    timestamp: string;
    text: string;
  }
}
export {};
