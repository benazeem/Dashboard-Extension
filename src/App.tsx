import MainLayout from './layouts/MainLayout'
import "./App.css";
import useMainLayout from './hooks/useMainLayout'
import CompilerTool from './layouts/CompilerTool';

function App() {

  const { mainLayout } = useMainLayout();

  const renderAppContent = () => {
    switch (mainLayout) {
        case 'main-app-layout':
            return <MainLayout/>;
        case 'code-editor':
            return <CompilerTool/>;    
            default:
                return <MainLayout/>;
    }
};


  return (
    <>
     {renderAppContent()}
    </>
  )
}

export default App