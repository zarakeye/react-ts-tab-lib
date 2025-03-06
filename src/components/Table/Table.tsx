import { type ChangeEvent, JSX, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import '../../index.css';

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'custom';
export type OrderType = 'asc' | 'desc';
export type ActiveOrderType<T> = {
  property: keyof T;
  order: OrderType;
}
export type TextContentType = {
  searchLabel: string | null;
  entriesLabel_showReplace: string | null;
  entriesLabel_entriesReplace: string | null;
  emptyTableText: string | null;
  paginationTextContent: (sampleBegin: number, sampleEnd: number, allRows: number) => string | null;
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
  sampleLengthSelectorClassname?: string;
  sampleLengthOptionClassname?: string;
  sampleTextClassname?: string;
  searchLabelClassname?: string;
  searchInputClassname?: string;
  tableClassname?: string;
  globalColumnsClassname?: string;
  sortButtonClassname?: {
    style: string;
    color: string;
  };
  activeSortButtonClassname?: {
    style: string;
    color: string;
  };
  rowsClassname?: string;
  sampleInfoClassname?: string;
  currentPagePaginationButtonClassname?: string;
  pagesPaginationButtonsClassname?: string;
  paginationNavButtonsClassname?: string;
  cellClassname?: string;

  numberOfDisplayedRows?: number[] | undefined;
  defaultOrder?: ActiveOrderType<T> | null;
  textContent?: TextContentType | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table <T extends Record<string, any>>({
  columns = [],
  rows = [],
  onRowHover,
  onRowClick,
  componentGlobalClassname = '',
  sampleTextClassname = '',
  sampleLengthSelectorClassname = '',
  sampleLengthOptionClassname = '',
  searchLabelClassname = '',
  searchInputClassname = '',
  sampleInfoClassname = '',
  tableClassname = '',
  globalColumnsClassname = '',
  sortButtonClassname = { style: '', color: ''},
  activeSortButtonClassname = { style: '', color: ''},
  rowsClassname = '',
  currentPagePaginationButtonClassname,
  pagesPaginationButtonsClassname,
  paginationNavButtonsClassname,
  cellClassname = '',
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
  const [activeOrder, setActiveOrder] = useState<{ property: keyof T; order: OrderType }>({
    property: defaultOrder?.property ?? columns[0].property,
    order: defaultOrder?.order ?? 'asc'
  });
  const [hoveredRow, setHoveredRow] = useState<T | null>(null);
  console.log(hoveredRow);

  const ascFilteringButtonRef = useRef<HTMLDivElement>(null);
  const descFilteringButtonRef = useRef<HTMLDivElement>(null);

  const columnHeaderRef = useRef<HTMLTableCellElement>(null);
  const columnNameRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const valuesOfFilteredProperty = allRows.map((row) => row[activeOrder.property]);
    const order = activeOrder.order;
    const col = columns.find((column) => column.property === activeOrder.property);

    if (activeOrder.order === 'asc') {
      switch (col?.type) {
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
    } else if (order === 'desc') {
      switch (col?.type) {
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
    }

    const sortedRows = valuesOfFilteredProperty.map((value) => rows.find((row) => row[activeOrder.property] === value));

    setAllRows(sortedRows as T[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeOrder]);

  /**
   * Handles the click event on the sort button of a column.
   *
   * Toggles the sort order between 'asc' and 'desc' if the column is already sorted,
   * or sets the sort order to 'asc' if the column was not sorted.
   *
   * @param e - The click event.
   * @param property - The property of the column to sort.
   */
  const handleOrder = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, property: keyof T) => {
    e.preventDefault();

    if (activeOrder?.property === property) {
      if (activeOrder?.order === 'asc') {
        setActiveOrder({ property, order: 'desc' });
      } else {
        setActiveOrder({ property, order: 'asc' });
      }
    } else {
      setActiveOrder({ property, order: 'asc' });
    }
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
    <div className={`my-5 ${componentGlobalClassname ?? ''}`}>
      <div className='flex flex-col lg:flex-row items-center justify-between my-5 gap-y-3.5'>
        <div>
          <label htmlFor="sampleLength" className={sampleTextClassname ?? 'mr-2.5'}>
            {textContent?.entriesLabel_showReplace ?? 'Show' }
          </label>

          <select
            name="sampleLength"
            id="sampleLength"
            onChange={handleDisplayedEntriesChange}
            className={ sampleLengthSelectorClassname ?? `border-1 border-black rounded-[5px]`}
          >
            {numberOfDisplayedRows.map((option, index) => (
              <option key={index} value={option} className={sampleLengthOptionClassname ?? ''}>{option}</option>
            ))}
          </select>

          <label htmlFor="sampleLength" className={sampleTextClassname ?? 'ml-2.5'}>
            {textContent?.entriesLabel_entriesReplace ??' entries'}
          </label>
        </div>

        <div>
          <label htmlFor="search" className={searchLabelClassname ?? 'mr-2.5'}>
            {textContent?.searchLabel ?? 'Search'}
          </label>

          <input type="text" name="search" id="search" className={searchInputClassname ?? 'ml-1.5 border-1 border-black rounded-[5px]'} onChange={(e) => handleSearch(e)}/>
        </div>
      </div>
      
      <table className={`w-full ${tableClassname ?? ''}`} role='table'>
        <thead>
          <tr className={globalColumnsClassname} role='row'>
            {columns.map((key, index) => (
              <th 
                key={index}
                role='columnheader'
                className={`${globalColumnsClassname ?? 'pl-[18px] pr-[5px] py-[10px] border-b-2 border-b-gray'} ${key.specificColumnclassName ?? ''}`}
                ref={columnHeaderRef}
              >
                <div
                  className='flex justify-between items-center gap-2.5'
                  onClick={e => handleOrder(e, key.property)}
                >
                  <div className='flex items-center w-[100%]'>
                    <div className='flex-1 text-center overflow-hidden'>
                      <p
                        ref={columnNameRef}
                        className='cursor-pointer'
                      >
                        {key.displayName ? key.displayName : String(key.property)}
                      </p>
                    </div>
                    <div className='flex flex-col justify-between'>
                      <div
                        ref={ascFilteringButtonRef}
                        className={`w-[12px] h-[12px] transition duration-500 m-[5px]`}
                      >
                        <svg className={activeOrder?.property === key.property && activeOrder?.order !== 'asc' ? 'hidden' : ''} xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 -960 960 960" fill={activeOrder?.property === key.property ? activeOrder?.order === 'asc' ? (activeSortButtonClassname.color ?? '#000') : (sortButtonClassname.color ?? '') : '#b3b2b2'} >
                          <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                        </svg>
                      </div>
                      <div
                        ref={descFilteringButtonRef}
                        className={`w-[12px] h-[12px] transition duration-500 m-[5px]`}
                        role='button'
                        aria-label='descending order button'
                      >
                        <svg className={`rotate-180 ${activeOrder?.property === key.property && activeOrder?.order !== 'desc' ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 -960 960 960" fill={activeOrder?.property === key.property ? (activeOrder?.order === 'desc' ? (activeSortButtonClassname.color ?? '#000') : (sortButtonClassname.color ?? '')) : '#b3b2b2'}>
                          <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='pb-2.5 overflow-y-auto'>
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
                    className={`px-[5px] truncate ${cellClassname}`}
                  >
                    {columns[colIndex].renderer ? columns[colIndex].renderer(row[column.property]) : row[column.property] as ReactNode}
                  </td>
                ))}
              </tr>
              ))
            : (
              <tr
                role='row'
                className={rowsClassname ?? 'border-b-gray'}
                ref={rowRef}
              >
                <td colSpan={columns.length} className='text-center truncate py-[10px]'>
                  No data available in table
                </td>
              </tr>
            )}
        </tbody>
      </table>

      <div className={`flex flex-col lg:flex-row gap-y-3.5 justify-between items-center mt-5 ${sampleInfoClassname}`}>
        {sampleLength > 0 && (
          <p className='inline-block'>
            {
              textContent?.paginationTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
              ? textContent?.paginationTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
              : allRows.length > Math.min(sampleLength * currentPage, allRows.length)
              ? `Showing entries ${sampleLength * (currentPage - 1) + 1} to ${Math.min(sampleLength * currentPage, allRows.length)} of ${allRows.length} entries`
              : allRows.length >1
              ? `Showing entries ${sampleLength * (currentPage - 1) + 1} to ${Math.min(sampleLength * currentPage, allRows.length)}`
              : ''
            }
          </p>
        )}

        <div className='flex items-center gap-2'>
          {currentPage - 1 >= 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed ${paginationNavButtonsClassname}`}
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

