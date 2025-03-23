import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Table, { type Column } from "./Table";

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

      const columnHeaders = screen.getAllByRole('columnheader');
      const columnHeader = columnHeaders.find(header => header.textContent === column.displayName);

      if (!columnHeader) {
        throw new Error(`Column header for ${column.displayName} not found`);
      }

      const sortAscButton = within(columnHeader).getAllByRole("button")[0];
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
        .map(item => String(item[column.property])).slice(0, 10);

      expect(sortedRows).toEqual(expectedValues);
    });

    it(`should sort the table by ${column.displayName} in descending order`, () => {
      render(<Table columns={columns} rows={rows} />);

      
      const columnHeaders = screen.getAllByRole('columnheader');
      const columnHeader = columnHeaders.find(header => header.textContent === column.displayName);

      if (!columnHeader) {
        throw new Error(`Column header for ${column.displayName} not found`);
      }
      
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
        .map(item => String(item[column.property])).slice(0, 10);

      expect(sortedRows).toEqual(expectedValues);
    })

    it ('should filter the table rows based on the search input', async () => {
      render(<Table columns={columns} rows={rows} />);

      const searchInput = screen.getByLabelText('Search').closest('input')!;

      // Search for "Jack"
      fireEvent.change(searchInput, { target: { value: 'Jack' } });

      await waitFor(() => {
        expect(screen.getByText('Jack')).toBeInTheDocument();
        expect(screen.getAllByRole('row').length).toBe(2);
      });

      // Search for "25"
      fireEvent.change(searchInput, { target: { value: '25' } });

      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(4);
        expect(screen.queryByText('Jane')).toBeInTheDocument();
        expect(screen.queryByText('Alice')).toBeInTheDocument();
        expect(screen.queryByText('Frank')).toBeInTheDocument();
      });
      expect(screen.getAllByRole('row').length).toBe(4);
    })
  });

  it('should throw error when invalid string dates are sorted in ascending order', async () => {
    const errorRows = [
      { id: 13, name: 'Kate', age: 75, dateOfBirth: 'Invalid Date', isActive: true },
      { id: 14, name: 'Kevin', age: 80, dateOfBirth: 'Bad Date', isActive: false }
    ];

    const originalError = console.error; // console Mock
    console.error = vi.fn().mockImplementation(() => {});

    const { unmount } = render(<Table columns={columns} rows={errorRows} />);

    const header = screen.getByText('Date of Birth').closest('th')!;
    const ascSortButton = within(header).getAllByRole('button')[0];
    
    await act(async () => {
      fireEvent.click(ascSortButton);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Invalid date');
    });

    unmount();
    console.error = originalError;
  });

  it('should throw error when invalid non-string dates are sorted in ascending order', async () => {
    const errorRows = [
      { id: 13, name: 'Kate', age: 75, dateOfBirth: 'Invalid Date', isActive: true },
      { id: 14, name: 'Kevin', age: 80, dateOfBirth: 'Bad Date', isActive: false }
    ];

    const originalError = console.error; // console Mock
    console.error = vi.fn().mockImplementation(() => {});

    const { unmount } = render(<Table columns={columns} rows={errorRows} />);

    const header = screen.getByText('Date of Birth').closest('th')!;
    const ascSortButton = within(header).getAllByRole('button')[0];
    
    await act(async () => {
      fireEvent.click(ascSortButton);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Invalid date'
      );
    });

    unmount();
    console.error = originalError;
  });

  describe("handling of changes of displayed rows number", () => {
    const mockRows = Array.from({ length: 250 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

    const columns: Column<typeof mockRows[number]>[] = [
      { displayName: "ID", property: "id", type: "number" },
    ];

    it('should update displaayed entries count and reset pagination', async () => {
      render(<Table columns={columns} rows={mockRows} rangeLengthOptions={[10, 20, 50]} />);

      expect(screen.getByText('Showing entries 1 to 10 of 250 entries')).toBeInTheDocument();

      const select = screen.getByLabelText('displayed entries');
      fireEvent.change(select, { target: { value: 20 } });

      await waitFor(() => {
        expect(screen.getByText('Showing entries 1 to 20 of 250 entries')).toBeInTheDocument();
        expect(screen.getAllByRole('row').length - 1).toBe(20);
      });
    });

    it('should always reset to first page when changing entries count', async () => {
      render(<Table columns={columns} rows={mockRows} />);

      // Go to page 2
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      expect(screen.getByText('Showing entries 11 to 20 of 250 entries')).toBeInTheDocument();

      // Change entries count
      const select = screen.getByLabelText('displayed entries');
      fireEvent.change(select, { target: { value: 10 } });

      await waitFor(() => {
        expect(screen.getByText('Showing entries 1 to 10 of 250 entries')).toBeInTheDocument();
        expect(screen.getAllByRole('row').length - 1).toBe(10);
      });
    });
  });
});
