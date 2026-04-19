// Story Plotter Export File Types

export interface CharParam {
  name: string;
  value: string;
  isSilent: boolean;
  sort: number;
  category: string;
}

export interface Character {
  sort: number;
  color: number | null;
  priority: string;
  charParam: Record<string, CharParam>;
  categoryList: unknown[];
  tagList: string; // JSON stringified array
  folderpath: string;
}

export interface SequenceCard {
  idea: string;
  description: string;
  place: string;
  timezone: string;
  memo: string;
  color: number | null;
  weather: string;
  cliffHanger: string;
  relationIndexList: string; // JSON stringified array
  areaMapIndexList: string; // JSON stringified array
  imageList: string; // JSON stringified array
  relateAreaIndexList: string; // JSON stringified array
  sort: number;
  sceneCardList: unknown[];
  isTextExpand: boolean;
}

export interface SequenceUnit {
  category: "opening" | "mainStory" | "finale";
  sort: number;
  sequenceCardList: SequenceCard[];
  title: string;
  message: string;
  isEdited: number;
  isSilent: boolean;
  isTextExpand: boolean;
}

export interface Plot {
  title: string;
  plotType: string;
  zoomLevel: string;
  folderPath: string;
  subtitle: string;
  writingstatus: "unwritten" | "writing" | "written";
  color: number | null;
  tagList: string; // JSON stringified array
  sequenceUnitList: SequenceUnit[];
  world: { params: Record<string, unknown>; category: unknown[] };
  logline: { params: Record<string, unknown>; category: unknown[] };
  charList: Character[];
  relationShipList: unknown[];
  relationShipMapDetailList: unknown[];
  rootFamilyList: unknown[];
  tipFamilyList: unknown[];
  arrowTagColorList: unknown[];
  groupRelationList: unknown[];
  groupRelationArrowList: unknown[];
  eraList: unknown[];
  eraEventList: unknown[];
  eraEventGroupList: unknown[];
  charFolderList: unknown[];
  areaList: unknown[];
  areaElementList: unknown[];
  areaMapRelationList: unknown[];
  areaMapDetailList: unknown[];
  sort: number;
  updateTime: number;
  sortByUser: number;
  pinnedSort: number | null;
  defaultTemplateCharacterIndex: number;
  defaultTemplateAreaCountryIndex: number;
  defaultTemplateAreaCityIndex: number;
  defaultTemplateAreaCommonIndex: number;
}

export interface Folder {
  type: string;
  path: string;
  sort: number;
  createtime: number;
  color: number | null;
  iconImagePath: string;
  iconType: string;
  taglist: string; // JSON stringified array
}

export interface StoryPlotterExport {
  memoList: string; // JSON stringified array
  tagColorMap: string; // JSON stringified object
  plotList: string; // JSON stringified array of Plot
  allFolderList: string; // JSON stringified array of Folder
}

// Parsed versions (after JSON parsing nested strings)
export interface ParsedStoryPlotterData {
  memoList: unknown[];
  tagColorMap: Record<string, unknown>;
  plotList: Plot[];
  allFolderList: Folder[];
}

// Helper type for folder tree
export interface FolderTreeNode {
  name: string;
  path: string;
  children: FolderTreeNode[];
  folder?: Folder;
}

// Helper to get character name
export function getCharacterName(char: Character): string {
  return char.charParam?.char_name?.value || "Unnamed Character";
}

// Helper to get character memo
export function getCharacterMemo(char: Character): string {
  return char.charParam?.char_memo?.value || "";
}

// Helper to get character field
export function getCharacterField(
  char: Character,
  field: string
): string | undefined {
  return char.charParam?.[field]?.value;
}

// Helper to parse tags
export function parseTags(tagList: string): string[] {
  try {
    return JSON.parse(tagList);
  } catch {
    return [];
  }
}
