import Footer from './components/Footer'
import Pages from './components/Pages'
import TopBar from './components/TopBar'

function App(): React.JSX.Element {
  return (
    <div className="flex flex-col w-full justify-between bg-amber-100">
      <TopBar />
      <Pages />
      <Footer />
    </div>
  )
}

export default App
