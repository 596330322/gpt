import OpenAI from "openai";
import { message } from "antd";
async function main(messages, config) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: config.key,
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
      "X-Title": "test", // Optional. Shows in rankings on openrouter.ai.
    },
    dangerouslyAllowBrowser: true,
  });
  if (!messages.length) messages = [{ role: "user", content: "介绍一下自己" }];
  const completion = await openai.chat.completions.create({
    model: config.model, //"openai/gpt-3.5-turbo-0125",
    messages,
    // stream:true
  });
  if (completion.error) {
    message.error(completion.error.message);
  }
  // console.log(completion)
  // completion.on('data',(chunk) => {console.log(chunk)})
  return { ...completion.choices[0].message, id: completion.id };
}
export default main;
