import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Generate from './pages/Generate'
import Gallery from './pages/Gallery'
import APITest from './pages/APITest'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/generate" replace />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/test" element={<APITest />} />
      </Routes>
    </Layout>
  )
}

export default App
