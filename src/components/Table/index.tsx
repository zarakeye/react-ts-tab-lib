import { type ChangeEvent, JSX, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type SortType = 'string' | 'number' | 'date' | 'boolean' | 'custom';

export type Column<T> = {
  displayName: string;
  property: keyof T;
  type: SortType;
  renderer?: (value: T[keyof T]) => ReactNode;
  className?: string;
}

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  onRowHover?: (row: T | null) => void;
  columnsClassName?: string;
  rowsClassName?: string;
  cellClassName?: string;
  numberOfDisplayedRows?: number[] | undefined;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table <T extends Record<string, any>>({ columns = [], rows = [], onRowHover, columnsClassName = '', rowsClassName = '', cellClassName = '', numberOfDisplayedRows = [10, 20, 50, 100]}: TableProps<T>): JSX.Element {
  type DisplayedRows_Type = typeof numberOfDisplayedRows[number];
  const [sampleLength, setSampleLength] = useState<DisplayedRows_Type>(numberOfDisplayedRows[0]);
  const [allRows, setAllRows] = useState<T[]>(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [displayedSample, setDisplayedSample] = useState<T[]>([]);
  
  const [hoveredRow, setHoveredRow] = useState<T | null>(null);
  console.log(hoveredRow);

  const ascFilteringButtonRef = useRef<HTMLButtonElement>(null);
  const descFilteringButtonRef = useRef<HTMLButtonElement>(null);

  const columnNameRef = useRef<HTMLDivElement>(null);

  /**
   * Sorts the rows based on the specified property and type in either ascending or descending order.
   *
   * @param e - The mouse event triggered by clicking the sort button.
   * @param property - The property of the row by which to sort.
   * @param type - The type of data to sort (e.g., 'string', 'number', 'date', 'boolean').
   * @param sort - The sort direction, either 'asc' for ascending or 'desc' for descending.
   *
   * This function updates the displayed sample of rows by sorting them according to the provided
   * property and type. It handles different data types by applying appropriate sorting logic.
   * Throws an error if an invalid date is encountered.
   */
  const handleSort = (e: React.MouseEvent<HTMLButtonElement>, property: keyof T, type: SortType, sort: 'asc' | 'desc') => {
    e.preventDefault();

    const arrayOfPropertyValues = rows.map((row) => row[property]);
    if (sort === 'asc') {
      switch (type) {
        case 'string':
          arrayOfPropertyValues.sort((a, b) => a.localeCompare(b));
          break;
        case 'number':
          arrayOfPropertyValues.sort((a, b) => a - b);
          break;
        case 'date':
          arrayOfPropertyValues.sort((a, b) => {
            if (typeof a === 'string' && typeof b === 'string') {
              const dateA = new Date(a);
              const dateB = new Date(b);
              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                throw new Error('Invalid date');
              }
              return new Date(a).getTime() - new Date(b).getTime();
            } else {
              throw new Error('Invalid date');
            }
          });
          break;
        case 'boolean':
          arrayOfPropertyValues.sort((a, b) => a - b);
          break;
      }
    } else if (sort === 'desc') {
      switch (type) {
        case 'string':
          arrayOfPropertyValues.sort((a, b) => b.localeCompare(a));
          break;
        case 'number':
          arrayOfPropertyValues.sort((a, b) => b - a);
          break;
        case 'date':
          arrayOfPropertyValues.sort((a, b) => {
            if (typeof a === 'string' && typeof b === 'string') {
              return new Date(b).getTime() - new Date(a).getTime();
            } else {
              throw new Error('Invalid date type');
            }
          });
          break;
        case 'boolean':
          arrayOfPropertyValues.sort((a, b) => b - a);
          break;
      }
    }

    const sortedRows = arrayOfPropertyValues.map((value) => rows.find((row) => row[property] === value));

    setDisplayedSample(sortedRows as T[]);
  }

  /**
   * Updates the sample length when the user selects a new number of displayed entries.
   * Resets the current page to 1.
   * @param e The event triggered by the user selecting a new number of displayed entries.
   */
  const handleDisplayedEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value);
    setSampleLength(newValue);
    setCurrentPage(1);
  }

  /**
   * Filters the rows based on the search input value.
   *
   * @param e - The change event triggered by the search input field.
   *
   * This function iterates over all rows, concatenates the values of each row into a single
   * string, and checks if this string includes the trimmed and lowercased value from the
   * search input. If it does, the row is added to the searchBaseArray. Updates the state
   * with the filtered rows.
   */
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchBaseArray: T[] = [];
    rows.forEach(row => {
      const mergedRow = Object.values(row).join(' ').toString().toLowerCase().trim();
      if (mergedRow.includes(e.target.value.trim().toLowerCase())) {
        searchBaseArray.push(row);
      }
    });

    setAllRows(searchBaseArray);
    setCurrentPage(1);
  }
  
  /**
   * Generates an array of page numbers for the pagination component.
   * 
   * The array will contain the first page number, the last page number, and the current page number, 
   * as well as the two page numbers before and after the current page number. 
   * If the total number of pages is greater than 5, the array will also contain the string '...' 
   * to indicate that there are more pages.
   *
   * @param current - The current page number.
   * @param total - The total number of pages.
   * 
   * @returns An array of page numbers and/or the string '...'.
   */
  const generatePagesNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 1) return [];
    
    const delta = 2;
    const pages = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (i === current - delta - 1 || i === current + delta + 1) {
        pages.push('...');
      }
    }

    return pages.filter((page, index, array) => array.indexOf(page) === index)
  }

  useEffect(() => {
    const newPagesNumber = Math.ceil(allRows.length / sampleLength);
    setPagesNumber(newPagesNumber);

    if (currentPage > newPagesNumber) {
      setCurrentPage(newPagesNumber > 0 ? newPagesNumber : 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRows.length, sampleLength]);

  useEffect(() => {
    const startIndex = sampleLength * (currentPage - 1);
    const endIndex = startIndex + sampleLength;
    setDisplayedSample(allRows.slice(startIndex, endIndex))
  }, [allRows, currentPage, sampleLength])

  const pagesNumbers = useMemo(
    () => generatePagesNumbers(pagesNumber, currentPage),
    [currentPage, pagesNumber]
  );

  return (
    <div>
      <div className='flex justify-between mt-5 mb-2.5'>
        <div>
          <select
            name="sampleLength"
            id="sampleLength"
            onChange={handleDisplayedEntriesChange}
            className='border-1 border-black rounded-[5px] mr-1.5'
          >
            {numberOfDisplayedRows.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <label htmlFor="sampleLength">displayed entries</label>
        </div>

        <div>
          <label htmlFor="search">Search</label>
          <input type="text" name="search" id="search" placeholder='Search' className='ml-1.5 border-1 border-black rounded-[5px]' onChange={(e) => handleSearch(e)}/>
        </div>
      </div>
      
      <table className='w-full' role='table'>
        <thead>
          <tr className={columnsClassName} role='row'>
            {columns.map((key, index) => (
              <th 
                key={index}
                role='columnheader'
                style={{ width: `${100 / columns.length}%` }}
                className={`px-[10px] py-[5px] border-y-2 border-x-2 align-top ${key.className} first:border-l-2 fisrt:border-r-0 last:border-l-0 last:border-r-2`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center w-[100%] h-[55px]'>
                    <p
                      ref={columnNameRef}
                      className='mr-2 flex-1 cursor-pointer'
                    >
                      {key.displayName}
                    </p>
                    <div className='flex flex-col gap-1'>
                      <button
                        type='button'
                        ref={ascFilteringButtonRef}
                        onClick={(e) => handleSort(e, key.property, key.type, 'asc')}
                        className='cursor-pointer'
                        role='button'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#175729">
                          <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                        </svg>
                      </button>
                      <button
                        type='button'
                        ref={descFilteringButtonRef}
                        onClick={(e) => handleSort(e, key.property, key.type, 'desc')}
                        className='cursor-pointer'
                        role='button'
                      >
                        <svg className='rotate-180' xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#175729">
                          <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='pb-2.5'>
          {displayedSample.map((row: T, rowIndex: number): ReactNode => (
            <tr
              key={rowIndex}
              role='row'
              onMouseEnter={() => {
                setHoveredRow(row);
                if (onRowHover) {
                  onRowHover(row);
                }
              }}
              onMouseLeave={() => {
                setHoveredRow(null);
                if (onRowHover) {
                  onRowHover(null);
                }
              }}
              className={rowsClassName}
            >
              {columns.map((column, colIndex) => (
                <td title={`id: ${row.id}`}
                  key={colIndex}
                  role='cell'
                  className={`px-[15px] truncate ${cellClassName}`}
                  style={{ width: `${100 / columns.length}%` }}
                >
                  {columns[colIndex].renderer ? columns[colIndex].renderer(row[column.property]) : row[column.property] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-between mt-5'>
        <p>Showing entries {sampleLength * (currentPage - 1) + 1} to {Math.min(sampleLength * currentPage, allRows.length)} of {allRows.length} entries</p>

        <div className='flex items-center gap-2'>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Previous page'
          >
            Previous
          </button>

          {pagesNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border hover:bg-gray-100'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span key={index} className='px-2'>
                ...
              </span>
            )
          )}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagesNumber}
            className='px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Next page'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;

