import dotenv from "dotenv";
import app from "./app.js";
import env from "./config/env.js";
import { loadRoles } from "./config/roles.js";

dotenv.config();

const PORT = env.PORT;

await loadRoles();

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
