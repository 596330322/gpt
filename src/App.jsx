import "./App.less";
import Input from "./components/input/index";
import { useState, useEffect, useRef } from "react";
import main from "./components/openai/index.js";
import Modal from "./components/modal/index.jsx";
import Content from "./components/content/index.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { message } from "antd";
function App() {
  // gpt answers
  const [assistantList, setAssistantList] = useState([]);
  // user asks
  const [userList, setUserList] = useState([]);
  // history content
  const [history, setHistory] = useState([]);
  // config
  const [config, setConfig] = useState({});
  const containerRef = useRef();
  const [streaming, setSteaming] = useState(false);
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.source === "stream") {
        // 更新状态
        if (event.data.state === "done") {
          setSteaming(false);
        } else {
          setSteaming(true);
        }
        setAssistantList((pre) => [...pre, event.data.data]);
        setHistory((pre) => [...pre.slice(0, -1), event.data.data]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      // 清除事件监听
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  useEffect(() => {
    config.key && fetchData();
  }, [userList.length]);
  useEffect(() => {
    config.key && fetchData();
  }, [config.key, config.model]);
  useEffect(() => {
    const sheight = containerRef.current.scrollHeight;
    window.scrollTo({ top: sheight });
  }, [containerRef?.current?.scrollHeight]);
  const fetchData = async () => {
    try {
      await main(history, config);
    } catch (error) {
      setHistory(history.slice(0, -1));
      setUserList(userList.slice(0, -1));
      message.error("看来出了点问题，试试别的吧");
    }
  };
  async function onEnter(content) {
    setHistory([
      ...history,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);
    setUserList([...userList, { role: "user", content }]);
  }
  function onConfig({ model, key }) {
    setConfig({ model, key });
    setHistory([{ role: "assistant", content: "" }]);
    setAssistantList([]);
    setUserList([]);
  }
  return (
    <div className="App">
      <div className="nav">Assistant</div>
      <div className="container" ref={containerRef}>
        <Content history={history} />
      </div>
      <Input
        onEnter={onEnter}
        assistantList={assistantList}
        streaming={streaming}
      >
        <Modal onConfig={onConfig} />
      </Input>
      <SpeedInsights />
    </div>
  );
}

export default App;
