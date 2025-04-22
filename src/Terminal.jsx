import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import socket from "./Socket";
function Terminal() {
  const terminalRef = useRef();
  const basePath = "PS D:\\Projects\\Cloud IDE\\Users\\";
  // const [command, setCommand] = useState("");
  var commandBuffer = ""
  useEffect(() => {
    const term = new XTerminal({
      rows: 40,
      cols: 100,
    });
    term.open(terminalRef.current);

    const formatPath = (fullPath) => {
      const basePath = "PS D:\\Projects\\Cloud IDE\\Users";
      // console.log(fullPath+" :::")
      if (fullPath.includes(basePath + '>')) {
        // return fullPath.slice(3); // Replace base path with ~ and keep the backslash
        return fullPath.replace(basePath, "~\\"); // Replace base path with ~ and keep the backslash
      } else if (fullPath.includes(basePath)) {
        return fullPath.replace(basePath, "~"); // Replace base path with ~ and keep the backslash
      }
      return fullPath;
    };


    term.onData((data) => {
      console.log(data);
      if (data === "\r") { // Enter key pressed
        if(commandBuffer === "cls"){
          term.clear();
          return;
        }
        else{
          socket.emit("terminal:write", commandBuffer); // Emit the command buffer
          term.write("\r\n")
          commandBuffer = ""; // Clear buffer after sending
        }

        // console.log("Before emit - commandBuffer:", commandBuffer); // Debug log
        // socket.emit("terminal:write", commandBuffer); // Emit the command buffer
        // console.log("After emit - commandBuffer:", commandBuffer); // Debug log
        // commandBuffer = ""; // Clear buffer after sending
        // console.log("After clear - commandBuffer:", commandBuffer); // Debug log
        // term.clear();
      } else if (data === "\x7f") { // Backspace character
        if (commandBuffer.length > 0) {
          // Remove last character from command buffer
          commandBuffer = commandBuffer.slice(0, -1);
          // console.log("Backspace character")
          // Move cursor back, overwrite with space, and move cursor back again
          term.write("\b \b");
        }
      } else {
        // var com = commandBuffer + data;
        commandBuffer += data; // Accumulate characters
        // console.log("com : "+com);
        // setCommand(commandBuffer);
        term.write(commandBuffer.charAt(commandBuffer.length - 1));
        // if(data !== "cls") term.write(data);
        console.log(commandBuffer); // This should show the accumulated buffer
      }
    });

    socket.on("terminal:output", data => {
      // var output = data.trim(); // Remove any trailing spaces or newlines
      var output = data; // Remove any trailing spaces or newlines
      // term.write("\r\n" + output); 
      if (output.includes("D:\\Projects\\Cloud IDE\\Users")) {
        // console.log("Output : "+output)
        output = formatPath(output); // Format paths in the output
        // console.log(output)
      }
      term.write(output+"\r\n");
      // term.write(data)
    });

  }, []);
  return (
    <>
      <div ref={terminalRef} id="terminal" />
    </>
  );
}
export default Terminal;
