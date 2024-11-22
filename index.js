import dotenv from "dotenv";
import express from "express";
import logger from "./logging.js";
import GenAI from "./genAi.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.routes();
  }

  routes() {
    this.app.post("/flash/response", (req, res) => {
      this.getResponseGenAI(req, res);
    });
  }

  async getResponseGenAI(req, res) {
    try {
      const { question } = req.body;
      logger.info("Incoming request for getResponseGenAI", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        question,
      });

      if (!question) {
        logger.warn("Missing 'question' field in request", {
          method: req.method,
          url: req.url,
          ip: req.ip,
        });
        return res
          .status(400)
          .json({ error: "Missing 'question' field in request body" });
      }

      if (!this.genai) {
        this.genai = new GenAI();
      }

      const response = await this.genai.getResponse(question, "");
      const ret = response.choices
        ? response.choices[0].message.content
        : "No response found";

      res.json({ response: ret });
    } catch (error) {
      logger.error("Error in getResponseGenAI", {
        method: req.method,
        url: req.url,
        ip: req.ip,
        body: req.body,
        error: error.message,
        stack: error.stack,
      });
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

// Create the Express app
const server = new Server();

// Listen on the specified port
server.app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
