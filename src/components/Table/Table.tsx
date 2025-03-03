import { type ChangeEvent, JSX, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
// import type { Column, DefaultOrderType, OrderType, TableProps, TextContentType, DataType } from './types.js';
import '../../index.css';

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'custom';
export type OrderType = 'asc' | 'desc';
export type DefaultOrderType<T> = {
  property: keyof T;
  order: OrderType;
}
export type TextContentType = {
  searchLabel: string | null;
  displayedEntriesLabel: string | null;
  emptyTableText: string | null;
  paginationTextContent: (sampleBegin: number, sampleEnd: number, sampleLength: number) => string | null;
  previousPageButtonLabel: string | null;
  nextPageButtonLabel: string | null;
}

export type Column<T> = {
  property: keyof T;
  displayName?: string;
  type: DataType;
  renderer?: (value: T[keyof T]) => ReactNode;
  specificColumnclassName?: string;
}

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  onRowHover?: (row: T | null) => void;
  onRowClick?: (row: T | null) => void;
  componentGlobalClassname?: string;
  globalColumnsClassname?: string;
  sortButtonClassname?: {
    style: string;
    color: string;
  };
  rowsClassname?: string;
  currentPagePaginationButtonClassname?: string;
  pagesPaginationButtonsClassname?: string;
  paginationNavButtonsClassname?: string;
  cellClassName?: string;
  numberOfDisplayedRows?: number[] | undefined;
  defaultOrder?: DefaultOrderType<T> | null;
  textContent?: TextContentType | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table <T extends Record<string, any>>({
  columns = [],
  rows = [],
  onRowHover,
  onRowClick,
  componentGlobalClassname = '',
  globalColumnsClassname = '',
  sortButtonClassname = { style: '', color: ''},
  rowsClassname = '',
  currentPagePaginationButtonClassname,
  pagesPaginationButtonsClassname,
  paginationNavButtonsClassname,
  cellClassName = '',
  numberOfDisplayedRows = [10, 20, 50, 100],
  defaultOrder= null,
  textContent = null
}: TableProps<T>): JSX.Element {
  type DisplayedRows_Type = typeof numberOfDisplayedRows[number];
  const [sampleLength, setSampleLength] = useState<DisplayedRows_Type>(numberOfDisplayedRows[0]);
  const [allRows, setAllRows] = useState<T[]>(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [displayedSample, setDisplayedSample] = useState<T[]>([]);
  const [activeOrder, setActiveOrder] = useState<{ property: keyof T; order: OrderType } | null>(defaultOrder);
  
  const [hoveredRow, setHoveredRow] = useState<T | null>(null);
  console.log(hoveredRow);

  const ascFilteringButtonRef = useRef<HTMLButtonElement>(null);
  const descFilteringButtonRef = useRef<HTMLButtonElement>(null);

  const columnHeaderRef = useRef<HTMLTableCellElement>(null);
  const columnNameRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (defaultOrder) {
      const valuesOfFilteredProperty = allRows.map((row) => row[defaultOrder.property]);
      console.log('valuesOfFilteredProperty', valuesOfFilteredProperty);
      
      if (defaultOrder.order === 'asc') {
        const col = columns.find((column) => column.property === defaultOrder.property);
        if (col) {
          if (defaultOrder.order === 'asc') {
            switch (col.type) {
              case 'string':
                valuesOfFilteredProperty.sort((a, b) => a.localeCompare(b));
                break;
              case 'number':
                valuesOfFilteredProperty.sort((a, b) => a - b);
                break;
              case 'date':
                valuesOfFilteredProperty.sort((a, b) => {
                  if (typeof a === 'string' && typeof b === 'string') {
                    const dateA = new Date(a);
                    const dateB = new Date(b);
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                      console.error('Invalid date');
                      return 0;
                    }
                    return new Date(a).getTime() - new Date(b).getTime();
                  } else {
                    console.error('Invalid date');
                    return 0;
                  }
                });
                break;
              case 'boolean':
                valuesOfFilteredProperty.sort((a, b) => a - b);
                break;
              default:
                console.error('Invalid type');
                break;
            }
          } else if (defaultOrder.order === 'desc') {
            switch (col.type) {
              case 'string':
                valuesOfFilteredProperty.sort((a, b) => b.localeCompare(a));
                break;
              case 'number':
                valuesOfFilteredProperty.sort((a, b) => b - a);
                break;
              case 'date':
                valuesOfFilteredProperty.sort((a, b) => {
                  if (typeof a === 'string' && typeof b === 'string') {
                    const dateA = new Date(a);
                    const dateB = new Date(b);
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                      console.error('Invalid date');
                      return 0;
                    }
                    return new Date(b).getTime() - new Date(a).getTime();
                  } else {
                    console.error('Invalid date');
                    return 0;
                  }
                });
                break;
              case 'boolean':
                valuesOfFilteredProperty.sort((a, b) => b - a);
                break;
              default:
                console.error('Invalid type');
                break;
            }
          }
        }
      }

      const sortedRows: T[] = [];
      valuesOfFilteredProperty.forEach((value) => {
        const row = allRows.find((row) => row[defaultOrder.property] === value);
        if (row) {
          sortedRows.push(row);
        }
      });

      setAllRows(sortedRows);
      setDisplayedSample(allRows);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

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
  const handleSort = (e: React.MouseEvent<HTMLButtonElement>, property: keyof T, type: DataType, order: OrderType) => {
    e.preventDefault();

    const valuesOfFilteredProperty = rows.map((row) => row[property]);
    if (order === 'asc') {
      switch (type) {
        case 'string':
          valuesOfFilteredProperty.sort((a, b) => a.localeCompare(b));
          break;
        case 'number':
          valuesOfFilteredProperty.sort((a, b) => a - b);
          break;
        case 'date':
          valuesOfFilteredProperty.sort((a, b) => {
            if (typeof a === 'string' && typeof b === 'string') {
              const dateA = new Date(a);
              const dateB = new Date(b);
              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                console.error('Invalid date');
                return 0;
              }
              return new Date(a).getTime() - new Date(b).getTime();
            } else {
              console.error('Invalid date');
              return 0;
            }
          });
          break;
        case 'boolean':
          valuesOfFilteredProperty.sort((a, b) => a - b);
          break;
      }

      setActiveOrder({ property, order });
    } else if (order === 'desc') {
      switch (type) {
        case 'string':
          valuesOfFilteredProperty.sort((a, b) => b.localeCompare(a));
          break;
        case 'number':
          valuesOfFilteredProperty.sort((a, b) => b - a);
          break;
        case 'date':
          valuesOfFilteredProperty.sort((a, b) => {
            if (typeof a === 'string' && typeof b === 'string') {
              return new Date(b).getTime() - new Date(a).getTime();
            } else {
              throw new Error('Invalid date type');
            }
          });
          break;
        case 'boolean':
          valuesOfFilteredProperty.sort((a, b) => b - a);
          break;
      }

      setActiveOrder({ property, order });
    }

    const sortedRows = valuesOfFilteredProperty.map((value) => rows.find((row) => row[property] === value));

    setAllRows(sortedRows as T[]);
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
    
    const delta = 1;
    const pages = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (i !== 1 && i <= current - delta - 1 || i !== total && i >= current + delta + 1) {
        pages.push('...');
      }
    }

    const uniquePages = [] as (number | string)[];
    for (let i = 0; i < pages.length; i++) {
      if (pages[i] !== '...') {
        uniquePages.push(pages[i]);
      } else if (pages[i] === '...' && pages[i - 1] !== '...') {
        uniquePages.push(pages[i]);
      }
    }

    return uniquePages;
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
    () => generatePagesNumbers(currentPage, pagesNumber),
    [currentPage, pagesNumber]
  );

  return (
    <div className={componentGlobalClassname ?? 'my-5'}>
      <div className='flex justify-between my-5'>
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
          <label htmlFor="sampleLength" className='ml-2.5 '>
            {textContent?.displayedEntriesLabel ??'displayed entries'}
          </label>
        </div>

        <div>
          <label htmlFor="search" className='mr-2.5'>
            {textContent?.searchLabel ?? 'Search'}
          </label>
          <input type="text" name="search" id="search" className='ml-1.5 border-1 border-black rounded-[5px]' onChange={(e) => handleSearch(e)}/>
        </div>
      </div>
      
      <table className='w-full' role='table'>
        <thead>
          <tr className={globalColumnsClassname} role='row'>
            {columns.map((key, index) => (
              <th 
                key={index}
                role='columnheader'
                style={{ width: `${100 / columns.length}%` }}
                className={`${globalColumnsClassname} px-[20px] py-[20px] h-[100px] border-y-2 border-x-2 align-middle first:border-l-2 fisrt:border-r-0 last:border-l-0 last:border-r-2 ${key.specificColumnclassName ?? ''}`}
                ref={columnHeaderRef}
              >
                <div className='flex justify-between items-center gap-2.5'>
                  <div className='flex t items-center w-[100%] h-[55px]'>
                    <p
                      ref={columnNameRef}
                      className='flex-1 cursor-pointer'
                    >
                      {key.displayName ? key.displayName : String(key.property)}
                    </p>
                    <div className='flex flex-col justify-between gap-2.5'>
                      <button
                        type='button'
                        ref={ascFilteringButtonRef}
                        onClick={(e) => handleSort(e, key.property, key.type, 'asc')}
                        className={`cursor-pointer w-[24px] h-[24px] transition duration-500 hover:scale-175 hover:blur-[.6px] m-[5px] ${activeOrder?.property === key.property && activeOrder?.order === 'asc' ? 'scale-200 blur-[.6px]' : 'scale-100'}`}
                        role='button'
                        aria-label='ascending order button'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -960 960 960" fill={sortButtonClassname.color ? sortButtonClassname.color : '#000'} >
                          <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                        </svg>
                      </button>
                      <button
                        type='button'
                        ref={descFilteringButtonRef}
                        onClick={(e) => handleSort(e, key.property, key.type, 'desc')}
                        className={`cursor-pointer w-[24px] h-[24px] transition duration-500 hover:scale-175 hover:blur-[.6px] m-[5px] ${activeOrder?.property === key.property && activeOrder?.order === 'desc' ? 'scale-200 blur-[.6px]' : 'scale-100'}`}
                        role='button'
                        aria-label='descending order button'
                      >
                        <svg className='rotate-180' xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -960 960 960" fill={sortButtonClassname.color ? sortButtonClassname.color : '#000'}>
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
          {displayedSample.length > 0
            ? displayedSample.map((row: T, rowIndex: number): ReactNode => (
              <tr
                key={rowIndex}
                ref={rowRef}
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
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row);
                  }
                }}
                className={rowsClassname ?? ''}
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
              ))
            : (
              <tr
                role='row'
                className={rowsClassname ?? ''}
                ref={rowRef}
              >
                <td colSpan={columns.length} className='text-center py-[10px]'>
                  No data available in table
                </td>
              </tr>
            )}
        </tbody>
      </table>

      <div className='flex justify-between mt-5'>
        {rows.length > 0 && (
          <p>
            {
              textContent?.paginationTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
              ?? `Showing entries ${sampleLength * (currentPage - 1) + 1} to ${Math.min(sampleLength * currentPage, allRows.length)} of ${allRows.length} entries`
            }
          </p>
        )}

        <div className='flex items-center gap-2'>
          {currentPage - 1 >= 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={paginationNavButtonsClassname ?? 'px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed'}
              aria-label='Previous page'
            >
              {textContent?.previousPageButtonLabel ?? 'Previous'}
            </button>
          )}
          

          {pagesNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? currentPagePaginationButtonClassname ?? 'bg-blue-600 text-white '
                    : pagesPaginationButtonsClassname ?? 'border hover:bg-gray-100'
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

          {currentPage + 1 <= pagesNumber && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className={paginationNavButtonsClassname ?? 'px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed'}
              aria-label='Next page'
            >
              {textContent?.nextPageButtonLabel ?? 'Next'}
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Table;

