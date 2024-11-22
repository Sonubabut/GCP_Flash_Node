import axios from "axios";
import dotenv from "dotenv";
import logger from "./logging.js";

dotenv.config();

class GenAI {
  constructor() {
    this.url = process.env.SN_ENDPOINT_URL;
    this.apiKey = process.env.SAMBA_KEY;
    this.modelName = process.env.MODEL_NAME;
  }

  async getResponse(prompt, context = "") {
    if (!prompt || prompt.trim() === "") {
      return "Please enter a valid query";
    }

    const client = axios.create({
      baseURL: this.url,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    try {
      const response = await client.post("/chat/completions", {
        model: this.modelName,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for legal and legal-related problems",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        top_p: 0.1,
      });

      const { choices, ...filteredData } = response?.data || {};
      logger.info(`Response for getResponseGenAI`, {
        statusCode: response.status,
        data: filteredData,
      });

      return response?.data;
    } catch (error) {
      logger.error(`API request error: ${error.message}`);
      return "Error fetching response";
    }
  }
}

export default GenAI;
