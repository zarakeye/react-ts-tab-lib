import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Table, { type Column } from ".";

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
    renderer: (value) => (value ? "true" : "false"),
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
    dateOfBirth: '1953-09-05',
    isActive: false
  }
];

describe("Table test suite", () => {
  afterEach(cleanup);

  // Tests for ascending and descending order
  columns.forEach((column) => {
    it(`should sort the table by ${column.displayName} in ascending order`, () => {
      render(<Table columns={columns} rows={rows} />);

      const columnHeader = screen.getByText(column.displayName);
      const sortAscButton = within(columnHeader.closest("th")!).getAllByRole("button")[0];
      fireEvent.click(sortAscButton);

      const dataRows = screen.getAllByRole("row").slice(1);
      const sortedRows = dataRows.map(row => {
        const cell = within(row).getAllByRole("cell")[columns.findIndex(col => col.property === column.property)];
        return cell.textContent;
      });

    
      const expectedValues = [...rows]
        .sort((a, b) => {
          const valueA = a[column.property];
          const valueB = b[column.property];
          if (column.type === 'string') {
            return String(valueA).localeCompare(String(valueB));
          } else if (column.type === 'number') {
            return Number(valueA) - Number(valueB);
          } else if (column.type === 'date') {
            return new Date(String(valueA)).getTime() - new Date(String(valueB)).getTime();
          } else if (column.type === 'boolean') {
            return Number(valueA) - Number(valueB);
          } else {
            return 0;
          }
        })
        .map(item => String(item[column.property]));

      expect(sortedRows).toEqual(expectedValues);
    });

    it(`should sort the table by ${column.displayName} in descending order`, () => {
      render(<Table columns={columns} rows={rows} />);

      const columnHeader = screen.getByText(column.displayName);
      const sortDescButton = within(columnHeader.closest("th")!).getAllByRole("button")[1];
      fireEvent.click(sortDescButton);

      const dataRows = screen.getAllByRole("row").slice(1);
      const sortedRows = dataRows.map(row => {
        const cell = within(row).getAllByRole("cell")[columns.findIndex(col => col.property === column.property)];
        return cell.textContent;
      });

      const expectedValues = [...rows]
        .sort((a, b) => {
          const valueA = a[column.property];
          const valueB = b[column.property];
          if (column.type === 'string') {
            return String(valueB).localeCompare(String(valueA));
          } else if (column.type === 'number') {
            return Number(valueB) - Number(valueA);
          } else if (column.type === 'date') {
            return new Date(String(valueB)).getTime() - new Date(String(valueA)).getTime();
          } else if (column.type === 'boolean') {
            return Number(valueB) - Number(valueA);
          } else {
            return 0;
          }
        })
        .map(item => String(item[column.property]));

      expect(sortedRows).toEqual(expectedValues);
    })

    it ('should filter the table rows based on the search input', () => {
      render(<Table columns={columns} rows={rows} />);

      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'Jack' } });

      const rowsWithJack = screen.getAllByRole('row').slice(1);
    
      expect(rowsWithJack.length).toBe(1);
      expect(screen.getByText('Jack')).toBeInTheDocument();

      expect(screen.queryByText('Ivy')).not.toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: '25' } });

      const rowsWith25 = screen.getAllByRole('row').slice(1);

      expect(rowsWith25.length).toBe(3);

      expect(screen.queryByText('Jane')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Frank')).toBeInTheDocument();
      expect(screen.queryByText('Ivy')).not.toBeInTheDocument();
    })
  });

  // it('should display ', () => {)
});