import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface CustomTabProps {
  defaultValue?: string;
  tabs: TabItem[];
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  orientation?: "horizontal" | "vertical";
}

export const CustomTab = ({
  defaultValue,
  tabs,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  orientation = "horizontal",
}: CustomTabProps) => {
  if (!tabs.length) return null;

  const firstTabValue = tabs[0].value;

  return (
    <Tabs
      defaultValue={defaultValue || firstTabValue}
      className={className}
      orientation={orientation}
    >
      <TabsList className={tabsListClassName}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(tabsTriggerClassName)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={tabsContentClassName}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
