
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface TemplateListProps {
  templates: Template[];
  onTemplateClick: (template: Template) => void;
  isLoading: boolean;
}

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onTemplateClick,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "template-card cursor-pointer border border-muted",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !isLoading && onTemplateClick(template)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="text-2xl">{template.icon}</div>
            <div>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateList;
