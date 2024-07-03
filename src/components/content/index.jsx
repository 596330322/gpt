import { Spin, Input } from "antd";
import svg from "../../gpt.svg";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
export default function Content(props) {
  const { history } = props;
  return (
    <>
      {history.map((item) => (
        <div
          key={uuidv4()}
          style={{
            flexDirection: item.role === "user" ? "row-reverse" : "row",
            display: "flex",
          }}
        >
          <div className={item.role === "user" ? "user-box" : "gpt-box"}>
            {item.role !== "user" && <img src={svg} />}
            <div className="content">
              <div className="title">
                {item.role === "user" ? "你" : item.role}
              </div>
              {!item.content ? (
                <Spin spinning={true} />
              ) : (
                <div className="text">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {item.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
