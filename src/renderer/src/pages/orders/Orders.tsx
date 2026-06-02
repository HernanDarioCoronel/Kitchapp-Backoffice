import { JSX, useState } from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import { ViewMode } from './orderTypes'
import NewOrderView from './components/NewOrderView'
import OrdersListView from './components/OrdersListView'

function Orders(): JSX.Element {
  const [view, setView] = useState<ViewMode>('new-order')

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-background">
        <Button
          variant={view === 'new-order' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('new-order')}
        >
          <Plus size={16} className="mr-1" />
          Nueva orden
        </Button>
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('list')}
        >
          <ClipboardList size={16} className="mr-1" />
          Órdenes
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {view === 'new-order' ? (
          <NewOrderView onOrderSent={() => setView('list')} />
        ) : (
          <OrdersListView />
        )}
      </div>
    </div>
  )
}

export default Orders
