import { Message, MessagePriority } from "./Message";
import { IMessageHandler } from "./IMessageHandler";
import { MessageSubscriptionNode } from "./MessageSubscriptionNode";

export class MessageManager {
  private static _subscriptions: { [code: string]: IMessageHandler[] } = {};
  private static _messagesPerCycle: number = 10;
  private static _queue: MessageSubscriptionNode[] = [];

  private constructor() {}

  static addSubscription(code: string, handler: IMessageHandler): void {
    if (MessageManager._subscriptions[code] !== undefined) {
      MessageManager._subscriptions[code] = [];
    }

    if (MessageManager._subscriptions[code].indexOf(handler) !== -1) {
      console.warn("Handler already exists for following code: " + code);
    } else {
      MessageManager._subscriptions[code].push(handler);
    }
  }

  static removeSubscription(code: string, handler: IMessageHandler): void {
    if (MessageManager._subscriptions[code] === undefined) {
      console.warn(
        "Cannot remove subscription from code: " +
          code +
          " because code is not subscribed"
      );
      return;
    }
    let nIndex = MessageManager._subscriptions[code].indexOf(handler);
    if (nIndex !== -1) {
      MessageManager._subscriptions[code].splice(nIndex, 1);
    }
  }

  static post(message: Message): void {
    console.info("Message posted : " + message);
    let handlers = MessageManager._subscriptions[message.code];
    if (handlers === undefined) return;
    else {
      handlers.forEach((h) => {
        if (message.priority === MessagePriority.HIGH) {
          h.onMessage(message);
        } else {
          MessageManager._queue.push(new MessageSubscriptionNode(message, h));
        }
      });
    }
  }

  static update(): void {
    if (MessageManager._queue.length > 0) {
      let messageLimit = Math.min(
        MessageManager._messagesPerCycle,
        MessageManager._queue.length
      );
      for (let i = 0; i < messageLimit; i++) {
        let node = MessageManager._queue.pop();
        node.handler.onMessage(node.message);
      }
    }
  }
}
