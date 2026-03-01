import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route }from 'react-router'
import './index.css'
import App from './App.jsx'
import Examples from './pages/Examples.jsx'
import Example1 from './pages/Example1.jsx'
import Example2 from './pages/Example2.jsx'
import Example3 from './pages/Example3.jsx'
import Example4 from './pages/Example4.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />}/>
        <Route path="examples" element={<Examples />} >
          <Route path="example1" element={<Example1 />} />
          <Route path="example2" element={<Example2 />} />
          <Route path="example3" element={<Example3 />} />
          <Route path="example4" element={<Example4 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
