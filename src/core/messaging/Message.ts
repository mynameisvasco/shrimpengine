import { MessageManager } from "./MessageManager";
import { IMessageHandler } from "./IMessageHandler";

export enum MessagePriority {
  HIGH = "HIGH",
  LOW = "LOW",
}

export class Message {
  public code: string;
  public content: any;
  public sender: any;
  public priority: string;

  constructor(
    code: string,
    sender: any,
    content: any = "Empty.",
    priority: string
  ) {
    this.code = code;
    this.sender = sender;
    this.content = content;
    this.priority = priority;
  }

  static send(code: string, sender: any, content: any, priority: string): void {
    MessageManager.post(new Message(code, sender, content, priority));
  }

  static subscribe(code: string, handler: IMessageHandler): void {
    MessageManager.addSubscription(code, handler);
  }

  static unsubscribe(code: string, handler: IMessageHandler): void {
    MessageManager.removeSubscription(code, handler);
  }
}
