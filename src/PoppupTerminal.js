import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

const XtermTerminal = ({ output, onClose }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    // Attach terminal to the DOM element
    terminal.open(terminalRef.current);

    // Display the output in the terminal
    if (output) {
      terminal.writeln(output);
    }

    return () => {
      terminal.dispose(); // Clean up terminal instance on unmount
    };
  }, [output]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>Console</span>
        <button onClick={onClose} style={styles.closeButton}>
          ✖
        </button>
      </div>
      <div ref={terminalRef} style={styles.terminal}></div>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "10%",
    left: "10%",
    right: "10%",
    backgroundColor: "#1e1e1e",
    border: "1px solid #444",
    borderRadius: "5px",
    zIndex: 1000,
    padding: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #444",
    paddingBottom: "5px",
    marginBottom: "5px",
  },
  closeButton: {
    background: "transparent",
    color: "#f1f1f1",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  terminal: {
    height: "300px",
    overflow: "hidden",
  },
};

export default XtermTerminal;