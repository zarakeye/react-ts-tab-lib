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
  interface RowData {
    id: number;
    name: string;
    age: number;
    dateOfBirth: string;
    isActive: boolean;
  }
  
  const columns: Column<RowData>[] = [
    {
      displayName: "ID",
      property: "id",
      type: "number",
    },
    {
      displayName: "Name",
      property: "name",
      type: "string",
    },
    {
      displayName: "Age",
      property: "age",
      type: "number",
    },
    {
      displayName: "Date of Birth",
      property: "dateOfBirth",
      type: "date",
    },
    {
      displayName: "Active",
      property: "isActive",
      type: "boolean",
    },
  ];
  
  const rows: RowData[] = [
    {
      id: 1,
      name: "John",
      age: 30,
      dateOfBirth: "1990-01-01",
      isActive: true,
    },
    {
      id: 2,
      name: "Jane",
      age: 25,
      dateOfBirth: "1995-01-01",
      isActive: false,
    },
    {
      id: 3,
      name: 'Alice',
      age: 25,
      dateOfBirth: '1998-01-01',
      isActive: true
    },
    {
      id: 4,
      name: 'Bob',
      age: 30,
      dateOfBirth: '1993-05-15',
      isActive: false
    },
    {
      id: 5,
      name: 'Charlie',
      age: 35,
      dateOfBirth: '1988-07-10',
      isActive: true
    },
    {
      id: 6,
      name: 'David',
      age: 40,
      dateOfBirth: '1983-09-05',
      isActive: false
    },
    {
      id: 7,
      name: 'Eve',
      age: 45,
      dateOfBirth: '1978-11-30',
      isActive: true
    },
    {
      id: 8,
      name: 'Frank',
      age: 50,
      dateOfBirth: '1973-01-25',
      isActive: false
    },
    {
      id: 9,
      name: 'Grace',
      age: 55,
      dateOfBirth: '1968-03-20',
      isActive: true
    },
    {
      id: 10,
      name: 'Henry',
      age: 60,
      dateOfBirth: '1963-05-15',
      isActive: false
    },
    {
      id: 11,
      name: 'Ivy',
      age: 65,
      dateOfBirth: '1958-07-10',
      isActive: true
    },
    {
      id: 12,
      name: 'Jack',
      age: 70,
      dateOfBirth: 'Invalid Date',
      isActive: false
    }
  ];

  return <Table columns={columns} rows={rows} defaultSort={{ property: 'name', sort: 'asc' }}/>
}

export default App;
