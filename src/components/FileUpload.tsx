"use client";

import { useStory } from "@/context/StoryContext";
import { useCallback, useEffect, useState } from "react";

export default function FileUpload() {
  const {
    loadData,
    data,
    clearData,
    isEditMode,
    setEditMode,
    hasUnsavedChanges,
    exportData,
    loadFromStorage,
    clearStorage,
  } = useStory();

  const [hasStoredData, setHasStoredData] = useState(false);

  // Check for stored data on mount
  useEffect(() => {
    if (!data) {
      const hasStored = localStorage.getItem("storyplotter-viewer-data");
      setHasStoredData(!!hasStored);
    }
  }, [data]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        loadData(content);
      };
      reader.readAsText(file);
    },
    [loadData]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        loadData(content);
      };
      reader.readAsText(file);
    },
    [loadData]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleLoadFromStorage = () => {
    if (loadFromStorage()) {
      setHasStoredData(false);
    }
  };

  const handleClearAndLoad = () => {
    if (
      hasUnsavedChanges &&
      !confirm("You have unsaved changes. Are you sure you want to load a different file?")
    ) {
      return;
    }
    clearData();
    clearStorage();
  };

  if (data) {
    return (
      <div className="flex items-center justify-between gap-4 p-3 bg-white border-b">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {data.plotList.length} plots in {data.allFolderList.length} folders
          </span>
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => setEditMode(!isEditMode)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
              isEditMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {isEditMode ? "Editing" : "Edit"}
          </button>

          {/* Export Button */}
          <button
            onClick={exportData}
            className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>

          {/* Load Different File */}
          <button
            onClick={handleClearAndLoad}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Load Different File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="p-12 border-2 border-dashed border-gray-300 rounded-xl bg-white text-center hover:border-blue-400 transition-colors"
        >
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Story Plotter Viewer & Editor
          </h2>
          <p className="text-gray-500 mb-6">
            Drop your Story Plotter export file here or click to browse
          </p>
          <label className="inline-block">
            <span className="px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors font-medium">
              Select File
            </span>
            <input
              type="file"
              accept=".txt,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-4">
            Supports .txt and .json export files from Story Plotter
          </p>
        </div>

        {/* Resume from storage */}
        {hasStoredData && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Previous session found
                </p>
                <p className="text-xs text-blue-600">
                  You have data from a previous editing session
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleLoadFromStorage}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                >
                  Resume
                </button>
                <button
                  onClick={() => {
                    clearStorage();
                    setHasStoredData(false);
                  }}
                  className="px-4 py-2 bg-white text-gray-600 text-sm rounded-md border hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
