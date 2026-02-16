"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-full focus:outline-none",
        dir: "rtl", // پیش‌فرض راست‌چین
      },
    },
    immediatelyRender: false, // جلوگیری از SSR hydration error
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded p-2">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "font-bold bg-gray-200 px-2 rounded" : "px-2 rounded"}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "italic bg-gray-200 px-2 rounded" : "italic px-2 rounded"}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "underline bg-gray-200 px-2 rounded" : "underline px-2 rounded"}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200 px-2 rounded" : "px-2 rounded"}
        >
          • لیست
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200 px-2 rounded" : "px-2 rounded"}
        >
          1. لیست
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          چپ‌چین
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          راست‌چین
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[150px]" />
    </div>
  );
}
