import { createLogger, format, transports } from "winston";
import { OpensearchTransport } from "winston-opensearch";

const opensearchEndpoint =
  "https://search-obs-vlgxybk6q4jww7esafnoufxpsa.us-east-2.es.amazonaws.com";
const opensearchUsername = "admin";
const opensearchPassword = "Sonu@Ob2024";

if (!opensearchEndpoint) {
  throw new Error("Missing OPENSEARCH_ENDPOINT environment variable");
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
    new OpensearchTransport({
      level: "info",
      clientOpts: {
        node: opensearchEndpoint,
        auth: {
          username: opensearchUsername,
          password: opensearchPassword,
        },
        maxRetries: 3,
      },
      index: process.env.OPENSEARCH_INDEX || "logs-flash",
      ensureIndexTemplate: false,
    }),
  ],
});

export default logger;
