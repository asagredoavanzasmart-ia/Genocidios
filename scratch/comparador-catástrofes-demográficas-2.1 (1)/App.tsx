import React from 'react';
import { ComparisonTool } from './components/ComparisonTool';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-500/30">
      <ComparisonTool />
    </div>
  );
};

export default App;