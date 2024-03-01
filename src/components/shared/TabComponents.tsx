import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabsComponentProps = {
    tabsListTitles: string[];
    tabsContentList: React.ReactElement[];
}

export const TabsComponent = ({tabsListTitles, tabsContentList} : TabsComponentProps) => {
  return (
    <Tabs defaultValue={tabsListTitles[0]} className="w-full">
      <TabsList className="profile-tab justify-center w-full gap-6">
        {tabsListTitles.map((item) => (
            <TabsTrigger key={item} value={item} className="text-xl px-4 data-[state=active]:text-primary-500">{item}</TabsTrigger>
        ))}
      </TabsList>

      
        {tabsContentList.map((item, ind) => (
            <TabsContent key={ind} value={tabsListTitles[ind]}>
                {item}
            </TabsContent>
        ))}
      
    </Tabs>
  );
};
