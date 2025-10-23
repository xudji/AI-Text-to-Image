import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Generate from './pages/Generate'
import Gallery from './pages/Gallery'
import SystemStatus from './pages/SystemStatus'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/status" element={<SystemStatus />} />
      </Routes>
    </Layout>
  )
}

export default App
