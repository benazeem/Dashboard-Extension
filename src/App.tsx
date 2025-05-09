import MainLayout from "./layouts/MainLayout";
import "./App.css";
import useMainLayout from "./hooks/useMainLayout";
import CompilerTool from "./layouts/CompilerTool";
import Whiteboard from "./layouts/Whiteboard";
import ColorPicker from "./layouts/ColorPicker";
import CodeEditor from "./layouts/CodeEditor";

function App() {
  const { mainLayout } = useMainLayout();

  const renderAppContent = () => {
    switch (mainLayout) {
      case "main-app-layout":
        return <MainLayout />;
      case "compiler":
        return <CompilerTool />;
      case "white-board":
        return <Whiteboard />;
      case "color-picker":
        return <ColorPicker />;
        case "code-editor":
        return <CodeEditor />;
      default:
        return <MainLayout />;
    }
  };

  return <>{renderAppContent()}</>;
}

export default App;
