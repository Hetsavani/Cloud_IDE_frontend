import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { closeFile } from "./redux/ideslice";

const Tabs = ({ openFiles, activeFile, setActiveFile, closeFile }) => {
  const tabs = useSelector((state) => state.ide.tabs);
  const dispatch = useDispatch();

  const handleCloseTab = (path) => {
    dispatch(closeFile({ path }));
  };
  return (
    <div className="tabs">
      {openFiles.map((file) => (
        <div
          key={file.path}
          className={`tab ${activeFile?.path === file.path ? 'active' : ''}`}
          onClick={() => setActiveFile(file)}
        >
          {file.name}
          <button onClick={(e) => {
            e.stopPropagation(); // Prevent tab activation on close
            closeFile(file);
          }}>x</button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
