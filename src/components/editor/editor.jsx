import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import {
  FormControl, Button, Select, MenuItem, InputLabel,
} from '@mui/material';
import './editor.css';

import constants from '../../global/constants';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

// ============== code 編輯器 ===============
function Editor({
  socket, room, mode, setMode, version, setVersion, code, setCode, editor,
}) {
  const [terminal, setTerminal] = useState();
  // const editor = useRef();

  // Change programming language
  const changeMode = (e) => {
    const language = e.target.value;
    setMode(language);
    switch (language) {
      case 'golang':
        setCode('// Golang\npackage main\nimport "fmt"\n\nfunc main(){\n    fmt.Println("Hello Golang!") \n}');
        break;
      case 'python':
        setCode('# Python\nprint(\'Hello Python!\')');
        break;
      default:
        setCode("//Javascript\nconsole.log('Hello Javascript!');");
        break;
    }
  };

  // ============== 版本控制 ===============
  // Use version tag
  const changeVersion = (e) => {
    if (e.target.value) {
      axios.get(`${constants.SERVER_URL}/api/v1/code/${room}?tag=${e.target.value}`)
        .then((res) => {
          setCode(res.data.code);
        })
        .catch((err) => console.log(err));
    }
  };

  // Get all version tag
  const getVersion = () => {
    axios.get(`${constants.SERVER_URL}/api/v1/code/${room}`)
      .then((res) => {
        setVersion([]);
        res.data.forEach((data) => {
          setVersion((prev) => [...prev, { version: data.tag }]);
        });
      })
      .catch(((err) => console.log(err)));
  };

  // ============== 程式編譯 ===============
  // Edit code
  const editCode = (newValue) => {
    setCode(newValue);
  };

  // Compile code
  const compile = () => {
    const data = {
      language: mode,
      code,
    };
    axios.post(`${constants.SERVER_URL}/api/v1/code`, data)
      .then((res) => {
        console.log(res.data);
        setTerminal(res.data);
      })
      .catch((err) => console.log(err));
  };

  // fetch version first
  useEffect(() => {
    getVersion();
  }, []);

  // Websocket interact on code
  useEffect(() => {
    socket.on('addTag', (newTag) => {
      console.log(newTag);
      setVersion((prev) => [...prev, { version: newTag }]);
    });
    socket.on('getCode', (id) => {
      console.log(id);
      socket.emit('passCode', editor.current.editor.getValue());
    });
  }, [socket]);

  return (
    <div id="editor-container">
      <AceEditor
        ref={editor}
        mode={mode}
        theme="tomorrow"
        name="code-editor"
        className="editor"
        width="100%"
        value={code}
        defaultValue={'//Javascript\nconsole.log(\'Hello Javascript!);'}
        onChange={editCode}
        placeholder={`Programming language : ${mode}`}
        editorProps={{ $blockScrolling: true }}
        showPrintMargin={false}
        showGutter={false}
        highlightActiveLine
        setOptions={{
          autoScrollEditorIntoView: true,
          copyWithEmptySelection: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          tabSize: 2,
        }}
      />
      <AceEditor
        mode="text"
        theme="tomorrow"
        name="code-terminal"
        className="editor"
        height="215px"
        width="100%"
        readOnly
        value={terminal}
        defaultValue=""
        editorProps={{ $blockScrolling: false }}
        showPrintMargin={false}
        showGutter={false}
        highlightActiveLine={false}
        setOptions={{
          selectionStyle: 'text',
          highlightGutterLine: false,
          copyWithEmptySelection: true,
        }}
      />
      <div id="editor-btn-container">
        <FormControl className="editor-selector" size="small">
          <InputLabel id="language-label">Language</InputLabel>
          <Select
            name="language"
            id="language"
            labelId="language-label"
            label="Language"
            defaultValue={mode}
            onChange={changeMode}
          >
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="golang">Golang</option>
          </Select>
        </FormControl>
        <FormControl className="editor-selector" size="small">
          <InputLabel id="version-label">Version</InputLabel>
          <Select
            name="version"
            id="version"
            labelId="language-label"
            label="Version"
            onChange={changeVersion}
          >
            {/* <option value="">- choose version</option> */}
            {version.map((ver) => (
              <MenuItem key={ver.version} value={ver.version}>{ver.version}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button id="run-btn" variant="contained" size="small" type="button" onClick={compile}>Run</Button>
      </div>
    </div>
  );
}

export default Editor;
