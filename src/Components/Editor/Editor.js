import { useSelector, useDispatch } from "react-redux";
import {
  openFile,
  closeFile,
  setActiveFile,
  updateFileContent,
} from "../../redux/ideslice";
import { Editor, MonacoEditor } from "@monaco-editor/react";
import socket from "../../Socket";
import { useEffect, useCallback, useState } from "react";
import { API_BASE_URL } from "../../config";
import "./Editor.css";
import { languages } from "prismjs";
import { FiCode, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";
import { Loader2, Moon, Sun } from "lucide-react";
import CodeEditorPopup from "./CodeEditorPopup";
// import {XtermTerminal} from "./XtermTerminal";

function CodeEditor() {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [removingTab, setRemovingTab] = useState(null);
  // const [theme, setTheme] = useState("vs-dark");
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to 'vs-light'
    return localStorage.getItem("editorTheme") || "vs-dark";
  });
  const [inputVal, setinputVal] = useState("");
  const [outputVal, setoutputVal] = useState("");
  const [language, setlanguage] = useState("txt");
  const [imageCode, setImageCode] = useState("");
  const [image, setImage] = useState({}); // State to store the uploaded image
  const [userImage, setUserImage] = useState(null);
  const [error, setError] = useState(""); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [name, setName] = useState("");
  // useEffect(() => {
  //   setTheme(localStorage.getItem("editorTheme") || "vs-light");
  // }, []);

  // Redux state
  const tabs = useSelector((state) => state.ide.tabs);
  const activeTab = useSelector((state) => state.ide.activeTab);

  // Fetch current path from sessionStorage
  const path = sessionStorage.getItem("currentPath");
  useEffect(() => {
    // Get the name from sessionStorage when the component mounts
    const storedName = sessionStorage.getItem("user");
    if (storedName) {
      setName(storedName);
    }
  }, []);
  // Fetch file content for active tab
  useEffect(() => {
    if (path && !tabs.find((tab) => tab.path === path)) {
      // fetch(`http://localhost:3010/file-data?path=${path}`)
      //   .then(res => res.json())
      //   .then(data => {
      //     const { data: fileContent, code } = data;
      //     dispatch(openFile({ path, code: fileContent || code || "" }));
      //   });
    }
    setCode(
      tabs.find((tab) => tab.path === sessionStorage.getItem("currentPath"))
        ?.content || ""
    );
  }, [path, tabs, dispatch]);

  // Modify handleCodeChange to only update the content
  const handleCodeChange = useCallback(
    (newCode) => {
      if (activeTab) {
        console.log("At handleCodeChange ::" + newCode);
        dispatch(updateFileContent({ path: activeTab, content: newCode }));
        setCode(newCode);
        // console.log(tabs);
      }
    },
    [dispatch, activeTab, tabs]
  );

  // Add new method for saving file
  const saveFile = useCallback(() => {
    const currentPath = sessionStorage.getItem("currentPath");
    if (currentPath && code) {
      fetch(`${API_BASE_URL}/api/files/${currentPath}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ content: code }),
      });
      console.log(`Saved file: ${currentPath}`);
    }
  }, [code]);

  const getLanguageFromExtension = (filename) => {
    if (!filename) return "plaintext";
    const extension = filename.split(".").pop(); // Get file extension
    const extensionMap = {
      py: "python",
      js: "javascript",
      java: "java",
      cpp: "cpp",
      c: "c",
    };
    return extensionMap[extension] || "plaintext"; // Default to plaintext
  };
  useEffect(() => {
    console.log("Active Tab:", activeTab);
    setlanguage(getLanguageFromExtension(activeTab));
  }, [activeTab]);

  useEffect(() => {
    console.log("Updated Language:", language);
  }, [language]);

  // Add useEffect for Ctrl+S handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (activeTab) {
          const currentTab = tabs.find((tab) => tab.path === activeTab);
          if (currentTab) {
            console.log("Active Tab:", activeTab);
            console.log("Active Tab:", code);
            dispatch(updateFileContent({ path: activeTab, content: code }));
            saveFile();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, tabs, saveFile]);

  // Modify handleCloseTab to include auto-save
  const handleCloseTab = (tabPath, e) => {
    e.stopPropagation();
    setRemovingTab(tabPath);
    console.log(tabs);
    // Save before closing
    // if (tabPath === activeTab) {
    // }
    saveFile();

    setTimeout(() => {
      const currentIndex = tabs.findIndex((tab) => tab.path === tabPath);
      const remainingTabs = tabs.filter((tab) => tab.path !== tabPath);

      if (activeTab === tabPath) {
        const newTab =
          currentIndex > 0 ? tabs[currentIndex - 1] : remainingTabs[0];

        if (newTab) {
          console.log("came here point");
          // setCode(newTab.content || "");
          // dispatch(setActiveFile(newTab.path));
          handleTabClick(newTab.path);
        } else {
          setCode("");
          dispatch(setActiveFile(null));
        }
      }
      dispatch(closeFile(tabPath));

      setRemovingTab(null);
    }, 300);
  };
  // const handleThemeChange = (e) => {
  //   // const temp = localStorage.getItem('editorTheme');
  //   var isDark = e.target.checked;
  //   // if(temp === "vs-dark"){
  //   // isDark = true;
  //   // e.target.setAttribute('checked', 'checked');
  //   // }else{
  //   // isDark = e.target.checked;
  //   // }
  //   setTheme(e.target.checked ? "vs-dark" : "vs-light")
  //   // const newTheme = isDark ? "vs-dark" : "vs-light";
  //   // setTheme(newTheme);
  //   console.log(theme)
  //   localStorage.setItem("editorTheme", theme);
  // };
  useEffect(() => {
    console.log("Current theme:", theme);
  }, [theme]);
  const handleThemeChange = useCallback(
    (e) => {
      // e.stopPropagation();
      // e.preventDefault();
      console.log("Theme changed");
      const newTheme = theme === "vs-light" ? "vs-dark" : "vs-light";
      setTheme(newTheme);
      localStorage.setItem("editorTheme", newTheme);
      window.dispatchEvent(new Event("editorThemeChange"));
    },
    [theme]
  );

  // Handle tab click
  // const handleTabClick = (tabPath) => {
  //   dispatch(setActiveFile(tabPath));
  //   console.log(tabs);
  //   console.log("Active file: " + activeTab);
  //   sessionStorage.setItem("currentPath", activeTab);
  //   setCode(tabs.find((tab) => tab.path === tabPath)?.content || "");
  //   console.log("tabPath file: " + tabPath);
  //   console.log(code)
  // };
  const handleTabClick = (tabPath) => {
    // Update the active tab in the Redux store
    dispatch(setActiveFile(tabPath));

    // Find the content of the new tab
    const newTabContent =
      tabs.find((tab) => tab.path === tabPath)?.content || "";

    // Update the code state with the new tab content
    setCode(newTabContent);

    // Update the session storage with the new active tab path
    sessionStorage.setItem("currentPath", tabPath);

    // Log the changes for debugging
    console.log(tabs);
    console.log("Active file: " + tabPath);
    console.log("tabPath file: " + tabPath);
    console.log(newTabContent);
  };

  const handleRunButton = () => {
    // console.log(inputVal)
    //  setinputVal(inputVal.replace(/\n/g, "\\n"))
    var input = inputVal.replace(/\n/g, "\\n");
    // console.log(activeTab)
    var filename = activeTab;
    fetch(`${API_BASE_URL}/api/execute/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        code: code,
        input: inputVal,
        filename: filename,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status.id > 2) {
          console.log(res.stdout);
          setoutputVal(res.stdout);
        } else {
          setoutputVal(res.stderr);
        }
      });
    // socket.emit("run", activeTab)
  };
  // Save file data to server
  const handleImageCodeRun = () => {
    setIsLoading(true);
    var input = inputVal.replace(/\n/g, "\\n");
    // console.log(activeTab)
    var filename = activeTab;
    fetch(`${API_BASE_URL}/api/execute/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        code: imageCode,
        input: inputVal,
        filename: "Solution.java",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status.id > 2) {
          console.log(res.stdout);
          setoutputVal(res.stdout);
        } else {
          setoutputVal(res.stderr);
        }
      });
    // socket.emit("run", activeTab)
    setIsLoading(false);
  };

  const handleImageUpload = async (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setImage(file);
      // console.log(userImage);
      // console.log(file);
    }
  };
  useEffect(() => {
    extractCodeFromImage();
  }, [image]);

  const extractCodeFromImage = async () => {
    console.log("Image point");
    if (!image) {
      setError("Please upload an image first.");
      return;
    }
    setError("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];
        console.log("Calling OCR API");
        const response = await fetch(`${API_BASE_URL}/api/ocr/extract-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image, mimeType: image.type }),
        });

        const data = await response.json();
        const text = data.text;

        setImageCode(text);
        const lines = text.trim().split("\n");
        setlanguage(lines[0].slice(3, lines[0].length));
        console.log(lines);
        setImageCode(lines.slice(1, -1).join("\r\n"));
        setLoading(false);
      };
    } catch (err) {
      setError("Failed to extract code. Please try again.");
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <>
      <div
        style={{
          height: "25px",
          backgroundColor: theme == "vs-dark" ? "#3c3c3c" : "transparent",
          color: theme === "vs-dark" ? "white" : "black",
          textAlign: "right",
          paddingRight: "10px",
        }}
      >
        {name.length > 2 ? name.slice(1, -1) : ""}'s workspace
      </div>
      {/* <div style={{ height: "20px", backgroundColor: "red" }}></div> */}

      <div
        style={{
          height: "35px",
          float: "right",
          backgroundColor: theme == "vs-dark" ? "#3c3c3c" : "transparent",
        }}
      >
        <label for="theme" class="theme">
          <span class="theme__toggle-wrap">
            <input
              id="theme"
              class="theme__toggle"
              type="checkbox"
              role="switch"
              name="theme"
              value="dark"
              onClick={handleThemeChange}
              checked={theme === "vs-dark"}
            />
            <span class="theme__fill"></span>
            <span class="theme__icon">
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
              <span class="theme__icon-part"></span>
            </span>
          </span>
        </label>
        {/* <Sun className="small" style={{ width: "1rem", height: "1rem" }} />
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            // checked={}
            onChange={handleThemeChange}
          />
        </div>
        <Moon className="small" style={{ width: "1rem", height: "1rem" }} /> */}
      </div>
      <div
        onClick={handleRunButton}
        style={{
          height: "35px",
          float: "right",
          backgroundColor: theme == "vs-dark" ? "#3c3c3c" : "transparent",
        }}
      >
        <button
          style={{ marginLeft: "10px", marginTop: "5px", color: "Green" }}
          onClick={handleRunButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-play"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      </div>
      <div
        className="tabs-container"
        style={{
          backgroundColor: theme !== "vs-dark" ? "#f5f5f5" : "#252526",
          border: "none",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.path}
            className={`tab ${activeTab === tab.path ? "active" : ""} ${
              theme === "vs-dark" ? "dark" : "light"
            } ${removingTab === tab.path ? "removing" : ""}`}
            // className={`tab ${activeTab === tab.path ? "active" : ""}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <span className="tab-name">{tab.path.split("/").pop()}</span>
            <span
              className="tab-close"
              onClick={(e) => handleCloseTab(tab.path, e)}
            >
              x
            </span>
          </div>
        ))}
      </div>

      <div className="editor">
        <Editor
          height="400px"
          // width="1280px"
          width="100%"
          // width={window.width+""}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme={theme}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
            // Enable IntelliSense suggestions
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: true,
            tabCompletion: "on",
            wordBasedSuggestions: true,
          }}
          // theme={isDark? "vs-dark": "vs-light"}
        />
        {/* <MonacoEditor
          height="400px"
          width="100%"
          theme={theme}
          language={language}
          value={code}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
          }}
          onChange={handleCodeChange}
        /> */}
      </div>

      <div className="io-containers">
        <div className="io-container">
          <div className="input-container">
            <div className="flex justify-between"><h3>Input</h3>
            <div
              onClick={handleRunButton}
              style={{
                height: "35px",
                float: "right",
                // backgroundColor: theme == "vs-dark" ? "#3c3c3c" : "transparent",
              }}
            >
              <button
                style={{ marginLeft: "10px", marginTop: "5px", color: "Green" }}
                onClick={handleRunButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-play"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div></div>
            <textarea
              placeholder="Enter your input here..."
              value={inputVal}
              onChange={(e) => {
                setinputVal(e.target.value);
              }}
            />
          </div>
          <div className="output-container">
            <h3>Output</h3>
            <pre>{outputVal ? outputVal : ""}</pre>
          </div>
        </div>
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 bg-cyan-500 text-white rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Choose File
              </label>
              <button
                onClick={() => {
                  setIsCodeEditorOpen(true);
                }}
                className="text-cyan-600 hover:text-cyan-700 transition-colors duration-300 ease-in-out focus:outline-none focus:underline"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Show Code
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handleImageCodeRun}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                isLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running...
                </>
              ) : (
                "Run Code"
              )}
            </button>
          </div>
          {fileName && (
            <div className="mt-2 text-sm text-gray-600">
              Selected file: <span className="font-medium">{fileName}</span>
            </div>
          )}
          <CodeEditorPopup
            isOpen={isCodeEditorOpen}
            onClose={() => setIsCodeEditorOpen(false)}
            initialCode={imageCode}
            onSave={(newCode) => {
              setImageCode(newCode);
            }}
          />
        </div>
        <style jsx>{`
          .io-containers {
            display: flex;
            flex-direction: column;
            background-color: #1e1e1e;
            color: #d4d4d4;
            padding: 20px;
          }

          .io-container {
            display: flex;
            height: 300px;
            gap: 20px;
            margin-bottom: 20px;
          }

          .input-container,
          .output-container {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #9cdcfe;
            font-size: 16px;
          }

          textarea,
          pre {
            flex: 1;
            background-color: #252526;
            border: 1px solid #3c3c3c;
            border-radius: 4px;
            padding: 10px;
            font-family: "Consolas", "Courier New", monospace;
            font-size: 14px;
            resize: none;
            color: #d4d4d4;
          }

          textarea {
            outline: none;
          }

          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-y: auto;
          }

          .run-button {
            align-self: flex-end;
            background-color: #0e639c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
          }

          .run-button:hover {
            background-color: #1177bb;
          }
        `}</style>
      </div>
    </>
  );
}

export default CodeEditor;
// import AceEditor from "react-ace";
// // import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css';

// import Editor from '@monaco-editor/react';

// import "ace-builds/src-noconflict/mode-java";
// // import "ace-builds/src-noconflict/mode-python";
// // import "ace-builds/src-noconflict/mode-html";
// // import "ace-builds/src-noconflict/mode-css";
// // import "ace-builds/src-noconflict/mode-typescript";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/theme-monokai";
// // import "ace-builds/src-noconflict/theme-tomorrow";

// import "ace-builds/src-noconflict/ext-language_tools";
// // import "ace-builds/src-noconflict/ext-searchbox";
// import { useState, useEffect, useCallback } from "react";
// import socket from "./Socket";
// import "./Editor.css";

// function CodeEditor() {
//   const [path, setPath] = useState(sessionStorage.getItem("currentPath"));
//   const [code, setCode] = useState(" ");
//   const [fileContent, setFileContent] = useState("");
//   const isSaved = fileContent === code;
//   const [tabs, setTabs] = useState([]);
//   const [activeTab, setActiveTab] = useState(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const currentPath = sessionStorage.getItem("currentPath");
//       if (currentPath !== path) {
//         setPath(currentPath);

//       }
//     }, 1000); // Check every 500ms or any suitable interval
//     // console.log(path);
//     getFileData()

//     return () => clearInterval(interval); // Clean up on unmount
//   }, [path]);

//   useEffect(()=>{
//   },[path])

//   const saveFileData = useCallback(() => {
//     if (!path || !code) return;
//     socket.emit("file-data:update", { path, code });
//     setFileContent(code);
//     console.log("File saved:", code);
//   }, [path, code]);

//   useEffect(()=>{
//     if(!isSaved && code){
//         const time = setTimeout(()=>{
//             socket.emit("file-data:update", {path, code})
//             setFileContent(code)
//             console.log(code)
//         },5000)
//         return ()=>clearTimeout(time)
//     }
//     // socket.emit("file:read", path, (data)=>{
//     //   setCode(data)
//     // })
//   },[code, isSaved, fileContent])

// useEffect(() => {
//   const handleKeyDown = (e) => {
//     if ((e.ctrlKey || e.metaKey) && e.key === "s") {
//       e.preventDefault(); // Prevent browser's default save dialog
//       saveFileData();
//     }
//   };

//   window.addEventListener("keydown", handleKeyDown);
//   return () => window.removeEventListener("keydown", handleKeyDown);
// }, [saveFileData]);

//   useEffect(()=>{
//     if(path && fileContent){
//       setCode(fileContent)
//     }
//   },[path, fileContent])

//   const getFileData = useCallback (()=>{
//     if(!path) return;
//     const data = fetch(`http://localhost:3010/file-data?path=${path}`)
//     .then(res=>res.json())
//     .then(data=>{
//         // console.log(data)
//         setFileContent(data.data)
//         setCode(data.code)
//     })
//   },[path])

//   useEffect(() => {
//     if (path && !tabs.find(tab => tab.path === path)) {
//       setTabs(prev => [...prev, { path, code: code }]);
//       setActiveTab(path);
//     }
//   }, [path]);

//   const handleCloseTab = (tabPath, e) => {
//     e.stopPropagation();
//     const newTabs = tabs.filter(tab => tab.path !== tabPath);
//     setTabs(newTabs);
//     if (activeTab === tabPath) {
//       setActiveTab(newTabs[newTabs.length - 1]?.path || null);
//       setPath(newTabs[newTabs.length - 1]?.path || null);
//     }
//   };

//   const handleTabClick = (tabPath) => {
//     setActiveTab(tabPath);
//     setPath(tabPath);
//   };

//   return (
//     <>
//       <div>{path ? path.replaceAll('/', ' > ') : ""}{isSaved ? "" : "*"}</div>

//       <div className="tabs-container">
//         {tabs.map(tab => (
//           <div
//             key={tab.path}
//             className={`tab ${activeTab === tab.path ? 'active' : ''}`}
//             onClick={() => handleTabClick(tab.path)}
//           >
//             <span className="tab-name">{tab.path.split('/').pop()}</span>
//             <span
//               className="tab-close"
//               onClick={(e) => handleCloseTab(tab.path, e)}
//             >
//               x
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="editor">
//         <Editor
//           height="600px"
//           width={"1120px"}
//           defaultLanguage="java"
//           defaultValue={code}
//           value={code}
//           onChange={code => setCode(code)}
//           theme="vs-dark"
//         />
//       </div>
//     </>
//   );
// }
// export default CodeEditor;
