import * as http from "http";
import { app } from "./app";

const server = http.createServer(app);

// Garante que a porta seja um número (caso contrário, Node tenta abrir um pipe ao receber string)
const port = Number(process.env.PORT) || 3333;
const host = process.env.HOST || "127.0.0.1";

server.listen(port, host, () => {
  console.log(`servidor iniciado na porta ${port}`);
});
