import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Editor />
    </div>
  );
}

export default App;
