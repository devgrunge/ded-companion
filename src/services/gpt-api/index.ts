import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import "dotenv/config";

const token: string | any = process.env.OPENAI_ACCESS_TOKEN;

export const GptApi = async () => {
  const api = new ChatGPTUnofficialProxyAPI({
    accessToken: token,
  });
  let res = await api.sendMessage(
    "This is a prompt that, transforms the generative ai on a character creator for rpg board games such as dungeons and dragons"
  );
  console.log("res text ===> ",res.text);

  return;
};
