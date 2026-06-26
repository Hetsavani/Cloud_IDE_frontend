import React, { useEffect, useState } from "react";
import {
  FolderIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  FolderPlus,
  FilePlus,
  FileTextIcon,
  Trash2Icon,
  LogOut,
} from "lucide-react";
import socket from "../../Socket";
import { useDispatch } from "react-redux";
import { openFile } from "../../redux/ideslice";
import { API_BASE_URL } from "../../config";

export default function Files() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPath, setCurrentPath] = useState("");
  const [openFolders, setOpenFolders] = useState(new Set());
  const dispatch = useDispatch();
  const [openPaths, setOpenPaths] = useState({}); // Tracks open state by path
  const [theme,setTheme] = useState("")
  // Function to toggle the open/close state of a folder
  const togglePath = (path) => {
    setOpenPaths((prev) => ({
      ...prev,
      [path]: !prev[path], // Toggle the open state of the given path
    }));
  };

  const fetchTree = async () => {
    try {
      console.log("Fetching file tree...");
      const token = await localStorage.getItem("token");
      // const response = await fetch('http://localhost:3010/files');
      const response = await fetch(`${API_BASE_URL}/api/files/get-tree`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // If authentication is required
        },
      });
      // Log response details for debugging
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is ok before proceeding
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Verify content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Server response:", text);
        throw new Error(
          "Server did not return JSON. Check if the server is running correctly."
        );
      }

      const data = await response.json();
      console.log("Received data:", data);

      if (!data.tree) {
        throw new Error("Invalid data format: missing tree property");
      }

      setTree(data.tree);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching file tree:", err);
      setError(
        err.message ||
          "Failed to fetch file tree. Please check if the server is running."
      );
      setLoading(false);
      setTree(null);
    }
  };

  useEffect(() => {
    socket.emit("set:user", sessionStorage.getItem("user"));
    fetchTree();
    socket.on("file:update", fetchTree);
    return () => {
      socket.off("file:update", fetchTree);
    };
  }, []);

  const createNewFolder = async () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/files/folder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            folderPath: currentPath,
            folderName: folderName,
          }),
        });
        console.log("================================");
        console.log(response.json());
        if (!response.ok) {
          throw new Error("Failed to create folder");
        }
        // var dot = isFolder ? "." : "";
        // var dot = currentPath.length == 0 ? "." : "";
        // console.log(currentPath + " current folder path");
        // // console.log("Path : "+currentPath)
        // socket.emit("folder:create", {
        //   path: dot + currentPath,
        //   name: folderName,
        // });
        fetchTree();
      } catch (err) {
        console.error("Error creating folder:", err);
      }
    }
  };

  const createNewFile = async () => {
    const fileName = prompt("Enter file name:");
    if (fileName) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/files/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            language: "python",
            filepath: currentPath,
            filename: fileName,
            content: "",
            folderPath: currentPath,
          }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to create file");
        }
        
        fetchTree();
      } catch (err) {
        console.error("Error creating file:", err);
      }
    }
  };
  const handleFileDelete = async () => {
    // console.log(`http://localhost:5000/api/files/fileDelete/${currentPath}`);
    const res = await fetch(
      `${API_BASE_URL}/api/files/file/${currentPath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      alert("Error deleting file");
    } else {
      fetchTree();
    }
  };
  const handleFolderDelete = async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/files/folder/${currentPath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      alert("Error deleting folder");
    } else {
      fetchTree();
    }
  };
  const handleFolderClick = (path) => {
    setOpenFolders((prev) => {
      const newOpenFolders = new Set(prev);
      if (newOpenFolders.has(path)) {
        newOpenFolders.delete(path);
      } else {
        newOpenFolders.add(path);
      }
      return newOpenFolders;
    });

    // Fetch folder contents
    socket.emit("folder:read", path);
  };

  useEffect(() => {
    const updateTheme = () => {
      setTheme(localStorage.getItem("editorTheme"));
    };
  
    // Listen for a custom event when localStorage is updated
    const handleStorageChange = () => updateTheme();
    window.addEventListener("editorThemeChange", handleStorageChange);
  
    // Initial theme setting
    updateTheme();
  
    return () => {
      window.removeEventListener("editorThemeChange", handleStorageChange);
    };
  }, []);
  

  if (loading) {
    return <div className="w-64 h-screen bg-gray-100 p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="w-64 h-screen bg-gray-100 p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div
        className="w-100 bg-gray-100 p-4 overflow-auto"
        style={{ height: "95.6%",backgroundColor: theme==="vs-dark" ? "#3c3c3c" : "transparent",color: theme==="vs-dark" ? "white" : "black" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">File Manager</h2>
          <div className="flex space-x-1">
            <button
              onClick={createNewFolder}
              className="p-1 text-yellow-600 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full transition-all duration-200"
              aria-label="Create new folder"
            >
              <FolderPlus className="w-5 h-5" />
            </button>
            <button
              onClick={createNewFile}
              className="p-1 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full transition-all duration-200"
              aria-label="Create new file"
            >
              <FilePlus className="w-5 h-5" />
            </button>
          </div>
        </div>
        {tree ? (
          <FileTree tree={tree} setCurrentPath={setCurrentPath} />
        ) : (
          <p className="text-gray-500">No files or folders to display.</p>
        )}
      </div>
      <div className="w-100 bg-gray-100" style={{backgroundColor: theme==="vs-dark" ? "#3c3c3c" : "transparent"}}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="flex items-center gap-2 px-4 py-2 mx-auto text-white bg-red-500 rounded-lg hover:border-red-600 transition duration-300"
        >
          <i class="bi bi-box-arrow-left"></i>
          <span>Logout</span>
          {/* <LogOut className="w-5 h-5" /> */}
        </button>
      </div>
    </>
  );
  function FileTree({ tree, level = 0, path = "", setCurrentPath, onDelete }) {
    if (!tree || typeof tree !== "object") {
      return null;
    }

    return (
      <ul className={`${level > 0 ? "ml-4" : ""}`} role="tree">
        {Object.entries(tree).map(([key, value]) => (
          // <FileTreeItem key={key} name={key} value={value} level={level} path={path} setCurrentPath={setCurrentPath} />
          <FileTreeItem
            key={key}
            name={key}
            value={value}
            level={0} // Top-level starts at 0
            path="" // Root-level path
            setCurrentPath={setCurrentPath}
            openPaths={openPaths}
            togglePath={togglePath}
          />
        ))}
      </ul>
    );
  }
  function FileTreeItem({
    name,
    value,
    level,
    path,
    openPaths,
    togglePath,
    setCurrentPath,
    onDelete,
  }) {
    const isFolder = value !== null && typeof value === "object";
    var currentPath = path ? `${path}/${name}` : name;
    const isOpen = openPaths[currentPath] || false; // Check if this folder is open

    const handleClick = () => {
      if (isFolder) {
        console.log(currentPath);
        togglePath(currentPath); // Toggle the open state of this folder
        console.log(currentPath);
        if (isOpen) {
          const pathParts = currentPath
            .split("/")
            .filter((part) => part !== ""); // Split and remove empty parts
          pathParts.pop(); // Remove the last part
          currentPath = pathParts.join("/"); // Join back into a string
        }
        setCurrentPath(currentPath);
      } else {
        setCurrentPath(currentPath);
        sessionStorage.setItem("currentPath", currentPath);
        // fetch(`http://localhost:3010/file-data?path=${currentPath}`)
        fetch(`${API_BASE_URL}/api/files/${currentPath}/content`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            dispatch(
              openFile({
                name: name,
                content: data.content || "",
                path: currentPath,
              })
            );
          });
      }
    };

    return (
      <li
        className="my-1 group"
        role="treeitem"
        aria-expanded={isFolder ? isOpen : undefined}
      >
        <div
          className={`flex items-center p-1 rounded hover:bg-gray-200 cursor-pointer ${
            isFolder && isOpen ? "bg-gray-200" : ""
          }`}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          tabIndex={0}
        >
          <div className="flex items-center space-x-2 flex-grow">
            {isFolder ? (
              isOpen ? (
                <ChevronDownIcon
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                />
              ) : (
                <ChevronRightIcon
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                />
              )
            ) : (
              <span className="w-4" />
            )}
            {isFolder ? (
              <FolderIcon
                className="w-5 h-5 text-yellow-500"
                aria-hidden="true"
              />
            ) : (
              <FileIcon className="w-5 h-5 text-blue-500" aria-hidden="true" />
            )}
            <span className="text-sm">{name}</span>
          </div>
          <Trash2Icon
            className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={isFolder ? handleFolderDelete : handleFileDelete}
            aria-hidden="true"
          />
        </div>
        {isFolder && isOpen && (
          <ul className={`${level >= 0 ? "ml-4" : ""}`} role="tree">
            {Object.entries(value).map(([childName, childValue]) => (
              <FileTreeItem
                key={childName}
                name={childName}
                value={childValue}
                level={level + 1}
                path={currentPath}
                openPaths={openPaths}
                togglePath={togglePath}
                setCurrentPath={setCurrentPath}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
}
