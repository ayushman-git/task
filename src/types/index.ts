import { StringType } from "cliffy/command/mod.ts";

export enum TaskStatus {
  TODO = "todo",
  DOING = "doing",
  DONE = "done",
}

export enum TaskPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
}

export interface IActionHandler {
  priority?: (StringType & string) | undefined;
  status?: (StringType & string) | undefined;
}
