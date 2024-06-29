import { Modal, Select, Input, Button, FloatButton } from "antd";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
const Option = Select.Option;
const Model = [
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4-turbo",
  "gpt-4-turbo-2024-04-09",
  "gpt-4-0125-preview",
  "gpt-4-turbo-preview",
  "gpt-4-1106-preview",
  "gpt-4-vision-preview",
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-1106",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo-16k-0613",
  "google/gemma-2-9b-it:free",
];
export default function Dialog(props) {
  const [key, setKey] = useState(
    "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"
  );
  const [model, setModel] = useState("google/gemma-2-9b-it:free");
  const [show, toggleShow] = useState(true);
  function onOk() {
    if (!model || !key) {
      return;
    }
    props.onConfig({ key, model });
    toggleShow(false);
  }
  return (
    <div style={{}}>
      <FloatButton
        style={{ bottom: "5rem" }}
        type="primary"
        onClick={() => toggleShow(true)}
        icon={<SettingOutlined />}
      ></FloatButton>
      <Modal
        title="输入配置"
        open={show}
        onOk={() => onOk()}
        okText="确认"
        cancelText="取消"
        onCancel={() => toggleShow(false)}
        closable={false}
        maskClosable={false}
      >
        <span>选择模型</span>
        <Select
          style={{ width: "100%" }}
          value={model}
          onChange={(v) => setModel(v)}
        >
          {Model.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
        </Select>
        <span>输入key</span>
        <Input
          value={key}
          allowClear
          placeholder="你的OpenRouter API key"
          onChange={(e) => setKey(e.target.value)}
        />
      </Modal>
    </div>
  );
}
