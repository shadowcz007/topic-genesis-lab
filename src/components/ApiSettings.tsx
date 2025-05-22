
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiConfig } from "./TopicGenerator";

interface ApiSettingsProps {
  apiConfig: ApiConfig;
  onSave: (config: ApiConfig) => void;
  onCancel: () => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({
  apiConfig,
  onSave,
  onCancel,
}) => {
  const [config, setConfig] = useState<ApiConfig>(apiConfig);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API 设置</CardTitle>
        <CardDescription>
          配置 LLM API 用于生成社交话题
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">API 地址</Label>
            <Input
              id="apiUrl"
              name="apiUrl"
              value={config.apiUrl}
              onChange={handleChange}
              placeholder="https://api.siliconflow.cn/v1/chat/completions"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                name="apiKey"
                type={isApiKeyVisible ? "text" : "password"}
                value={config.apiKey}
                onChange={handleChange}
                placeholder="输入您的 API Key"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
              >
                {isApiKeyVisible ? "隐藏" : "显示"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Input
              id="model"
              name="model"
              value={config.model}
              onChange={handleChange}
              placeholder="Qwen/Qwen3-8B"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">保存设置</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiSettings;
