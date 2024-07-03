import "./App.less";
import Input from "./components/input/index";
import { useState, useEffect, useRef } from "react";
import main from "./components/openai/index.js";
import Modal from "./components/modal/index.jsx";
import Content from "./components/content/index.jsx";
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
  const fetchData = async () => {
    try {
      await main(history, config);
    } catch (error) {
      setHistory(history.slice(0, -1));
      setUserList(userList.slice(0, -1));
    }
  };
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.source === "stream") {
        // 更新状态
        setAssistantList((pre) => [...pre, event.data.data]);
        setHistory((pre) => [...pre.slice(0, -1), event.data.data]);
        scrollToBottom();
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

  async function onEnter(content) {
    setHistory([
      ...history,
      { role: "user", content },
      { role: "assistant", content: "" },
    ]);
    setUserList([...userList, { role: "user", content }]);
    scrollToBottom();
  }
  function scrollToBottom() {
    setTimeout(() => {
      const sheight = containerRef.current.scrollHeight;
      const cheight = containerRef.current.clientHeight;
      sheight - cheight > 0 && containerRef.current.scrollTo(0, sheight);
    }, 0);
  }
  function onConfig({ model, key }) {
    setConfig({ model, key });
    setHistory([{ role: "assistant", content: "" }]);
    setAssistantList([]);
    setUserList([]);
  }
  return (
    <div className="App">
      <div className="container" ref={containerRef}>
        <Content history={history} />
      </div>
      <Input onEnter={onEnter} assistantList={assistantList}>
        <Modal onConfig={onConfig} />
      </Input>
    </div>
  );
}

export default App;
