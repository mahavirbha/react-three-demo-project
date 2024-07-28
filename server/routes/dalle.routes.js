import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

async function run(prompt) {
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/image/generation",
    headers: {
      authorization: `Bearer ${process.env.IMGGEN}`,
    },
    data: {
      providers: "openai/dall-e-3",
      text: prompt,
      resolution: "1024x1024",
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error in run function:", error);
    throw error;
  }
}

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await run(prompt);

    console.log("response:", response);

    const image = response["openai/dall-e-3"]?.items;

    res.status(200).json({ image: image });
  } catch (error) {
    console.error("API failed:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
