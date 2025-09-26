import { IncomingMessage, ServerResponse } from "http";
import { ContentType } from "../utils/content-type";

const defaultContent = { "Content-Type": ContentType.JSON };

export const getHealth = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const healthInfo = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      port: process.env.PORT || "3333",
      host: process.env.HOST || "127.0.0.1"
    }
  };

  res.writeHead(200, defaultContent);
  res.write(JSON.stringify(healthInfo, null, 2));
  res.end();
};