"use client";

import { useStory } from "@/context/StoryContext";
import { Character, getCharacterName, getCharacterField } from "@/types/storyplotter";
import { useState } from "react";

interface CharacterCardProps {
  character: Character;
  plotSort: number;
}

// Map of known field keys to display labels
const FIELD_LABELS: Record<string, string> = {
  char_name: "Name",
  char_memo: "Description",
  char_position: "Position/Role",
  char_sex: "Sex/Gender",
  char_age: "Age",
  char_call_me: "Pronouns",
  char_call: "Nicknames",
  char_personality: "Personality",
  char_habit: "Habits",
  char_habit_why: "Habit Reason",
  char_appearance: "Appearance",
  char_background: "Background",
};

// Common fields to show in edit mode
const EDITABLE_FIELDS = [
  "char_name",
  "char_memo",
  "char_sex",
  "char_age",
  "char_call_me",
  "char_call",
  "char_position",
  "char_personality",
  "char_habit",
  "char_habit_why",
  "char_appearance",
  "char_background",
];

// Fields to skip in display
const SKIP_FIELDS = ["sequence_-1_x", "sequence_-1_y"];

// Priority options
const PRIORITY_OPTIONS = ["", "Main", "Supporting", "Minor", "Background"];

export default function CharacterCard({ character, plotSort }: CharacterCardProps) {
  const { isEditMode, updateCharacterField, updateCharacter, deleteCharacter } = useStory();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const name = getCharacterName(character);
  const memo = getCharacterField(character, "char_memo");

  // Get all displayable fields
  const fields = Object.entries(character.charParam || {})
    .filter(([key]) => !SKIP_FIELDS.includes(key) && key !== "char_name")
    .map(([key, param]) => ({
      key,
      label: FIELD_LABELS[key] || key.replace("char_", "").replace(/_/g, " "),
      value: param.value,
    }))
    .filter((f) => f.value && f.value.trim());

  const hasExpandedContent = fields.length > 1 || (memo && memo.length > 150);

  const handleDelete = () => {
    if (confirm(`Delete character "${name}"?`)) {
      deleteCharacter(plotSort, character.sort);
    }
  };

  if (isEditMode && isEditing) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-800">Edit Character</h4>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Priority
            </label>
            <select
              value={character.priority}
              onChange={(e) =>
                updateCharacter(plotSort, character.sort, { priority: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p || "None"}
                </option>
              ))}
            </select>
          </div>

          {/* Editable fields */}
          {EDITABLE_FIELDS.map((fieldKey) => {
            const label = FIELD_LABELS[fieldKey] || fieldKey.replace("char_", "").replace(/_/g, " ");
            const value = getCharacterField(character, fieldKey) || "";
            const isTextarea = ["char_memo", "char_personality", "char_habit", "char_background", "char_appearance"].includes(fieldKey);

            return (
              <div key={fieldKey}>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {label}
                </label>
                {isTextarea ? (
                  <textarea
                    value={value}
                    onChange={(e) =>
                      updateCharacterField(plotSort, character.sort, fieldKey, e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none"
                    rows={3}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      updateCharacterField(plotSort, character.sort, fieldKey, e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                )}
              </div>
            );
          })}

          <button
            onClick={() => setIsEditing(false)}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group relative">
      {isEditMode && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 p-1.5 bg-white border rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-500 z-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-800 truncate">{name}</h4>
              {character.priority && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {character.priority}
                </span>
              )}
            </div>
            {memo && (
              <p
                className={`text-sm text-gray-600 ${
                  isExpanded ? "" : "line-clamp-2"
                }`}
              >
                {memo}
              </p>
            )}
          </div>
          {hasExpandedContent && (
            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <svg
                className={`w-5 h-5 transition-transform ${
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
            </button>
          )}
        </div>
      </div>

      {isExpanded && fields.length > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          {fields.map(
            (field) =>
              field.key !== "char_memo" && (
                <div key={field.key}>
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {field.label}
                  </dt>
                  <dd className="text-sm text-gray-700 whitespace-pre-wrap">
                    {field.value}
                  </dd>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
