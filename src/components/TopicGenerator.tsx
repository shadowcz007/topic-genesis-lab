
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bookmark, RefreshCw, Search, Star } from "lucide-react";
import { toast } from "sonner";
import TemplateList from "./TemplateList";
import TopicCard from "./TopicCard";
import ApiSettings from "./ApiSettings";
import FavoriteTopics from "./FavoriteTopics";

export type Topic = {
  id: string;
  content: string;
  category: string;
};

export type ApiConfig = {
  apiUrl: string;
  apiKey: string;
  model: string;
};

const defaultApiConfig: ApiConfig = {
  apiUrl: "https://api.siliconflow.cn/v1/chat/completions",
  apiKey: "",
  model: "Qwen/Qwen3-8B",
};

const TopicGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [favorites, setFavorites] = useState<Topic[]>([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(defaultApiConfig);
  const [showSettings, setShowSettings] = useState(false);

  // Example templates for different scenarios
  const templates = [
    { id: "1", name: "职场破冰", icon: "🏢", description: "适合新团队或会议开始时" },
    { id: "2", name: "朋友聚会", icon: "🎉", description: "让聚会更有趣的话题" },
    { id: "3", name: "约会对话", icon: "💕", description: "增进了解的问题" },
    { id: "4", name: "家庭聚餐", icon: "🍲", description: "适合亲人间的交流" },
    { id: "5", name: "陌生人社交", icon: "👋", description: "与新朋友建立联系" },
    { id: "6", name: "深度交流", icon: "🧠", description: "更深入的思考话题" },
  ];

  const generateSystemPrompt = (scenario: string) => {
    return `
**角色**：你是一个专业的社交话题生成器，擅长创建适合${scenario}场景的对话话题。

**任务**：基于"${scenario}"场景，生成5个有趣且适合的对话话题，确保话题：
1. **有启发性**（能够引发思考和讨论）
2. **积极向上**（避免敏感、负面或争议性的话题）
3. **简洁明了**（每个话题不超过20字）
4. **多样化**（涵盖不同类型的话题，如经历、观点、假设等）

**输出格式**（严格遵循）：
仅输出话题列表，不要有额外的说明或介绍，每个话题占一行，格式如下：
话题1
话题2
话题3
话题4
话题5

**限制规则**：
- 不包含政治、宗教、争议性或敏感话题
- 不包含过于私人或侵犯隐私的问题
- 保持语言积极、友好、包容
- 适合在${scenario}场景中自然地开始对话
`;
  };

  const generateTopics = async (scenario: string) => {
    if (!apiConfig.apiKey) {
      toast.error("请先设置 API Key");
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const options = {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiConfig.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": apiConfig.model,
          "messages": [
            {
              "role": "system",
              "content": generateSystemPrompt(scenario)
            },
            {
              "role": "user",
              "content": `请为"${scenario}"场景生成适合的社交话题。`
            }
          ],
          "stream": false,
          "max_tokens": 512,
          "enable_thinking": false
        })
      };
      
      const response = await fetch(apiConfig.apiUrl, options);
      
      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Split content into individual topics
      const topicList = content.split('\n').filter((t: string) => t.trim().length > 0);
      
      const formattedTopics = topicList.map((topic: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        content: topic,
        category: scenario,
      }));
      
      setTopics(formattedTopics);
      toast.success("话题生成成功！");
    } catch (error) {
      console.error("生成话题出错:", error);
      toast.error("生成话题失败，请检查 API 配置或网络连接");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      generateTopics(keyword.trim());
    } else {
      toast.warning("请输入场景关键词");
    }
  };

  const handleTemplateClick = (template: { name: string }) => {
    generateTopics(template.name);
  };

  const toggleFavorite = (topic: Topic) => {
    const topicExists = favorites.some(fav => fav.id === topic.id);
    
    if (topicExists) {
      setFavorites(favorites.filter(fav => fav.id !== topic.id));
      toast("已从收藏夹移除", {
        description: topic.content.substring(0, 20) + (topic.content.length > 20 ? "..." : "")
      });
    } else {
      setFavorites([...favorites, topic]);
      toast("已添加到收藏夹", {
        description: topic.content.substring(0, 20) + (topic.content.length > 20 ? "..." : "")
      });
    }
  };

  const saveApiConfig = (config: ApiConfig) => {
    setApiConfig(config);
    setShowSettings(false);
    localStorage.setItem("topicGeneratorApiConfig", JSON.stringify(config));
    toast.success("API 设置已保存");
  };

  React.useEffect(() => {
    // Load API config from localStorage
    const savedConfig = localStorage.getItem("topicGeneratorApiConfig");
    if (savedConfig) {
      try {
        setApiConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("无法解析保存的 API 配置", e);
      }
    }
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("topicGeneratorFavorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("无法解析保存的收藏话题", e);
      }
    }
  }, []);
  
  React.useEffect(() => {
    // Save favorites to localStorage when they change
    if (favorites.length > 0) {
      localStorage.setItem("topicGeneratorFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  if (showSettings) {
    return (
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <ApiSettings 
          apiConfig={apiConfig} 
          onSave={saveApiConfig} 
          onCancel={() => setShowSettings(false)} 
        />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-6 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          社交话题生成器
        </h1>
        <p className="text-muted-foreground">
          快速生成有趣的社交话题，让对话更加流畅
        </p>
      </header>

      <Tabs defaultValue="keywords" className="mb-10">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keywords" className="flex items-center gap-1">
            <Search size={16} />
            <span>场景搜索</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <RefreshCw size={16} />
            <span>模板选择</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1">
            <Bookmark size={16} />
            <span>我的收藏</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleKeywordSubmit} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="输入场景关键词（如'约会'、'聚餐'）"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "生成中..." : "生成话题"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplateList templates={templates} onTemplateClick={handleTemplateClick} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <FavoriteTopics favorites={favorites} onRemove={toggleFavorite} />
        </TabsContent>
      </Tabs>

      {topics.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              生成的话题
              <Badge variant="outline" className="ml-2">
                {topics[0].category}
              </Badge>
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTopics([])}
              className="text-xs"
            >
              清空
            </Button>
          </div>

          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isFavorite={favorites.some(fav => fav.id === topic.id)}
                onToggleFavorite={() => toggleFavorite(topic)}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-10 text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSettings(true)}
        >
          API 设置
        </Button>
      </div>
    </div>
  );
};

export default TopicGenerator;
