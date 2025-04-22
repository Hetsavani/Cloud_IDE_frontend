
import CodeEditor from "../Components/Editor/Editor.js";
import Terminal from "../Terminal";
import "./Layout.css";
import Files from "../Components/Files/Files.js";
import { Provider } from "react-redux";
import { store } from "../redux/store";

function Layout() {
  return (
    <>
      {/* <h1>Layout</h1> */}
      <div className="playground">
        <Provider store={store}>
          <div className="Editor-container d-flex justify-content-spaceBetween">
            <div className="files" style={{width:"15%"}}>
              <Files />
            </div>
            <div className="editor" style={{width:"85%"}}>
              <CodeEditor />
            </div>
          </div>
        </Provider>
        <div>
          {/* <Terminal /> */}
        </div>
      </div>
    </>
  );
}
export default Layout;
