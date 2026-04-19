"use client";

import { useStory } from "@/context/StoryContext";
import { FolderTreeNode } from "@/types/storyplotter";
import { useState } from "react";

interface FolderNodeProps {
  node: FolderTreeNode;
  depth: number;
}

function FolderNode({ node, depth }: FolderNodeProps) {
  const { selectedFolder, setSelectedFolder, setSelectedPlot, data } = useStory();
  const [isExpanded, setIsExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedFolder === node.path;

  // Count plots in this folder
  const plotCount = data?.plotList.filter(
    (p) => p.folderPath === node.path
  ).length || 0;

  const handleClick = () => {
    setSelectedFolder(node.path);
    setSelectedPlot(null);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-colors ${
          isSelected
            ? "bg-blue-100 text-blue-800"
            : "hover:bg-gray-100 text-gray-700"
        }`}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={toggleExpand}
            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <span className="w-5" />
        )}
        <svg
          className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
        <span className="flex-1 text-sm font-medium truncate">{node.name}</span>
        {plotCount > 0 && (
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {plotCount}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((child) => (
              <FolderNode key={child.path} node={child} depth={depth + 1} />
            ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree() {
  const { folderTree, selectedFolder, setSelectedFolder, setSelectedPlot, data } = useStory();

  if (!folderTree) return null;

  const handleAllClick = () => {
    setSelectedFolder("");
    setSelectedPlot(null);
  };

  const isAllSelected = selectedFolder === "";

  return (
    <div className="w-64 bg-white border-r h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-800">Folders</h2>
      </div>
      <div className="py-2">
        {/* All Stories option */}
        <div
          onClick={handleAllClick}
          className={`flex items-center gap-2 px-3 py-2 mx-2 cursor-pointer rounded-md transition-colors ${
            isAllSelected
              ? "bg-blue-100 text-blue-800"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <span className="w-5" />
          <svg
            className={`w-5 h-5 ${isAllSelected ? "text-blue-600" : "text-gray-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="flex-1 text-sm font-medium">All Stories</span>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {data?.plotList.length || 0}
          </span>
        </div>

        {/* Folder tree */}
        {folderTree.children.map((child) => (
          <FolderNode key={child.path} node={child} depth={0} />
        ))}
      </div>
    </div>
  );
}
