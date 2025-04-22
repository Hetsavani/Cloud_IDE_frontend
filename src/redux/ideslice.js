// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   tabs: [
//     // { name: 'index.js', path: '/index.js', content: '// Start coding!', language: 'javascript' },
//     // { name: 'style.css', path: '/style.css', content: 'body { margin: 0; }', language: 'css' },
//     // { name: 'README.md', path: '/README.md', content: '# Welcome to your IDE', language: 'markdown' },
//   ],
//   openFiles: [],
//   activeFile: null,
// };

// const ideSlice = createSlice({
//   name: "ide",
//   initialState,
//   reducers: {
//     openFile: (state, action) => {
//       // const { name,  path } = action.payload;
//       const { name, content, path } = action.payload;

//       // Check if tab already exists
//       const existingTab = state.tabs.find((tab) => tab.path === path);
//       console.log("OpenFile called");
//       state.activeTab = path
//       if (!existingTab) {
//         state.tabs.push({ name, content, path });
//         console.log("Content " + JSON.stringify(state.tabs));
//       }
//     },
//     closeFile: (state, action) => {
//       // const currentIndex = state.tabs.findIndex((tab) => tab.path === action.payload);
//       state.tabs = state.tabs.filter((tab) => tab.path !== action.payload);
//       // const remainingTabs = state.tabs.filter((tab) => tab.path !== action.payload);
    
//       if (state.activeTab === action.payload) {
        
//         const lastTab = state.tabs[state.tabs.length - 1];
//         state.activeTab = lastTab ? lastTab.path : null;
//       }
      
//       // const { path } = action.payload;
//       // state.tabs = state.tabs.filter((tab) => tab.path !== path);
//     },
//     setActiveFile(state, action) {
//       state.activeFile = action.payload;
//       state.activeTab = action.payload;
//     },
//     // updateFileContent(state, action) {
//     //   const { path, content } = action.payload;
//     //   console.log(path);
//     //   console.log(content);
//     //   console.log(state.activeFile);
//     //   console.log("path");
//     //   const file = state.openFiles.find((file) => file.path === path);
//     //   if (file) {
//     //     file.content = content;
//     //   }
//     //   if (state.activeFile === path) {
//     //     console.log(state.path.content)
//     //     state.path.content = content;
//     //   }
//     // },
//     updateFileContent: (state, action) => {
//       const { path, content } = action.payload;
//       console.log("edfrgthyj")
//       console.log(path)
//       // console.log(state.tabs)
//       // Find the index of the file to update
//       const fileIndex = state.tabs.findIndex((file) => file.path === path);
//       console.log(fileIndex)
//       if (fileIndex === -1) {
//         // If the file is not found, return the current state
//         return state;
//       }
//       // state.tabs[fileIndex].content = content
//       const updatedTabs = state.tabs.map((tab, i) =>
//         i === fileIndex ? { ...tab, content } : tab
//       );

//       // Update activeFile if it matches the tab's path
//       const updatedActiveFile =
//         state.activeFile?.path === state.tabs[fileIndex]?.path
//           ? { ...state.activeFile, content }
//           : state.activeFile;

//       return {
//         ...state,
//         tabs: updatedTabs,
//         activeFile: updatedActiveFile,
//       };
//       // Create a new openFiles array with the updated file content
//       // const updatedOpenFiles = state.openFiles.map((file, index) =>
//       //   index === fileIndex ? { ...file, content:content } : file
//       // );
//       // console.log(state.tabs[fileIndex])
//       // state.tabs[fileIndex].content = content
//       // // Update the activeFile if it matches the path
//       // const updatedActiveFile =
//       //   state.activeTab?.path === path
//       //     ? { ...state.activeTab, content }
//       //     : state.activeTab;

//       // // Return the new state
//       // return {
//       //   ...state,
//       //   openFiles: updatedOpenFiles,
//       //   activeTab: updatedActiveFile,
//       // };
//     },
//     // updateFileContent(state, action) {
//     //   const { path, content } = action.payload;
//     //   console.log(path);
//     //   console.log(content);
    
//     //   // Create a new array of openFiles with the updated content
//     //   const updatedOpenFiles = state.openFiles.map((file) =>
//     //     file.path === path ? { ...file, content } : file
//     //   );
    
//     //   // Update the activeFile if it matches the path
//     //   const updatedActiveFile =
//     //     state.activeTab?.path === path
//     //       ? { ...state.activeTab, content }
//     //       : state.activeTab;
    
//     //   // Return the new state
//     //   return {
//     //     ...state,
//     //     openFiles: updatedOpenFiles,
//     //     activeTab: updatedActiveFile,
//     //   };
//     // },
//   },
// });

// export const { openFile, closeFile, setActiveFile, updateFileContent } =
//   ideSlice.actions;
// export default ideSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: [],
  openFiles: [], // Not needed if tabs array is the source of truth
  activeFile: null,
  activeTab: null, // Keep activeTab for UI to highlight active tab
};

const ideSlice = createSlice({
  name: "ide",
  initialState,
  reducers: {
    openFile: (state, action) => {
      const { name, content, path } = action.payload;

      const existingTab = state.tabs.find((tab) => tab.path === path);
      state.activeTab = path; // Set activeTab when opening a file
      if (!existingTab) {
        state.tabs.push({ name, content, path });
      }
    },
    closeFile: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.path !== action.payload);

      if (state.activeTab === action.payload) {
        const lastTab = state.tabs[state.tabs.length - 1];
        state.activeTab = lastTab ? lastTab.path : null;
      }
    },
    setActiveFile(state, action) {
      state.activeFile = action.payload;
      state.activeTab = action.payload; // Keep activeTab in sync with setActiveFile
    },
    updateFileContent: (state, action) => {
      const { path, content } = action.payload;

      // Find the tab to update using findIndex
      const fileIndex = state.tabs.findIndex((tab) => tab.path === path);

      if (fileIndex !== -1) { // Check if fileIndex is valid (file found)
        // Directly update the content of the tab at the found index immutably
        state.tabs = state.tabs.map((tab, index) =>
          index === fileIndex ? { ...tab, content: content } : tab
        );

        // Update activeFile content if it's the same file
        if (state.activeFile && state.activeFile.path === path) {
          state.activeFile = { ...state.activeFile, content: content };
        }
      }
      console.log(state.tabs)
      // If fileIndex is -1 (file not found in tabs), state remains unchanged (implicitly returned)
    },
  },
});

export const { openFile, closeFile, setActiveFile, updateFileContent } =
  ideSlice.actions;
export default ideSlice.reducer;