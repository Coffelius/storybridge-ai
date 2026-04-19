"use client";

import { useStory } from "@/context/StoryContext";
import { Plot, parseTags } from "@/types/storyplotter";
import {
  getPlotsInFolder,
  formatTimestamp,
  getWritingStatusColor,
  getWritingStatusLabel,
} from "@/lib/parser";

interface PlotCardProps {
  plot: Plot;
}

function PlotCard({ plot }: PlotCardProps) {
  const { selectedPlot, setSelectedPlot } = useStory();
  const isSelected = selectedPlot?.sort === plot.sort;
  const statusColor = getWritingStatusColor(plot.writingstatus);
  const tags = parseTags(plot.tagList);

  return (
    <div
      onClick={() => setSelectedPlot(plot)}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-blue-400 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{plot.title}</h3>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${statusColor.bg} ${statusColor.text}`}
        >
          {getWritingStatusLabel(plot.writingstatus)}
        </span>
      </div>

      {plot.subtitle && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{plot.subtitle}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        {plot.folderPath && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            {plot.folderPath}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {plot.charList.length} character{plot.charList.length !== 1 ? "s" : ""}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 4).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{tags.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-gray-400">
        Updated {formatTimestamp(plot.updateTime)}
      </div>
    </div>
  );
}

export default function PlotList() {
  const { data, selectedFolder } = useStory();

  if (!data) return null;

  const plots = getPlotsInFolder(data.plotList, selectedFolder);

  // Sort plots by update time (most recent first)
  const sortedPlots = [...plots].sort((a, b) => b.updateTime - a.updateTime);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedFolder || "All Stories"}
        </h2>
        <p className="text-sm text-gray-500">
          {plots.length} {plots.length === 1 ? "story" : "stories"}
        </p>
      </div>

      {plots.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p>No stories in this folder</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {sortedPlots.map((plot) => (
            <PlotCard key={plot.sort} plot={plot} />
          ))}
        </div>
      )}
    </div>
  );
}
