import router from "./router/router.js";

const app = document.querySelector("#app");

function render() {
  app.innerHTML = router();
}

render();
