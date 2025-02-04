// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Table from './components/Table/index.jsx'
import type { Column } from './components/Table/index.jsx'

export interface Employee {
  id: string;
  firstName: string;
}

function App() {
  const columns: Column<Employee>[] = [
    {
      displayName: 'ID',
      property: 'id',
      filter: 'default',
      type: 'string'
    },
    {
      displayName: 'Prénom',
      property: 'firstName',
      filter: 'default',
      type: 'string'
    }
  ]

  const rows: Employee[] = [
    {
      firstName: 'David',
      id: '2'
    },
    {
      firstName: 'Léo',
      id: '1'
    },
  ]

  return (
    <>
      <Table columns={columns} rows={rows} />
    </>
  )
}

export default App
