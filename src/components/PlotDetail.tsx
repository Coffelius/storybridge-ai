"use client";

import { useStory } from "@/context/StoryContext";
import { parseTags, SequenceUnit } from "@/types/storyplotter";
import {
  formatTimestamp,
  getWritingStatusColor,
  getWritingStatusLabel,
} from "@/lib/parser";
import CharacterCard from "./CharacterCard";
import { useState } from "react";

const SEQUENCE_LABELS: Record<string, string> = {
  opening: "Opening",
  mainStory: "Main Story",
  finale: "Finale",
};

const WRITING_STATUSES = ["unwritten", "writing", "written"] as const;

interface SequenceSectionProps {
  sequence: SequenceUnit;
  plotSort: number;
}

function SequenceSection({ sequence, plotSort }: SequenceSectionProps) {
  const {
    isEditMode,
    updateSequenceCard,
    addSequenceCard,
    deleteSequenceCard,
    updateSequenceUnit,
  } = useStory();
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  const hasContent =
    sequence.sequenceCardList.length > 0 || sequence.title || sequence.message;

  // In edit mode, always show the section
  if (!hasContent && !isEditMode) return null;

  const handleAddCard = () => {
    addSequenceCard(plotSort, sequence.category);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        onClick={() => !editingTitle && setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="font-medium text-gray-700">
            {SEQUENCE_LABELS[sequence.category] || sequence.category}
          </span>
          {isEditMode && editingTitle ? (
            <input
              type="text"
              value={sequence.title}
              onChange={(e) =>
                updateSequenceUnit(plotSort, sequence.category, {
                  title: e.target.value,
                })
              }
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 px-2 py-1 text-sm border rounded"
              placeholder="Section title..."
              autoFocus
            />
          ) : (
            <>
              {sequence.title && (
                <span
                  className={`text-gray-500 ${isEditMode ? "cursor-text hover:bg-gray-200 px-1 rounded" : ""}`}
                  onClick={(e) => {
                    if (isEditMode) {
                      e.stopPropagation();
                      setEditingTitle(true);
                    }
                  }}
                >
                  - {sequence.title}
                </span>
              )}
              {isEditMode && !sequence.title && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTitle(true);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  + Add title
                </button>
              )}
            </>
          )}
          <span className="text-xs text-gray-400">
            ({sequence.sequenceCardList.length} card
            {sequence.sequenceCardList.length !== 1 ? "s" : ""})
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {sequence.message && !isEditMode && (
            <p className="text-sm text-gray-600 italic">{sequence.message}</p>
          )}
          {isEditMode && (
            <textarea
              value={sequence.message}
              onChange={(e) =>
                updateSequenceUnit(plotSort, sequence.category, {
                  message: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
              placeholder="Section description/notes..."
              rows={2}
            />
          )}

          {sequence.sequenceCardList.map((card, index) => (
            <div
              key={card.sort || index}
              className="p-4 bg-white border border-gray-100 rounded-lg relative group"
            >
              {isEditMode && editingCardIndex === index ? (
                <div className="space-y-3">
                  <textarea
                    value={card.idea}
                    onChange={(e) =>
                      updateSequenceCard(plotSort, sequence.category, card.sort, {
                        idea: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    placeholder="Main idea/content..."
                    rows={6}
                    autoFocus
                  />
                  <input
                    type="text"
                    value={card.description}
                    onChange={(e) =>
                      updateSequenceCard(plotSort, sequence.category, card.sort, {
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                    placeholder="Description..."
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={card.place}
                      onChange={(e) =>
                        updateSequenceCard(plotSort, sequence.category, card.sort, {
                          place: e.target.value,
                        })
                      }
                      className="px-3 py-2 text-sm border rounded-lg"
                      placeholder="Place..."
                    />
                    <input
                      type="text"
                      value={card.weather}
                      onChange={(e) =>
                        updateSequenceCard(plotSort, sequence.category, card.sort, {
                          weather: e.target.value,
                        })
                      }
                      className="px-3 py-2 text-sm border rounded-lg"
                      placeholder="Weather..."
                    />
                    <input
                      type="text"
                      value={card.timezone}
                      onChange={(e) =>
                        updateSequenceCard(plotSort, sequence.category, card.sort, {
                          timezone: e.target.value,
                        })
                      }
                      className="px-3 py-2 text-sm border rounded-lg"
                      placeholder="Time..."
                    />
                  </div>
                  <textarea
                    value={card.memo}
                    onChange={(e) =>
                      updateSequenceCard(plotSort, sequence.category, card.sort, {
                        memo: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
                    placeholder="Notes/memo..."
                    rows={2}
                  />
                  <button
                    onClick={() => setEditingCardIndex(null)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {isEditMode && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => setEditingCardIndex(index)}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this card?")) {
                            deleteSequenceCard(plotSort, sequence.category, card.sort);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {card.idea && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{card.idea}</p>
                    </div>
                  )}
                  {card.description && (
                    <p className="text-sm text-gray-500 mt-2">{card.description}</p>
                  )}
                  {(card.place || card.weather || card.timezone) && (
                    <div className="flex gap-4 mt-3 text-xs text-gray-400">
                      {card.place && <span>Place: {card.place}</span>}
                      {card.weather && <span>Weather: {card.weather}</span>}
                      {card.timezone && <span>Time: {card.timezone}</span>}
                    </div>
                  )}
                  {card.memo && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                      Note: {card.memo}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {isEditMode && (
            <button
              onClick={handleAddCard}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Card
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlotDetail() {
  const {
    selectedPlot,
    setSelectedPlot,
    isEditMode,
    updatePlot,
    addCharacter,
  } = useStory();
  const [activeTab, setActiveTab] = useState<"story" | "characters">("story");
  const [editingHeader, setEditingHeader] = useState(false);

  if (!selectedPlot) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>Select a story to view details</p>
        </div>
      </div>
    );
  }

  const tags = parseTags(selectedPlot.tagList);
  const statusColor = getWritingStatusColor(selectedPlot.writingstatus);

  const handleAddCharacter = () => {
    addCharacter(selectedPlot.sort);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            {isEditMode && editingHeader ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={selectedPlot.title}
                  onChange={(e) =>
                    updatePlot(selectedPlot.sort, { title: e.target.value })
                  }
                  className="w-full text-2xl font-bold px-2 py-1 border rounded"
                  placeholder="Title..."
                />
                <input
                  type="text"
                  value={selectedPlot.subtitle}
                  onChange={(e) =>
                    updatePlot(selectedPlot.sort, { subtitle: e.target.value })
                  }
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Subtitle..."
                />
                <button
                  onClick={() => setEditingHeader(false)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Done
                </button>
              </div>
            ) : (
              <div
                className={isEditMode ? "cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded" : ""}
                onClick={() => isEditMode && setEditingHeader(true)}
              >
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedPlot.title}
                  {isEditMode && (
                    <svg className="w-4 h-4 inline-block ml-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </h1>
                {selectedPlot.subtitle && (
                  <p className="text-gray-600">{selectedPlot.subtitle}</p>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedPlot(null)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          {isEditMode ? (
            <select
              value={selectedPlot.writingstatus}
              onChange={(e) =>
                updatePlot(selectedPlot.sort, {
                  writingstatus: e.target.value as "unwritten" | "writing" | "written",
                })
              }
              className="px-3 py-1 rounded-full font-medium border bg-white"
            >
              {WRITING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {getWritingStatusLabel(status)}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`px-3 py-1 rounded-full font-medium ${statusColor.bg} ${statusColor.text}`}
            >
              {getWritingStatusLabel(selectedPlot.writingstatus)}
            </span>
          )}

          {selectedPlot.folderPath && (
            <span className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              {selectedPlot.folderPath}
            </span>
          )}

          <span className="text-gray-400">
            Updated {formatTimestamp(selectedPlot.updateTime)}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("story")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "story"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Story ({selectedPlot.sequenceUnitList.filter(s => s.sequenceCardList.length > 0 || s.title || s.message).length})
        </button>
        <button
          onClick={() => setActiveTab("characters")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "characters"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Characters ({selectedPlot.charList.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === "story" ? (
          <div className="space-y-4">
            {selectedPlot.sequenceUnitList.map((sequence) => (
              <SequenceSection
                key={sequence.category}
                sequence={sequence}
                plotSort={selectedPlot.sort}
              />
            ))}
          </div>
        ) : (
          <>
            {selectedPlot.charList.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {selectedPlot.charList.map((char) => (
                  <CharacterCard
                    key={char.sort}
                    character={char}
                    plotSort={selectedPlot.sort}
                  />
                ))}
              </div>
            ) : !isEditMode ? (
              <div className="text-center py-12 text-gray-500">
                <p>No characters yet</p>
              </div>
            ) : null}

            {isEditMode && (
              <button
                onClick={handleAddCharacter}
                className={`w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 ${
                  selectedPlot.charList.length > 0 ? "mt-4" : ""
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Character
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
