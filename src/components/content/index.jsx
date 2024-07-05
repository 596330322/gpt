import { Spin } from "antd";
import svg from "../../gpt.svg";
import { v4 as uuidv4 } from "uuid";
import Assistant from "../assistant";
export const voice = new SpeechSynthesisUtterance();
voice.rate = 1.1;
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
                  {item.role !== "user" ? (
                    <Assistant item={item}></Assistant>
                  ) : (
                    <div>{item.content}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
