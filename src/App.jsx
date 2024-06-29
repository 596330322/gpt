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
      const result = await main(history, config);
      setAssistantList([...assistantList, result]);
      setHistory([...history.slice(0, -1), result]);
      scrollToBottom();
    } catch (error) {
      setHistory(history.slice(0, -1));
      setUserList(userList.slice(0, -1));
    }
  };
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
    setAssistantList([]);
    setHistory([]);
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
