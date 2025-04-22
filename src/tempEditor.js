import { useSelector, useDispatch } from "react-redux";
import {
  openFile,
  closeFile,
  setActiveFile,
  updateFileContent,
} from "./redux/ideslice";
import Editor from "@monaco-editor/react";
import socket from "./Socket";
import { useEffect, useCallback, useState } from "react";
import "./Editor.css";

function CodeEditor() {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [removingTab, setRemovingTab] = useState(null);
  const [theme, setTheme] = useState();
useEffect(()=>{
    setTheme(localStorage.getItem('editorTheme') || 'vs-light')
  },[])

  // Redux state
  const tabs = useSelector((state) => state.ide.tabs);
  const activeTab = useSelector((state) => state.ide.activeTab);

  // Fetch current path from sessionStorage
  const path = sessionStorage.getItem("currentPath");

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
  // const handleCodeChange = useCallback(
  //   (newCode) => {
  //     if (activeTab) {
  //       dispatch(updateFileContent({ path: activeTab, code: newCode }));
  //       setCode(newCode);
  //       console.log('Updated file content')
  //     }
  //   },
  //   [dispatch, activeTab]
  // );

  function handleCodeChange (c){
      // if (activeTab) {
        setCode(c);

        console.log("c : "+c);
        console.log("code : "+code);
        console.log(sessionStorage.getItem("currentPath"))
        dispatch(updateFileContent({ path: sessionStorage.getItem("currentPath"), content: code }));
        console.log('Updated file content')
      // }
    }

  // Add new method for saving file
  // function saveFile (tabpath,code){
  //   console.log('Saving file')
  //   // console.log(path)
  //   console.log(code)
  //   socket.emit("file-data:update", {path:tabpath, code:code})
  //   console.log("Save file called")
  //   // fetch(`http://localhost:3010/file-data`, {
  //   //   method: "POST",
  //   //   headers: { "Content-Type": "application/json" },
  //   //   body: JSON.stringify({ path, code: content }),
  //   // });
  // }

  const saveFile = useCallback((tabPath, code) => {
    console.log('Saving file');
    console.log(code);
    socket.emit("file-data:update", { path: tabPath, code: code });
    console.log("Save file called");
  }, []);

  // Add useEffect for Ctrl+S handler
  const handleKeyDown = (e) => {
    // if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      if (activeTab) {
        const currentTab = tabs.find(tab => tab.path === activeTab);
        if (currentTab) {
          console.log("Ctrl + S");
          console.log(activeTab);
          console.log(currentTab.content);
          saveFile(activeTab, currentTab.content);
        }
      }
    }
  };
   // Add event listener on component mount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveFile]);

  // Modify handleCloseTab to include auto-save
  const handleCloseTab = (tabPath, e) => {
    e.stopPropagation();
    setRemovingTab(tabPath);
    
    // Auto-save before closing
    const closingTab = tabs.find(tab => tab.path === tabPath);
    if (closingTab) {
      // saveFile(tabPath, closingTab.content);
      console.log('tab path : '+tabPath);
      console.log('code 2 : '+code);
      saveFile(tabPath, code);
    }

    setTimeout(() => {
      console.log("handleCloseTab: called");
      const currentIndex = tabs.findIndex((tab) => tab.path === tabPath);
      const remainingTabs = tabs.filter((tab) => tab.path !== tabPath);

      if (activeTab === tabPath) {
        const newTab = currentIndex > 0
          ? tabs[currentIndex - 1]
          : remainingTabs[0];

        if (newTab) {
          console.log("New tab selected : " + JSON.stringify(newTab));
          setCode(newTab.content || "");
          dispatch(setActiveFile(newTab.path));
          setTimeout(() => {
            setCode(newTab.content || "");
          }, 0);
        } else {
          setCode("");
          dispatch(setActiveFile(null));
        }
      }
      dispatch(closeFile(tabPath));

      // if (activeTab === tabPath) {
      //   const remainingTabs = tabs.filter((tab) => tab.path !== tabPath);
      //   const lastTab = remainingTabs[remainingTabs.length - 1];
      //   if (lastTab) {
      //     setCode(lastTab.content || "");
      //     dispatch(setActiveFile(lastTab.path));
      //   } else {
      //     setCode("");
      //     dispatch(setActiveFile(null));
      //   }
      // }

      setRemovingTab(null);
    }, 300);
    // dispatch(closeFile(tabPath));
    // if (activeTab === tabPath) {
    //   const remainingTabs = tabs.filter(tab => tab.path !== tabPath);
    //   const lastTab = remainingTabs[remainingTabs.length - 1];
    //   if (lastTab) {
    //     setCode(lastTab.content || "");
    //     dispatch(setActiveFile(lastTab.path));
    //   } else {
    //     setCode("");
    //     dispatch(setActiveFile(null));
    //   }
    //   tabs = remainingTabs
    // }
  };
  const handleThemeChange = (e) => {
    // const temp = localStorage.getItem('editorTheme');
    var isDark = e.target.checked;
    // if(temp === "vs-dark"){
      // isDark = true;
      // e.target.setAttribute('checked', 'checked');
    // }else{
      // isDark = e.target.checked;
    // }
    const newTheme = isDark ? 'vs-dark' : 'vs-light';
    setTheme(newTheme);
    localStorage.setItem('editorTheme', newTheme);

  };

  // Handle tab click
  const handleTabClick = (tabPath) => {
    dispatch(setActiveFile(tabPath));
    console.log(tabs);
    setCode(tabs.find((tab) => tab.path === tabPath)?.content || "");
  };

  // Handle code change
  // const handleCodeChange = useCallback(
  //   (newCode) => {
  //     if (activeTab) {
  //       dispatch(updateFileContent({ path: activeTab, code: newCode }));
  //       console.log('File content updated')
  //       // saveFileData(activeTab, newCode)
  //       saveFileManually(activeTab, newCode);
  //     }
  //   },
  //   [dispatch, activeTab]
  // );
  // function saveFileManually(currentTab,code){
  //   fetch(`http://localhost:3010/file-data`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ path: currentTab.path, code: code }),
  //   });
  // }

  // Save file data to server
  const saveFileData = useCallback(() => {
    const currentTab = tabs.find((tab) => tab.path === activeTab);
    if (currentTab) {
      fetch(`http://localhost:3010/file-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: currentTab.path, code: currentTab.code }),
      });
    }
  }, [activeTab, tabs]);

  return (
    <>
    <div>
      
    </div>
      <div style={{"float":"right"}}>
        <label for="theme" class="theme" >
          <span class="theme__toggle-wrap" >
            <input
              id="theme"
              class="theme__toggle"
              type="checkbox"
              role="switch"
              name="theme"
              value="dark"
              onChange={handleThemeChange}
            />
            <span class="theme__fill" ></span>
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
      </div>
      <div className="tabs-container" style={{"backgroundColor":theme!=='vs-dark'?"#f5f5f5":"#252526","border":"none"}}>
        {tabs.map((tab) => (
          <div
            key={tab.path}
            className={`tab ${activeTab === tab.path ? "active" : ""} ${
              removingTab === tab.path ? "removing" : ""
            }`}
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
          height="600px"
          width="1120px"
          defaultLanguage="java"
          value={code}
          onChange={(value)=>{
            handleCodeChange(value)
          }}
          // theme={theme}
          theme="vs-dark"
        />
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

