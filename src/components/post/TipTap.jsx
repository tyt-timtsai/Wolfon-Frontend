/* eslint-disable no-shadow */
import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import axios from 'axios';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Swal from 'sweetalert2';
import MenuBar from './MenuBar';
import './tiptap.css';
import constants from '../../global/constants';

function TipTap({
  content, setContent, setPost, setIsEdit, setPostId,
}) {
  const params = useParams();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || `
    <h2>
      Welcome to Wolfon Post Editor,
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
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  const setLink = useCallback(async () => {
    const previousUrl = editor.getAttributes('link').href;

    const url = await Swal.fire({
      title: 'Set Link',
      input: 'text',
      inputValue: previousUrl || null,
      inputAttributes: {
        autocapitalize: 'off',
        style: { color: '#000 !important' },
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        Swal.fire('Add Link!', '', 'success');
        return result.value;
      }
      return null;
    });
    console.log(url);

    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(async () => {
    // const url = window.prompt('URL');
    const url = await Swal.fire({
      title: 'Submit image URL',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        style: { color: '#000 !important' },
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        Swal.fire('Add Link!', '', 'success');
        return result.value;
      }
      return null;
    });
    console.log(url);

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  function getPost() {
    axios.get(`${constants.GET_POST_API}/post/${params.id}`)
      .then((res) => {
        console.log(res.data.data);
        const postData = res.data.data.post;
        setPost({
          title: postData.title,
          subtitle: postData.subtitle,
          content: postData.content,
        });
        setContent(postData.content);
        editor.commands.setContent(postData.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (params.id && editor) {
      setPostId(params.id);
      getPost();
      setIsEdit(true);
    }
  }, [editor]);

  return (
    <div className="tiptap-editor">
      <MenuBar
        editor={editor}
        setLink={setLink}
        addImage={addImage}
      />
      <div id="editor-field">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default TipTap;
