import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { type Selection } from '@heroui/react';
import * as React from 'react';
import { type ChangeEvent, JSX, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import '../../index.css';

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'custom';
export type OrderType = 'asc' | 'desc';
export type ActiveOrderType<T> = {
  property: keyof T;
  order: OrderType;
}
export type TextContentType = {
  searchLabel?: string | null;
  searchPlaceholder?: string | null;
  sampleLabelPrefix?: string | null;
  sampleLabelSuffix?: string | null;
  emptyTableText?: string | null;
  custtomizeSampleInfoTextContent?: (sampleBegin: number, sampleEnd: number, allRows: number) => ReactNode | null;
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

export type TableHeadersClassNames = {
  font?: string;
  backgroundColor?: string;
  textColor?: string;
  borderY?: string;
  borderColor?: string;
  borderL?: string;
  borderR?: string;
  roundedL?: string;
  roundedR?: string;
  padding?: string;
  margin?: string;
  gap?: string;
}

export type SamplingOptionsClassNames = {
  buttonBackgroundColor?: string;
  buttonText?: string;
  buttonBorder?: string;
  buttonBorderColor?: string;
  buttonRounded?: string;
  buttonPadding?: string;
  menuBorder?: string;
  menuBorderColor?: string;
  menuRounded?: string;
  menuPadding?: string;
  menuMargin?: string;
  menuTextColor?: string;
  menuBackgroundColor?: string;
}

export type SearchBarClassNames = {
  label?: string;
  inputPadding?: string;
  inputBackgroundColor?: string;
  inputMarginL?: string;
  inputBorder?: string;
  inputBorderColor?: string;
  inputRounded?: string;
  inputFocusOutLine?: string;
  inputTextColor?: string;
}

export type PaginationClassNames = {
  paginationBlockHover?: string;
  buttonBackgroundColor?: string;
  buttonBackgroundColorHover?: string;
  buttonBorderColor?: string;
  textColor?: string;
  border?: string;
  rounded?: string;
  padding?: string;
  previousButtonPadding?: string;
  nextButtonPadding?: string;
  previousButtonRoundedL?: string;
  navButtonsColor?: string;
  nextButtonRoundedR?: string;
  margin?: string;
  currentPageButton?: string;
  otherpages?: string;
  navButtons?: string;

}

export type RowsClassNames = {
  oddRowBackgroundColor?: string;
  evenRowBackgroundColor?: string;
  marginL?: string;
  marginR?: string;
  paddingT?: string;
  paddingB?: string;
  paddingX?: string;
  height?: string;
  textColor?: string;
}

export type ClassNames = {
  tableBackgroundColor?: string;
  tableBorders?: string;
  tableBordersHover?: string;
  tablePaddings?: string;
  tableMargins?: string;
  tableRounded?: string;
  tableHeaders?: TableHeadersClassNames,
  samplingOptions?: SamplingOptionsClassNames
  searchBar?: SearchBarClassNames
  sortIndicatorColor?: string;
  rows?: RowsClassNames;
  cells?: string;
  pagination?: PaginationClassNames
}

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  onRowHover?: (row: T | null) => void;
  onRowClick?: (row: T | null) => void;
  classNames?: ClassNames;
  samplingOptions?: number[] | undefined;
  defaultOrder?: ActiveOrderType<T> | null;
  textContent?: TextContentType | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table <T extends Record<string, any>>({
  columns = [],
  rows = [],
  onRowHover,
  onRowClick,
  classNames,
  samplingOptions = [10, 20, 50, 100],
  defaultOrder,
  textContent
}: TableProps<T>): JSX.Element {
  type DisplayedRows_Type = typeof samplingOptions[number];
  const [sampleLength, setSampleLength] = useState<DisplayedRows_Type>(samplingOptions[0]);
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
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([10]));

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

  const sampleLengthOptions = samplingOptions.map((option) => (
    { value: option, label: <span className={`${classNames?.samplingOptions?.menuTextColor ?? 'text-white'} ${classNames?.samplingOptions?.menuBackgroundColor ?? 'bg-gray-800 hover:bg-gray-700'}`}>{`${textContent?.sampleLabelPrefix ?? 'Show '} ${option} ${textContent?.sampleLabelSuffix ?? ' entries'}`} </span> }
  ))

  // const columnsWidth: ColumnsWitdthType<T>[] = [];

  useEffect(() => {
    const firstRow = document.getElementsByTagName('tbody')[0].children[0];
    const cells = firstRow.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
      setColumnsWidth(  [...columnsWidth, cells[i].offsetWidth]);
    }
  }, [columns]);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
    [selectedKeys]
  )

  return (
    <div className={`my-5 `}>
      <div className='flex flex-col lg:flex-row items-center justify-between my-5 gap-y-3.5'>
        <div>
          <label htmlFor="sampleLength" className='sr-only'>Displayed entries</label>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='bordered'
                className={`
                  ${classNames?.samplingOptions?.buttonBorder ?? 'border-4'}
                  ${classNames?.samplingOptions?.buttonBorderColor ?? 'border-gray-300'}
                  ${classNames?.samplingOptions?.buttonRounded ?? 'rounded-[20px]'}
                  ${classNames?.samplingOptions?.buttonText ?? 'text-center text-white'} 
                  ${classNames?.samplingOptions?.buttonBackgroundColor ?? 'bg-gray-800 hover:bg-gray-700'} 
                  ${classNames?.samplingOptions?.buttonPadding ?? 'px-[10px]'}`
                }
              >
                {`${textContent?.sampleLabelPrefix ?? 'Show'} ${selectedValue} ${textContent?.sampleLabelSuffix ?? 'entries'}`}
                <ChevronDownIcon 
                  className="h-5 w-5 text-white ui-open:rotate-180 transition-transform"
                  aria-hidden="true"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-labelledby="Sample Length"
              selectedKeys={selectedKeys}
              selectionMode='single'
              variant='flat'
              onSelectionChange={e => {
                if (!e.currentKey) return
                setSelectedKeys(new Set([e.currentKey]))
                handleDisplayedEntriesChange(e.currentKey)
              }}
              className={`
                ${classNames?.samplingOptions?.menuBorder ?? 'border-4'}
                ${classNames?.samplingOptions?.menuBackgroundColor ?? 'border-gray-300'}
                ${classNames?.samplingOptions?.menuRounded ?? 'rounded-[20px]'}
                ${classNames?.samplingOptions?.menuPadding ?? 'p-[10px]'}
                ${classNames?.samplingOptions?.menuTextColor ?? 'text-white'}
                ${classNames?.samplingOptions?.menuBackgroundColor ?? 'bg-gray-800 hover:bg-gray-600'}
              `}
            >
              {sampleLengthOptions.map(option => (
                <DropdownItem key={option.value}>
                  {`${textContent?.sampleLabelPrefix ?? 'Show'} ${option.value} ${textContent?.sampleLabelSuffix ?? 'entries'}`}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div>
          <label
            htmlFor="search"
            className={classNames?.searchBar?.label ?? 'mr-2.5'}
          >
            {textContent?.searchLabel ?? 'Search'}
          </label>

          <input
            type="text"
            name="search"
            id="search"
            placeholder={textContent?.searchPlaceholder ?? ''}
            className={`
              ${classNames?.searchBar?.inputPadding ?? 'px-[10px] py-[5px]'}
              ${classNames?.searchBar?.inputBackgroundColor ?? 'bg-white'}
              ${classNames?.searchBar?.inputMarginL ?? 'ml-[15px]'}
              ${classNames?.searchBar?.inputBorder ?? 'border-3'}
              ${classNames?.searchBar?.inputBorderColor ?? 'border-gray-300 hover:border-gray-400'}
              ${classNames?.searchBar?.inputRounded ?? 'rounded-[20px]'}
              ${classNames?.searchBar?.inputFocusOutLine ?? 'focus:outline-sky-400'}
              ${classNames?.searchBar?.inputTextColor ?? 'text-black'}
            `}
            onChange={(e) => handleSearch(e)}
          />
        </div>
      </div>
      
      <div
        className={`
          ${classNames?.tableBorders ?? 'border-4 border-gray-300'}
          ${classNames?.tableRounded ?? 'rounded-[23px]'}
          ${ classNames?.tablePaddings ?? 'px-[5px] pt-[5px] pb-[15px]'}
          ${ classNames?.tableMargins ?? ''}
          ${classNames?.tableBackgroundColor ?? ''}
        `}
      >
        <table className={`w-full`} role='table'>
          <thead>
            <tr role='row' className={`sticky top-0 z-10`}>
              {columns.map((key, index) => (
                <th
                  key={index}
                  role='columnheader'
                  // className={`${key.specificColumnClassname ?? ''} ${globalColumnsClassname ? globalColumnsClassname : 'pl-[18px] pr-[5px] py-[10px] border-b-2 border-b-gray bg-gray/0 hover:bg-gray/40 '}`}
                  className="cursor-pointer"
                  ref={columnHeaderRef}
                >
                  <div
                    key={index}
                    className={`
                      flex justify-between items-center
                      ${classNames?.tableHeaders?.gap ?? 'gap-2.5'}
                      ${classNames?.tableHeaders?.padding ?? 'py-[5px]'}
                      ${classNames?.tableHeaders?.margin ?? 'mb-[10px]'}
                      ${classNames?.tableHeaders?.textColor ?? 'text-white'}
                      ${classNames?.tableHeaders?.backgroundColor ?? 'bg-gray-800 hover:bg-gray-700'} 
                      ${classNames?.tableHeaders?.borderY ?? 'border-y-4'}
                      ${classNames?.tableHeaders?.borderColor ?? 'border-gray-300'}
                      ${columnsWidth[index] ? `w-[${columnsWidth[index]}px]` : ''}
                      ${index === 0 ? (classNames?.tableHeaders?.borderL ?? 'border-l-4') : ''}
                      ${index === 0 ? classNames?.tableHeaders?.roundedL ?? 'rounded-tl-[20px] rounded-bl-[20px]': ''}
                      ${index === columns.length - 1 ? classNames?.tableHeaders?.borderR ?? 'border-r-4' : ''}
                      ${index === columns.length - 1 ? classNames?.tableHeaders?.roundedR ?? 'rounded-tr-[20px] rounded-br-[20px]' : ''}
                    `}
                    onClick={e => handleOrder(e, key.property)}
                  >
                    <div className={`flex items-center justify-between w-[100%] pl-[18px] pr-[5px]`}>
                      <div className='flex-1 text-center overflow-hidden mr-[10px]'>
                        <p
                          ref={columnNameRef}
                          className='whitespace-nowrap'
                        >
                          {key.displayName ? key.displayName : String(key.property)}
                        </p>
                      </div>
                      <div>
                        <div
                          className={`flex items-center justify-center w-[12px] h-[12px] mr-[10px]`}
                        >
                          <svg
                            className={`
                              ${!(activeOrder?.property === key.property)? 'hidden' : ''}
                              ${activeOrder?.property === key.property && activeOrder?.order !== 'asc' ? 'rotate-90' : '-rotate-90'}
                            `}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                            fill={classNames?.sortIndicatorColor ?? '#FFF'}
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
          <tbody className='pb-[2.5] overflow-y-auto '>
            {displayedSample.length > 0
              ? displayedSample.map((row: T, rowIndex: number): ReactNode => (
                <tr
                  key={rowIndex}
                  ref={rowRef}
                  role='row'
                  data-row
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
                  className={`
                    ${classNames?.rows?.height ?? 'h-[30px]'}
                    ${classNames?.rows?.paddingB ?? 'last:pt-[15px]'}
                  `}
                >
                {columns.map((column, colIndex) => (
                  <td title={`id: ${row.id}`}
                    key={colIndex}
                    role='cell'
                    className={`
                      ${classNames?.cells ?? 'whitespace-nowrap'} py-[2.5px]
                    `}
                  >
                    <div
                      className={`
                        flex justify-between items-center px-[10px] py-[5px] h-full transition-colors duration-200
                        ${classNames?.rows?.textColor ?? ''}
                        ${
                          rowIndex % 2 === 0
                            ? classNames?.rows?.oddRowBackgroundColor ?? 'bg-gray-500'
                            : classNames?.rows?.evenRowBackgroundColor ?? 'bg-gray-600'
                        }
                        ${columnsWidth[colIndex] ? `w-[${columnsWidth[colIndex]}px]` : ''}
                        ${colIndex === 0
                          ? classNames?.rows?.marginL ?? 'ml-[15px]'
                          : ''
                        }
                        ${colIndex === columns.length - 1
                          ? classNames?.rows?.marginR ?? 'mr-[15px]'
                          : ''
                        }
                      `}
                    >
                      {
                        columns[colIndex].renderer
                          ? columns[colIndex].renderer(row[column.property])
                          : row[column.property] as ReactNode
                      }
                    </div>
                  </td>
                ))}
                </tr>
                ))
              : (
                <tr
                  role='row'
                  className={`  
                    ${classNames?.rows?.paddingB ?? ''}
                  `}
                  ref={rowRef}
                >
                  <td
                    colSpan={columns.length}
                    className={`
                      ${classNames?.rows?.paddingT ?? 'mt-[10px]'}
                      ${'text-center truncate'}
                      ${classNames?.rows?.paddingX ?? 'px-[15px]'}
                    `}
                  >
                      <div
                        className={`
                          ${classNames?.rows?.oddRowBackgroundColor ?? ''}
                        `}
                      >
                        No data available in table
                      </div>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div
        hidden={pagesNumbers.length < 2}
        className={`flex flex-col lg:flex-row gap-y-3.5 justify-between items-center mt-5`}
      >
        <p className='inline-block'>
        {
          textContent?.custtomizeSampleInfoTextContent && textContent?.custtomizeSampleInfoTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
            ? textContent?.custtomizeSampleInfoTextContent(sampleLength * (currentPage - 1) + 1, Math.min(sampleLength * currentPage, allRows.length), allRows.length)
            : allRows.length > Math.min(sampleLength * currentPage, allRows.length)
            ? (
              <span>Showing entries 
                <span className='font-bold'>${sampleLength * (currentPage - 1) + 1}</span>
                 to 
                <span className='font-bold'>${Math.min(sampleLength * currentPage, allRows.length)}</span>
                 of 
                <span className='font-bold'>${allRows.length} entries</span>
              </span>
            )
            : allRows.length >1
            ? (
              <span>Showing entries
                <span className='font-bold'> ${sampleLength * (currentPage - 1) + 1}</span>
                to 
                <span className='font-bold'>${Math.min(sampleLength * currentPage, allRows.length)}</span>
              </span>
            )
            : ''
        }
        </p>

        <div
          className={`
            flex items-center
            ${classNames?.pagination?.paginationBlockHover ?? ''}
            ${ classNames?.pagination?.rounded ?? 'rounded-[20px]'}
            ${ classNames?.pagination?.border ?? 'border-2'}
            ${classNames?.pagination?.buttonBorderColor ?? 'border-gray-300'}
            ${classNames?.pagination?.buttonBackgroundColor ?? 'bg-gray-800'}
          `}
        >
          {currentPage - 1 >= 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`
                disabled:opacity-50 cursor-pointer
                ${classNames?.pagination?.previousButtonPadding ?? 'pl-[20px] pr-3'}
                ${classNames?.pagination?.previousButtonRoundedL ?? 'rounded-l-[20px]'}
                ${classNames?.pagination?.textColor ?? 'text-white'}
                ${classNames?.pagination?.buttonBackgroundColorHover ?? 'hover:bg-gray-500 py-[9px]'}
              `}
              aria-label='Previous page'
            >
              <svg className='rotate-180 h-[15px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill={classNames?.pagination?.navButtonsColor ?? '#fff'}>
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
              </svg>
            </button>
          )}     

          {pagesNumbers.map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-[5px] ${
                  page === currentPage
                    ? classNames?.pagination?.currentPageButton ?? 'bg-blue-500 text-white first:rounded-l-[20px] last:rounded-r-[20px]'
                    : classNames?.pagination?.otherpages ?? 'text-white hover:bg-gray-500 first:rounded-l-[20px] last:rounded-r-[20px] cursor-pointer'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <div className='flex items-start justify-start '>
                <span key={index} className='px-2 pb-2 text-white align-top'>
                  ...
                </span>
              </div>
            )
          )}

          {currentPage + 1 <= pagesNumber && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`
                disabled:opacity-50  cursor-pointer
                ${classNames?.pagination?.nextButtonPadding ?? 'pl-3 pr-[20px]'}
                ${classNames?.pagination?.nextButtonRoundedR ?? 'rounded-r-[20px]'}
                ${classNames?.pagination?.textColor ?? 'text-white'}
                ${classNames?.pagination?.buttonBackgroundColorHover ?? 'hover:bg-gray-500 py-[9px]'}
              `}
              aria-label='Next page'
            >
              <svg className='h-[15px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill={classNames?.pagination?.navButtonsColor ?? '#fff'}>
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Table;