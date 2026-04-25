function App(): React.JSX.Element {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="flex w-full flex-1">
        <aside className="bg-gray-400 h-full w-50 flex flex-col ">
          <h1>KitchApp</h1>
          <ul className="h-full">
            <li>Dashboard</li>
            <li>Dishes</li>
            <li>Products</li>
            <li>Orders</li>
            <li>Storage</li>
            <li className="mt-auto">Settings</li>
            <li>Logout</li>
          </ul>
        </aside>
        <section className="flex-1 bg-green-100 h-full overflow-auto">asd</section>
      </div>
      <footer>footer</footer>
    </div>
  )
}

export default App
