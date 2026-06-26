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