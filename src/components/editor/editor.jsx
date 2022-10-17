import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import {
  FormControl,
  Button,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
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
  socket,
  room,
  mode,
  setMode,
  version,
  setVersion,
  code,
  setCode,
  editor,
  isStreamer,
  tag,
  setTag,
  addTag,
  setFrom,
  from,
  isFrom,
  setIsFrom,
}) {
  const [terminal, setTerminal] = useState('');
  const [select, setSelect] = useState('');
  const [isCompilable, setIsCompilable] = useState(true);
  const [isSending, setIsSending] = useState(false);
  // eslint-disable-next-line no-case-declarations, max-len
  const twosum = 'var twoSum = function(nums, target) {\n  var map = {};\n  for(var i = 0 ; i < nums.length ; i++){\n    var v = nums[i];\n    for(var j = i+1 ; j < nums.length ; j++ ){\n      if(  nums[i] + nums[j]  == target ){\n        return [i,j];\n      }\n     }\n    }\n  };\n\nconst result = twoSum([3,4,5,6,7,8], 12)\nconsole.log(result);';

  // Change programming language
  const changeMode = (e) => {
    const language = e.target.value;
    setMode(language);
    switch (language) {
      case 'javascript':
        setCode(twosum);

        // setCode('//Javascript\nconsole.log("Hello Javascript!");');
        break;
      case 'golang':
        setCode('// Golang\npackage main\nimport "fmt"\n\nfunc main(){\n    fmt.Println("Hello Golang!") \n}');
        break;
      case 'python':
        setCode('# Python\nprint(\'Hello Python!\')');
        break;
      default:
        setCode('');
        break;
    }

    switch (language) {
      case 'javascript':
      case 'golang':
      case 'python':
        setIsCompilable(true);
        break;
      case 'dockerfile':
      case 'mysql':
      case 'powershell':
      case 'gitignore':
      case 'markdown':
        setIsCompilable(false);
        break;

      default:
        setIsCompilable(false);
        break;
    }
  };

  // ============== 版本控制 ===============
  // Use version tag
  const changeVersion = (e) => {
    if (e.target.value) {
      axios.get(`${constants.GET_VERSION_API}/${room}?tag=${e.target.value}`)
        .then((res) => {
          setCode(res.data.data.tags[0].code);
          // setSelect(e.target.value);
          setSelect('');
        })
        .catch((err) => console.log(err));
    } else {
      setSelect('');
    }
  };

  const handleUpperTag = (e) => {
    if (e.target.value) {
      setFrom(e.target.value);
    }
  };

  // Get all version tag
  const getVersion = () => {
    if (room != null) {
      axios.get(`${constants.GET_CODE_API}/${room}`)
        .then((res) => {
          setVersion([]);
          if (res.data.data) {
            const tags = [];
            res.data.data.tags.forEach((data) => {
              if (!data.from) {
                tags.push({ version: data.tag });
                if (data.child) {
                  data.child.forEach((child) => {
                    tags.push({ version: child, from: data.tag });
                  });
                }
              }
            });
            setVersion(tags);
          }
        })
        .catch(((err) => console.log(err)));
    }
  };

  const editTag = (e) => {
    setTag(e.target.value);
  };

  // ============== 程式編譯 ===============
  // Edit code
  const editCode = (newValue) => {
    setCode(newValue);
  };

  // Compile code
  const compile = async () => {
    setTerminal('');
    setIsSending(true);
    try {
      const data = {
        language: mode,
        code,
      };
      const result = await axios.post(constants.GET_CODE_API, data);
      if (typeof result.data !== 'string') {
        setTerminal(JSON.stringify(result.data));
      } else {
        setTerminal(result.data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsSending(false);
  };

  // fetch version first
  useEffect(() => {
    if (room) {
      getVersion();
    }
  }, [room]);

  // Websocket interact on code
  useEffect(() => {
    socket.on('addTag', (newTag) => {
      setVersion((prev) => [...prev, { version: newTag.tag }]);
    });
    socket.on('getCode', () => {
      socket.emit('passCode', editor.current.editor.getValue());
    });
    return (() => socket.close());
  }, [socket]);

  return (
    <div id="editor-container">
      <div id="editors">
        <AceEditor
          ref={editor}
          mode={mode}
          theme="tomorrow_night_bright"
          name="code-editor"
          className="editor"
          width="100%"
          value={code}
          defaultValue={"//Javascript\nconsole.log('Hello Javascript!');"}
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
            fontSize: '13px',
          }}
        />
        <AceEditor
          mode="text"
          theme="tomorrow_night_bright"
          name="code-terminal"
          className="editor terminal"
          height="215px"
          width="100%"
          readOnly
          value={terminal}
          editorProps={{ $blockScrolling: false }}
          showPrintMargin={false}
          showGutter={false}
          highlightActiveLine={false}
          setOptions={{
            selectionStyle: 'text',
            highlightGutterLine: false,
            copyWithEmptySelection: true,
            fontSize: '13px',
          }}
        />
      </div>
      <div id="editor-btn-container">

        <div id="editor-btns">
          <FormControl className="editor-selector" size="small">
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              name="language"
              id="language"
              labelId="language-label"
              label="Language"
              value={mode}
              onChange={changeMode}
            >
              <MenuItem value="null">Language</MenuItem>
              <MenuItem value="javascript">Javascript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="golang">Golang</MenuItem>
              <MenuItem value="dockerfile">Dockerfile</MenuItem>
              <MenuItem value="mysql">MySQL</MenuItem>
              <MenuItem value="powershell">PowerShell</MenuItem>
              <MenuItem value="gitignore">gitignore</MenuItem>
              <MenuItem value="markdown">Markdown</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="editor-selector" size="small">
            <InputLabel id="version-label">Version</InputLabel>
            <Select
              name="version"
              id="version"
              labelId="language-label"
              label="Version"
              value={select}
              onChange={changeVersion}
            >
              {version.map((ver) => (
                ver.from ? (
                  <MenuItem
                    key={ver.version}
                    value={ver.version}
                  >
                    {ver.version}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={ver.version}
                    value={ver.version}
                  >
                    {ver.version}
                  </MenuItem>
                )
              ))}
            </Select>
          </FormControl>

          <Button
            id="run-btn"
            variant="contained"
            size="small"
            type="button"
            disabled={!isCompilable}
            onClick={compile}
          >
            {isSending ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size={30} color="inherit" />
              </Box>
            )
              : 'Run'}
          </Button>
        </div>

        {isStreamer ? <hr style={{ width: '100%', border: '1px solid var(--third-color)' }} /> : null }

        {isStreamer ? (
          <div id="tag-container">
            <FormGroup>
              <FormControlLabel
                control={(
                  <Switch
                    checked={isFrom}
                    onChange={() => setIsFrom(!isFrom)}
                  />
                )}
                label="Use Upper Version"
                labelPlacement="end"
              />
            </FormGroup>
            <FormControl className="editor-selector" size="small">
              <InputLabel id="upper-tag-label">Upper Version</InputLabel>
              <Select
                name="upper-version"
                id="upper-version"
                labelId="language-label"
                label="Version"
                value={from}
                onChange={handleUpperTag}
              >
                <MenuItem
                  value={null}
                >
                  No upper version
                </MenuItem>
                {version.map((ver) => (
                  ver.from ? (
                    <MenuItem
                      key={ver.version}
                      value={ver.version}
                    >
                      {ver.version}
                    </MenuItem>
                  ) : (
                    <MenuItem
                      key={ver.version}
                      // style={{ backgroundColor: '#1a4d7b', color: '#fff' }}
                      value={ver.version}
                    >
                      {ver.version}
                    </MenuItem>
                  )
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Version Name"
              size="small"
              variant="outlined"
              type="text"
              name="tag"
              id="tag-input"
              value={tag}
              onChange={editTag}
            />
            <Button
              variant="contained"
              type="button"
              className="editor-btn"
              id="tag-btn"
              onClick={addTag}
            >
              Add Version
            </Button>
          </div>
        ) : null }
      </div>
    </div>
  );
}

export default Editor;
