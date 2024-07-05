import { useState, useEffect } from "react";
import {
  CopyOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { message } from "antd";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { voice } from "../content";
export default ({ item }) => {
  const [isPlay, setPlay] = useState(false);
  useEffect(() => {
    voice.onend = () => {
      setPlay(false);
    };
    voice.onpause = () => {
      setPlay(false);
    };
    voice.onresume = () => {
      setPlay(false);
    };
    voice.onerror = () => {
      setPlay(false);
    };
    return () => {
      speechSynthesis.cancel();
    };
  }, []);
  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    message.success("复制成功");
  };
  const speak = (text) => {
    speechSynthesis.cancel();
    const _text = text.replace(
      /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
      ""
    );
    voice.text = _text;
    voice.volume = 0.5;
    setPlay(true);
    speechSynthesis.speak(voice);
  };
  const pause = () => {
    speechSynthesis.cancel();
    setPlay(false);
  };
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: "-1.5rem",
        }}
      >
        {isPlay ? (
          <PauseCircleOutlined onClick={pause} />
        ) : (
          <PlayCircleOutlined onClick={() => speak(item.content)} />
        )}
        &emsp;
        <CopyOutlined onClick={() => copy(item.content)} />
      </div>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {item.content}
      </ReactMarkdown>
    </>
  );
};
