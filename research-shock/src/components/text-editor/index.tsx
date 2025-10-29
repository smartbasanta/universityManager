"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  value: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}
export default function RichTextEditor({
  value,
  onChange,
  editable,
}: RichTextEditorProps) {
  const isEditable = editable ?? true;

  const editor = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: isEditable
          ? "min-h-[350px] border rounded-md bg-gray-100 py-4 px-6"
          : "",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
