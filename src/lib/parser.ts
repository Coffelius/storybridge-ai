import {
  StoryPlotterExport,
  ParsedStoryPlotterData,
  Plot,
  Folder,
  FolderTreeNode,
} from "@/types/storyplotter";

export function parseStoryPlotterExport(
  raw: StoryPlotterExport
): ParsedStoryPlotterData {
  return {
    memoList: JSON.parse(raw.memoList || "[]"),
    tagColorMap: JSON.parse(raw.tagColorMap || "{}"),
    plotList: JSON.parse(raw.plotList || "[]") as Plot[],
    allFolderList: JSON.parse(raw.allFolderList || "[]") as Folder[],
  };
}

export function buildFolderTree(folders: Folder[]): FolderTreeNode {
  const root: FolderTreeNode = {
    name: "All Stories",
    path: "",
    children: [],
  };

  // Sort folders by path depth and then alphabetically
  const sortedFolders = [...folders].sort((a, b) => {
    const depthA = a.path.split("/").length;
    const depthB = b.path.split("/").length;
    if (depthA !== depthB) return depthA - depthB;
    return a.path.localeCompare(b.path);
  });

  for (const folder of sortedFolders) {
    const parts = folder.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const currentPath = parts.slice(0, i + 1).join("/");
      let child = current.children.find((c) => c.name === part);

      if (!child) {
        child = {
          name: part,
          path: currentPath,
          children: [],
        };
        current.children.push(child);
      }

      if (i === parts.length - 1) {
        child.folder = folder;
      }

      current = child;
    }
  }

  return root;
}

export function getPlotsInFolder(plots: Plot[], folderPath: string): Plot[] {
  if (folderPath === "") {
    return plots;
  }
  return plots.filter(
    (plot) =>
      plot.folderPath === folderPath ||
      plot.folderPath.startsWith(folderPath + "/")
  );
}

export function getPlotsDirectlyInFolder(
  plots: Plot[],
  folderPath: string
): Plot[] {
  if (folderPath === "") {
    // Root: show plots with no folder or empty folder path
    return plots.filter(
      (plot) => !plot.folderPath || plot.folderPath.trim() === ""
    );
  }
  return plots.filter((plot) => plot.folderPath === folderPath);
}

export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getWritingStatusColor(
  status: string
): { bg: string; text: string } {
  switch (status) {
    case "writing":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "written":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "unwritten":
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

export function getWritingStatusLabel(status: string): string {
  switch (status) {
    case "writing":
      return "In Progress";
    case "written":
      return "Completed";
    case "unwritten":
    default:
      return "Not Started";
  }
}
