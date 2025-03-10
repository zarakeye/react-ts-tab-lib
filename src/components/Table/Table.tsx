import { type ChangeEvent, JSX, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import '../../index.css';
import { Select } from 'antd';
import * as React from 'react';

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'custom';
export type OrderType = 'asc' | 'desc';
export type ActiveOrderType<T> = {
  property: keyof T;
  order: OrderType;
}
export type TextContentType = {
  searchLabel?: string | null;
  sampleLabelPrefix?: string | null;
  sampleLabelSuffix?: string | null;
  emptyTableText?: string | null;
  custtomizeSampleInfoTextContent?: (sampleBegin: number, sampleEnd: number, allRows: number) => string | null;
  previousPageButtonLabel?: string | null;
  nextPageButtonLabel?: string | null;
}

export type Column<T> = {
  property: keyof T;
  displayName?: string;
  type: DataType;
  renderer?: (value: T[keyof T]) => ReactNode;
  specificColumnClassname?: string;
}

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  onRowHover?: (row: T | null) => void;
  onRowClick?: (row: T | null) => void;
  componentGlobalClassname?: string;
  sampleLengthOptionClassname?: string;
  sampleOptionsClassname?: string;
  customSelect?: string;
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

type ColumnsWitdthType<T> = {
  [K in keyof T]: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table <T extends Record<string, any>>({
  columns = [],
  rows = [],
  onRowHover,
  onRowClick,
  componentGlobalClassname,
  sampleOptionsClassname,
  customSelect,
  searchLabelClassname,
  searchInputClassname,
  sampleInfoClassname,
  tableClassname,
  globalColumnsClassname,
  sortButtonClassname,
  activeSortButtonClassname,
  rowsClassname = '',
  currentPagePaginationButtonClassname,
  pagesPaginationButtonsClassname,
  paginationNavButtonsClassname,
  cellClassname = '',
  numberOfDisplayedRows = [10, 20, 50, 100],
  defaultOrder,
  textContent = null
}: TableProps<T>): JSX.Element {
  type DisplayedRows_Type = typeof numberOfDisplayedRows[number];
  const [sampleLength, setSampleLength] = useState<DisplayedRows_Type>(numberOfDisplayedRows[0]);
  const [allRows, setAllRows] = useState<T[]>(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [displayedSample, setDisplayedSample] = useState<T[]>([]);
  const [activeOrder, setActiveOrder] = useState<{ property: keyof T; order: OrderType }>({
    property: defaultOrder?.property ?? columns[0].property satisfies keyof T,
    order: defaultOrder?.order ?? 'asc'
  });
  const [columnsWidth, setColumnsWidth] = useState<number[]>([]);
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
  const handleDisplayedEntriesChange = (/*e: ChangeEvent<HTMLSelectElement>*/ value: string) => {
    const newValue = parseInt(/*e.target.value*/ value);
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

  const sampleLengthOptions = numberOfDisplayedRows.map((option) => (
    { value: option, label: <span className={sampleOptionsClassname}> {`${textContent?.sampleLabelPrefix ?? 'Show '} ${option} ${textContent?.sampleLabelSuffix ?? ' entries'}`} </span> }
  ))

  // const columnsWidth: ColumnsWitdthType<T>[] = [];

  useEffect(() => {
    const firstRow = document.getElementsByTagName('tbody')[0].children[0];
    const cells = firstRow.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
      setColumnsWidth(  [...columnsWidth, cells[i].offsetWidth]);
    }
  }, [columns]);

  return (
    <div className={`my-5 ${componentGlobalClassname ?? ''}`}>
      <div className='flex flex-col lg:flex-row items-center justify-between my-5 gap-y-3.5'>
        <div>
          <label htmlFor="sampleLength" className='sr-only'>Displayed entries</label>
          <Select
            id="sampleLength"
            defaultValue={`${textContent?.sampleLabelPrefix ?? 'Show'} ${numberOfDisplayedRows[0]} ${textContent?.sampleLabelSuffix ?? 'entries'}`}
            className={customSelect}
            onChange={handleDisplayedEntriesChange}
            options={sampleLengthOptions}
          />
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
          <tr role='row' className="">
            {columns.map((key, index) => (
              <th 
                key={index}
                role='columnheader'
                // className={`${key.specificColumnClassname ?? ''} ${globalColumnsClassname ? globalColumnsClassname : 'pl-[18px] pr-[5px] py-[10px] border-b-2 border-b-gray bg-gray/0 hover:bg-gray/40 '}`}
                className="sticky top-0 z-10"
                ref={columnHeaderRef}
              >
                <div
                  className={`flex justify-between items-center gap-2.5 bg-blue-500 ${columnsWidth[index] ? `w-[${columnsWidth[index]}px]` : ''} ${index === 0 ? 'rounded-tl-[20px] rounded-bl-[20px]' : ''} ${index === columns.length - 1 ? 'rounded-tr-[20px] rounded-br-[20px]' : ''}`}
                  onClick={e => handleOrder(e, key.property)}
                >
                  <div className={`flex items-center w-[100%] ${key.specificColumnClassname ?? ''} ${globalColumnsClassname ? globalColumnsClassname : 'pl-[18px] pr-[5px] py-[10px] border-b-2 border-b-[#878787]'}  ${globalColumnsClassname ? '' : 'bg-gray/0 hover:bg-[#878787]'}`}>
                    <div className='flex-1 text-center overflow-hidden mr-[5px]'>
                      <p
                        ref={columnNameRef}
                        className='whitespace-nowrap cursor-pointer'
                      >
                        {key.displayName ? key.displayName : String(key.property)}
                      </p>
                    </div>
                    <div>
                      <div
                        className={`flex items-center justify-center w-[12px] h-[12px] m-[5px]`}
                      >
                        <svg
                          className={`${!(activeOrder?.property === key.property)? 'hidden' : ''} ${activeOrder?.property === key.property && activeOrder?.order !== 'asc' ? 'rotate-90' : '-rotate-90'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                          fill={activeSortButtonClassname?.color ?? '#FFF'}
                        >
                          <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </th>)
            )}
          </tr>
        </thead>
        <tbody className='pb-2.5 overflow-y-auto border-b-[#878787]'>
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
                    className={cellClassname ?? 'px-[5px] whitespace-nowrap border-b-solid last:border-b-2 last:border-[#878787]'}
                  >
                    <div
                      
                    >
                      {columns[colIndex].renderer ? columns[colIndex].renderer(row[column.property]) : row[column.property] as ReactNode}
                    </div>
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
              textContent?.custtomizeSampleInfoTextContent && textContent?.custtomizeSampleInfoTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
              ? textContent?.custtomizeSampleInfoTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
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

