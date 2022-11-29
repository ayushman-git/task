import { colors } from "cliffy/ansi/colors.ts";
import { TaskPriority, TaskStatus } from "types";

export const statusCheck = (status: string) => {
  const isCorrect = Object.values(TaskStatus).includes(status as TaskStatus);
  if (!isCorrect) {
    console.log(
      "❌",
      colors.red("Accepted status values are"),
      colors.red.bold(
        `${TaskStatus.TODO}, ${TaskStatus.DOING} and ${TaskStatus.DOING}.`,
      ),
    );
  }
  return isCorrect;
};

export const priorityCheck = (priority: string) => {
  const isCorrect = Object.values(TaskPriority).includes(
    priority as TaskPriority,
  );
  if (!isCorrect) {
    console.log(
      "❌",
      colors.red("Accepted priority values are"),
      colors.red.bold(
        `${TaskPriority.LOW}, ${TaskPriority.NORMAL} and ${TaskPriority.HIGH}.`,
      ),
    );
  }
  return isCorrect;
};
