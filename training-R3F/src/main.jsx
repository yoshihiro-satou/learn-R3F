import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route }from 'react-router'
import './index.css'
import App from './App.jsx'
import Examples from './pages/Examples.jsx'
import Example1 from './pages/Example1.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />}/>
        <Route path="examples" element={<Examples />} >
          <Route index element={<Example1 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
