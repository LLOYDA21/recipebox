import { StrictMode, useState, Component } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import Splash from "@/components/Splash"

// Catches crashes and shows the error on screen instead of a blank page
class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ padding: 16, color: "red", whiteSpace: "pre-wrap" }}>
          {String(this.state.error.stack || this.state.error)}
        </pre>
      )
    }
    return this.props.children
  }
}

// Shows the splash logo first. Clicking it loads the app.
function Root() {
  const [entered, setEntered] = useState(false)
  return entered ? <App /> : <Splash onEnter={() => setEntered(true)} />
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>
)