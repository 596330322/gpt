import { Input } from "antd";
import { UpCircleFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import "./index.less";
function Inputs(props) {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(true);
  function handleKeyDown(e) {
    if (disabled) {
      return;
    }
    if (e.keyCode === 13) {
      props.onEnter(value.trim());
      setValue("");
      setDisabled(true);
    }
  }
  useEffect(() => {
    setDisabled(false);
  }, [props.assistantList.length]);

  return (
    <div className="input-box">
      {props.children}
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        size="large"
        onKeyDown={handleKeyDown}
        disabled={disabled}
        suffix={
          <UpCircleFilled onClick={() => handleKeyDown({ keyCode: 13 })} />
        }
        placeholder="输入点什么吧"
      />
    </div>
  );
}
export default Inputs;
