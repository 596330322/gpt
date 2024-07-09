import { Input } from "antd";
import { UpCircleFilled } from "@ant-design/icons";
import { useState, useEffect, memo, useRef } from "react";
import "./index.less";
const Inputs = memo(
  (props) => {
    const [value, setValue] = useState("");
    const [disabled, setDisabled] = useState(true);
    const focus = useRef();
    function handleKeyDown(e) {
      if (disabled || !value.trim()) {
        return;
      }
      if (e.keyCode === 13) {
        props.onEnter(value.trim());
        setValue("");
        setDisabled(true);
      }
    }
    useEffect(() => {
      console.log(props.streaming);
      if (props.streaming) {
        setDisabled(true);
      } else {
        setDisabled(false);
        setFocus();
      }
    }, [props.streaming]);
    const setFocus = () => {
      focus.current.focus();
    };

    return (
      <div className="input-box">
        {props.children}
        <Input
          ref={focus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          size="large"
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus={true}
          suffix={
            <UpCircleFilled onClick={() => handleKeyDown({ keyCode: 13 })} />
          }
          placeholder="输入点什么吧"
        />
      </div>
    );
  },
  (pre, next) => {
    return pre.assistantList.length === next.assistantList.length;
  }
);
export default Inputs;
