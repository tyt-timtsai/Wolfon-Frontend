import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import MenuBar from './MenuBar';
import './tiptap.css';

function TipTap({ setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    content: `
      <h2>
        Hi there,
      </h2>
      <p>
        this is a <em>basic</em> example of <strong>How to create a post</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
      </p>
      <ul>
        <li>
          That’s a bullet list with one …
        </li>
        <li>
          … or two list items.
        </li>
      </ul>
      <p>
        Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
      </p>
      <pre><code class="language-js">body {
  display: none;
}</code></pre>
      <p>
        I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other features too.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work! 👏
        <br />
        — Wolfon
      </blockquote>
    `,
    // eslint-disable-next-line no-shadow
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // eslint-disable-next-line quote-props, no-useless-computed-key
      setContent(html);
    },
  });

  return (
    <div className="tiptap-editor">
      <MenuBar editor={editor} />
      <div id="editor-field">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TipTap;
