import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "../../css/AceEditor.css";

function ACEEditor({
  inputT,
  set_render_state,
  render_state,
  language_id,
}) {
  const [language, setLanguage] = useState();
  useEffect(() => {
    if (parseInt(language_id) === 54) {
      setLanguage("c_cpp");
    } else if (parseInt(language_id) === 50) {
      setLanguage("c_cpp");
    } else if (parseInt(language_id) === 62) {
      setLanguage("java");
    } else if (parseInt(language_id) === 71) {
      setLanguage("python");
    }
    set_render_state(false);
  }, [render_state]);

  return (
    <>
      {language !== undefined && (
        <AceEditor
          mode={language}
          theme="github"
          width="100%"
          name="editor"
          editorProps={{ $blockScrolling: true }}
          value={inputT}
          height={`100%`}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      )}
    </>
  );
}

export default ACEEditor;
