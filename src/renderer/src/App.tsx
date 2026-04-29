import AppSidebar from './components/AppSidebar'
import Footer from './components/Footer'
import Pages from './components/Pages'
import TopBar from './components/TopBar'

function App(): React.JSX.Element {
  return (
    <>
      <AppSidebar />
      <div className="flex flex-col w-full justify-between bg-background">
        <TopBar />
        <Pages />
        <Footer />
      </div>
    </>
  )
}

export default App
