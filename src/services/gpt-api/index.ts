import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import "dotenv/config";

export const GptWeb = async () => {
  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: process.env.OPENAI_ACCESS_TOKEN
  });
  let res = await api.sendMessage("What is OpenAI?");
  console.log(res.text);

  return;
};
