import { IMessageHandler } from "./IMessageHandler";
import { Message } from "./Message";

export class MessageSubscriptionNode {
  message: Message;
  handler: IMessageHandler;

  constructor(message: Message, handler: IMessageHandler) {
    this.message = message;
    this.handler = handler;
  }
}
