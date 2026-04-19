"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  ParsedStoryPlotterData,
  Plot,
  FolderTreeNode,
  Character,
  SequenceCard,
} from "@/types/storyplotter";
import { parseStoryPlotterExport, buildFolderTree } from "@/lib/parser";

const STORAGE_KEY = "storyplotter-viewer-data";

interface StoryContextType {
  data: ParsedStoryPlotterData | null;
  folderTree: FolderTreeNode | null;
  selectedFolder: string;
  selectedPlot: Plot | null;
  hasUnsavedChanges: boolean;
  isEditMode: boolean;
  loadData: (fileContent: string) => void;
  setSelectedFolder: (path: string) => void;
  setSelectedPlot: (plot: Plot | null) => void;
  clearData: () => void;
  // Edit functions
  setEditMode: (enabled: boolean) => void;
  updatePlot: (plotSort: number, updates: Partial<Plot>) => void;
  updateCharacter: (
    plotSort: number,
    charSort: number,
    updates: Partial<Character>
  ) => void;
  updateCharacterField: (
    plotSort: number,
    charSort: number,
    fieldKey: string,
    value: string
  ) => void;
  addCharacter: (plotSort: number) => void;
  deleteCharacter: (plotSort: number, charSort: number) => void;
  updateSequenceCard: (
    plotSort: number,
    category: string,
    cardSort: number,
    updates: Partial<SequenceCard>
  ) => void;
  addSequenceCard: (plotSort: number, category: string) => void;
  deleteSequenceCard: (
    plotSort: number,
    category: string,
    cardSort: number
  ) => void;
  updateSequenceUnit: (
    plotSort: number,
    category: string,
    updates: { title?: string; message?: string }
  ) => void;
  exportData: () => void;
  loadFromStorage: () => boolean;
  clearStorage: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ParsedStoryPlotterData | null>(null);
  const [folderTree, setFolderTree] = useState<FolderTreeNode | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditMode, setEditMode] = useState(false);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (data && hasUnsavedChanges) {
      const exportFormat = {
        memoList: JSON.stringify(data.memoList),
        tagColorMap: JSON.stringify(data.tagColorMap),
        plotList: JSON.stringify(data.plotList),
        allFolderList: JSON.stringify(data.allFolderList),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exportFormat));
    }
  }, [data, hasUnsavedChanges]);

  // Load from localStorage on mount
  const loadFromStorage = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const raw = JSON.parse(stored);
        const parsed = parseStoryPlotterExport(raw);
        setData(parsed);
        setFolderTree(buildFolderTree(parsed.allFolderList));
        setSelectedFolder("");
        setSelectedPlot(null);
        return true;
      }
    } catch (error) {
      console.error("Failed to load from storage:", error);
    }
    return false;
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasUnsavedChanges(false);
  }, []);

  const loadData = useCallback((fileContent: string) => {
    try {
      const raw = JSON.parse(fileContent);
      const parsed = parseStoryPlotterExport(raw);
      setData(parsed);
      setFolderTree(buildFolderTree(parsed.allFolderList));
      setSelectedFolder("");
      setSelectedPlot(null);
      setHasUnsavedChanges(false);
      // Save to storage immediately
      localStorage.setItem(STORAGE_KEY, fileContent);
    } catch (error) {
      console.error("Failed to parse file:", error);
      alert(
        "Failed to parse the Story Plotter export file. Please make sure it's a valid export."
      );
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setFolderTree(null);
    setSelectedFolder("");
    setSelectedPlot(null);
    setHasUnsavedChanges(false);
    setEditMode(false);
  }, []);

  // Update a plot
  const updatePlot = useCallback(
    (plotSort: number, updates: Partial<Plot>) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const updated = { ...plot, ...updates, updateTime: Date.now() };
            // Also update selectedPlot if it's the same one
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Update a character
  const updateCharacter = useCallback(
    (plotSort: number, charSort: number, updates: Partial<Character>) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const newCharList = plot.charList.map((char) => {
              if (char.sort === charSort) {
                return { ...char, ...updates };
              }
              return char;
            });
            const updated = {
              ...plot,
              charList: newCharList,
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Update a specific character field
  const updateCharacterField = useCallback(
    (plotSort: number, charSort: number, fieldKey: string, value: string) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const newCharList = plot.charList.map((char) => {
              if (char.sort === charSort) {
                const newCharParam = { ...char.charParam };
                if (newCharParam[fieldKey]) {
                  newCharParam[fieldKey] = {
                    ...newCharParam[fieldKey],
                    value,
                  };
                } else {
                  // Create new field
                  newCharParam[fieldKey] = {
                    name: "",
                    value,
                    isSilent: false,
                    sort: Date.now(),
                    category: "",
                  };
                }
                return { ...char, charParam: newCharParam };
              }
              return char;
            });
            const updated = {
              ...plot,
              charList: newCharList,
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Add a new character
  const addCharacter = useCallback(
    (plotSort: number) => {
      if (!data) return;

      const newChar: Character = {
        sort: Date.now(),
        color: null,
        priority: "",
        charParam: {
          char_name: {
            name: "",
            value: "New Character",
            isSilent: false,
            sort: 100000000,
            category: "",
          },
          char_memo: {
            name: "",
            value: "",
            isSilent: false,
            sort: 200000000,
            category: "",
          },
          "sequence_-1_x": {
            name: "",
            value: "1",
            isSilent: false,
            sort: -1,
            category: "",
          },
          "sequence_-1_y": {
            name: "",
            value: "1",
            isSilent: false,
            sort: -1,
            category: "",
          },
        },
        categoryList: [],
        tagList: "[]",
        folderpath: "",
      };

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const updated = {
              ...plot,
              charList: [...plot.charList, newChar],
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Delete a character
  const deleteCharacter = useCallback(
    (plotSort: number, charSort: number) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const updated = {
              ...plot,
              charList: plot.charList.filter((c) => c.sort !== charSort),
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Update a sequence card
  const updateSequenceCard = useCallback(
    (
      plotSort: number,
      category: string,
      cardSort: number,
      updates: Partial<SequenceCard>
    ) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const newSequenceUnitList = plot.sequenceUnitList.map((unit) => {
              if (unit.category === category) {
                const newCardList = unit.sequenceCardList.map((card) => {
                  if (card.sort === cardSort) {
                    return { ...card, ...updates };
                  }
                  return card;
                });
                return { ...unit, sequenceCardList: newCardList };
              }
              return unit;
            });
            const updated = {
              ...plot,
              sequenceUnitList: newSequenceUnitList,
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Add a sequence card
  const addSequenceCard = useCallback(
    (plotSort: number, category: string) => {
      if (!data) return;

      const newCard: SequenceCard = {
        idea: "",
        description: "",
        place: "",
        timezone: "",
        memo: "",
        color: null,
        weather: "",
        cliffHanger: "",
        relationIndexList: "[]",
        areaMapIndexList: "[]",
        imageList: "[]",
        relateAreaIndexList: "[]",
        sort: Date.now(),
        sceneCardList: [],
        isTextExpand: true,
      };

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const newSequenceUnitList = plot.sequenceUnitList.map((unit) => {
              if (unit.category === category) {
                return {
                  ...unit,
                  sequenceCardList: [...unit.sequenceCardList, newCard],
                  isEdited: 1,
                };
              }
              return unit;
            });
            const updated = {
              ...plot,
              sequenceUnitList: newSequenceUnitList,
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Delete a sequence card
  const deleteSequenceCard = useCallback(
    (plotSort: number, category: string, cardSort: number) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const newSequenceUnitList = plot.sequenceUnitList.map((unit) => {
              if (unit.category === category) {
                return {
                  ...unit,
                  sequenceCardList: unit.sequenceCardList.filter(
                    (c) => c.sort !== cardSort
                  ),
                };
              }
              return unit;
            });
            const updated = {
              ...plot,
              sequenceUnitList: newSequenceUnitList,
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Update sequence unit (title/message)
  const updateSequenceUnit = useCallback(
    (
      plotSort: number,
      category: string,
      updates: { title?: string; message?: string }
    ) => {
      if (!data) return;

      setData((prev) => {
        if (!prev) return prev;
        const newPlotList = prev.plotList.map((plot) => {
          if (plot.sort === plotSort) {
            const newSequenceUnitList = plot.sequenceUnitList.map((unit) => {
              if (unit.category === category) {
                return { ...unit, ...updates, isEdited: 1 };
              }
              return unit;
            });
            const updated = {
              ...plot,
              sequenceUnitList: newSequenceUnitList,
              updateTime: Date.now(),
            };
            if (selectedPlot?.sort === plotSort) {
              setSelectedPlot(updated);
            }
            return updated;
          }
          return plot;
        });
        return { ...prev, plotList: newPlotList };
      });
      setHasUnsavedChanges(true);
    },
    [data, selectedPlot]
  );

  // Export data as downloadable file
  const exportData = useCallback(() => {
    if (!data) return;

    const exportFormat = {
      memoList: JSON.stringify(data.memoList),
      tagColorMap: JSON.stringify(data.tagColorMap),
      plotList: JSON.stringify(data.plotList),
      allFolderList: JSON.stringify(data.allFolderList),
    };

    const jsonString = JSON.stringify(exportFormat);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateStr = now
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .replace(/,/g, "")
      .replace(/ /g, "_");

    const link = document.createElement("a");
    link.href = url;
    link.download = `StoryPlotter_BackUp_${dateStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setHasUnsavedChanges(false);
  }, [data]);

  return (
    <StoryContext.Provider
      value={{
        data,
        folderTree,
        selectedFolder,
        selectedPlot,
        hasUnsavedChanges,
        isEditMode,
        loadData,
        setSelectedFolder,
        setSelectedPlot,
        clearData,
        setEditMode,
        updatePlot,
        updateCharacter,
        updateCharacterField,
        addCharacter,
        deleteCharacter,
        updateSequenceCard,
        addSequenceCard,
        deleteSequenceCard,
        updateSequenceUnit,
        exportData,
        loadFromStorage,
        clearStorage,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
