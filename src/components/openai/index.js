// import OpenAI from "openai";
import { message } from "antd";
// async function main(messages, config) {
//   const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: config.key,
//     defaultHeaders: {
//       "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
//       "X-Title": "test", // Optional. Shows in rankings on openrouter.ai.
//     },
//     dangerouslyAllowBrowser: true,
//   });
//   // 初始化的时候默认请求一次
//   if (!messages[0].content) messages = [{ role: "user", content: "介绍一下自己" }];
//   const completion = await openai.chat.completions.create({
//     model: config.model, //"openai/gpt-3.5-turbo-0125",
//     messages,
//   });
//   if (completion.error) {
//     message.error(completion.error.message);
//   }
//   return { ...completion.choices[0].message, id: completion.id };
// }

const getReaderText = (str) => {
  let matchStr = "";
  let type = 'assistant'
  let result = str.match(/data:\s*({.*?})\s*\n/g);
  result && result.forEach((_) => {
    const matchStrItem = _.match(/data:\s*({.*?})\s*\n/)[1];
    const data = JSON.parse(matchStrItem);
    if(data.error) {
      message.error(data.error.message)
      throw new Error()
    }
    matchStr += data?.choices[0].delta?.content || '';
    type = data?.choices[0].delta?.role
  });

  return {content:matchStr,role:type};
};
async function main(messages, config) {
  // 初始化的时候默认请求一次
  if (!messages[0].content) messages = [{ role: "user", content: "介绍一下自己" }];
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    timeout:10000,
    headers: {
      "Authorization": `Bearer ${config.key}`,
      "HTTP-Referer": `http://localhost:3000`, // Optional, for including your app on openrouter.ai rankings.
      "X-Title": `TEST`, // Optional. Shows in rankings on openrouter.ai.
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.75,
      stream:true
    })
    });
  if (response.error) {
    message.error(response.error.message);
  }
  const encode = new TextDecoder("utf-8");
  const reader = response.body.getReader();
  let tmp = ''
  try {
    while (true) {
      const { done, value } = await reader.read();
      console.log(encode.decode(value))
      const text = getReaderText(encode.decode(value));
      tmp+=text.content
      if (done) {
        window.postMessage({source:'stream',data:{...text,content:tmp},state:'done'})
        break;
      }
      window.postMessage({source:'stream',data:{...text,content:tmp},state:'continue'})
    }
  } catch (error) {
    throw new Error()
  }
}
export default main;

