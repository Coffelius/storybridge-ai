"use client";

import { useStory } from "@/context/StoryContext";
import FileUpload from "@/components/FileUpload";
import FolderTree from "@/components/FolderTree";
import PlotList from "@/components/PlotList";
import PlotDetail from "@/components/PlotDetail";

export default function Home() {
  const { data, selectedPlot } = useStory();

  if (!data) {
    return <FileUpload />;
  }

  return (
    <div className="flex flex-col h-screen">
      <FileUpload />
      <div className="flex flex-1 overflow-hidden">
        <FolderTree />
        {selectedPlot ? <PlotDetail /> : <PlotList />}
      </div>
    </div>
  );
}
