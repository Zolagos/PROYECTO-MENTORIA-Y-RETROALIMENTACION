import LoginView from "../js/views/login/index.js";
import { registerLoginEvents } from "../js/views/login/login.events.js";

export default function router() {
  queueMicrotask(() => {
    registerLoginEvents();
  });

  return LoginView();
}
