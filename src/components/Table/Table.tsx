import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Button } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { type Selection } from '@heroui/react';
import * as React from 'react';
import { type ChangeEvent, JSX, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import '../../index.css';

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'custom';
export type OrderType = 'asc' | 'desc';

export type ActiveOrderType<T> = {
  property: keyof T;
  order: OrderType;
}

type RangeInfoText = {
  showEntries_altText: string | null;
  to_altText: string | null;
  of_altText: string | null;
  entries_altText: string | null
}

export type TextContentType = {
  searchLabel?: string | null;
  searchPlaceholder?: string | null;
  sampleLabelPrefix?: string | null;
  sampleLabelSuffix?: string | null;
  emptyTableText?: string | null;
  rangeInfoText?: RangeInfoText | null;
  previousPageButtonLabel?: string | null;
  nextPageButtonLabel?: string | null;
}

export type Column<T> = {
  property: keyof T;
  displayName?: string;
  type: DataType;
  render?: (value: T[keyof T]) => ReactNode;
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

export type RangeOptionsClassNames = {
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

export type StyleClassNames = {
  tableBackgroundColor?: string;
  tableBorders?: string;
  tableBordersHover?: string;
  tablePaddings?: string;
  tableMargins?: string;
  tableRounded?: string;
  tableHeaders?: TableHeadersClassNames,
  rangeOptionsAndSearchBarArea?: string
  rangeLengthOptions?: RangeOptionsClassNames
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
  styleClassNames?: StyleClassNames;
  rangeLengthOptions?: number[] | undefined;
  defaultOrder?: ActiveOrderType<T> | null;
  textContent?: TextContentType | null;
}
  
/**
 * Generates an array of page numbers for the pagination component.
 * 
 * The array will contain the first page number, the last page number, and the current page number, 
 * as well as the two page numbers before and after the current page number. 
 * If the total number of pages is greater than 5, the array will also contain the string '...'. 
 * To avoid having multiple '...' in a row, the function will remove any '...' that are not 
 * preceded by a number and not followed by a number.
 * 
 * @param current - The current page number.
 * @param total - The total number of pages.
 * 
 * @returns An array of page numbers and/or the string '...'.
 */
const generatePagesNumbers = (current: number, total: number): (number | string)[] => {
  if (total <= 1) return [];
  
  const delta = 1; // Number of page numbers to show before and after the current page
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

/**
 * The Table component renders a table with a specified number of columns and rows.
 *
 * Props:
 *   columns: Column<T>[]
 *   rows: T[]
 *   onRowHover: (row: T | null) => void
 *   onRowClick: (row: T | null) => void
 *   classNames: ClassNames
 *   rangeLengthOptions: number[] | undefined
 *   defaultOrder: ActiveOrderType<T> | null
 *   textContent: TextContentType | null
 *
 * State:
 *   allRows: T[]
 *   columnsWidth: number[]
 *   activeOrder: { property: keyof T; order: OrderType }
 *   currentPage: number
 *   pagesNumber: number
 *   displayedRange: T[]
 *   hoveredRow: T | null
 *   selectedKeys: Selection
 *
 * Effects:
 *   Updates the sample length when the user selects a new number of displayed entries.
 *   Resets the current page to 1.
 *   Filters the rows based on the search input value.
 *   Generates an array of page numbers for the pagination component.
 *   Updates the columns width when the component is mounted.
 *
 * Renders:
 *   A table with the specified number of columns and rows.
 *   A select menu for selecting the number of displayed entries.
 *   A search bar for filtering the rows.
 *   A pagination component for navigating between pages.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table <T extends Record<string, any>>({
  columns = [],
  rows = [],
  onRowHover,
  onRowClick,
  styleClassNames,
  rangeLengthOptions = [10, 20, 50, 100],
  defaultOrder,
  textContent
}: TableProps<T>): JSX.Element {
  type DisplayedRange_Type = typeof rangeLengthOptions[number];
  const [rangeLength, setRangeLength] = useState<DisplayedRange_Type>(rangeLengthOptions[0]); // Max number of displayed rows at once
  const [allRows, setAllRows] = useState<T[]>(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [displayedRange, setDisplayedRange] = useState<T[]>([]); // Rows currently displayed (on the current page)
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
  
  /**
   * Order all rows based on the active order and the property type
   */
  useEffect(() => {
    const propertyType = columns.find((column) => column.property === activeOrder.property)?.type;
    const sortedRows = allRows.map(row => ({ row, value: row[activeOrder.property]}))
      .sort((a, b) => {
        if (activeOrder.order === 'asc') {
          if (propertyType === 'string') {
            return a.value.localeCompare(b.value);
          } else if (propertyType === 'number') {
            return a.value - b.value;
          } else if (propertyType === 'date') {
            return a.value.getTime() - b.value.getTime();
          } else if (propertyType === 'boolean') {
            return b.value - a.value;
          } else {
            return 0;
          }
        } else {
          if (propertyType === 'string') {
            return b.value.localeCompare(a.value);
          } else if (propertyType === 'number') {
            return b.value - a.value;
          } else if (propertyType === 'date') {
            return b.value.getTime() - a.value.getTime();
          } else if (propertyType === 'boolean') {
            return a.value - b.value;
          } else {
            return 0;
          }
        }
      });

    setAllRows(sortedRows.map((tuple) => tuple.row));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeOrder]);
 
  /**
   * Toggles the order between ascending and descending order when the user clicks on a table header.
   * @param e - The mouse event triggered by clicking the table header.
   * @param property - The property to sort the rows by.
   */
  const handleOrderChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, property: keyof T) => {
    e.preventDefault();

    if (activeOrder?.property === property) {
      if (activeOrder?.order === 'asc') {
        setActiveOrder({ property, order: 'desc' });
      } else {
        setActiveOrder({ property, order: 'asc' });
      }
    } else {
      setActiveOrder({ property, order: defaultOrder?.order ?? 'asc' });
    }
  }

  /**
   * Updates the sample length when the user selects a new number of displayed entries.
   * Resets the current page to 1.
   * @param value The new number of displayed entries.
   */
  const handleRangeLengthChange = (value: string) => {
    const newValue = parseInt(value);
    setRangeLength(newValue);
    setCurrentPage(1);
  }

  /**
   * Filters the rows based on the search input value.
   *
   * @param e - The change event triggered by the search input field.
   *
   * This function iterates over all rows, concatenates the values of each row into a single
   * string, and checks if this string includes the trimmed and lowercased value from the
   * search input. If it does, the row is added to the rowsMatchingWithSearchInput. Updates the state
   * with the filtered rows.
   */
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const rowsMatchingWithSearchInput: T[] = [];

    const displayedProperties = columns.map(column => column.property);

    rows.forEach(row => {
      let mergedRow = '';

      Object.keys(row).forEach(key => {
        if (rowsMatchingWithSearchInput.includes(row)) {
          return;
        } else if (displayedProperties.includes(key)) {
          mergedRow += row[key].toString().toLowerCase().trim().concat(' ');
        }
      })
      
      if (mergedRow.trim().includes(e.target.value.trim().toLowerCase())) {
        rowsMatchingWithSearchInput.push(row);
      }
    });

    setAllRows(rowsMatchingWithSearchInput);
    setCurrentPage(1);
  }

  /**
   * Updates the number of pages when the number of rows or the range length changes.
   */
  useEffect(() => {
    const newPagesNumber = Math.ceil(allRows.length / rangeLength);
    if (newPagesNumber === 0) {
      setPagesNumber(1);
      return;
    }
    setPagesNumber(newPagesNumber);
  }, [allRows.length, rangeLength]);

  /**
   * Updates the displayed range when the current page changes.
   */
  useEffect(() => {
    const startIndex = rangeLength * (currentPage - 1);
    const endIndex = startIndex + rangeLength;
    setDisplayedRange(allRows.slice(startIndex, endIndex))
  }, [allRows, currentPage, rangeLength])

  const pagesNumbers = useMemo(
    () => generatePagesNumbers(currentPage, pagesNumber),
    [currentPage, pagesNumber]
  );

  const rangeLengthOptionsTags = rangeLengthOptions.map((option) => (
    {
      value: option,
      label:  <span
                key={option}
                className={`
                  ${styleClassNames?.rangeLengthOptions?.menuTextColor ?? 'text-white'}
                  ${styleClassNames?.rangeLengthOptions?.menuBackgroundColor ?? 'bg-gray-800 hover:bg-gray-700'}
                `}
              >
                {`${textContent?.sampleLabelPrefix ?? 'Show '} ${option} ${textContent?.sampleLabelSuffix ?? ' entries'}`}
              </span>
      }
  ))

  useEffect(() => {
    const firstRow = document.getElementsByTagName('tbody')[0].children[0];
    const cells = firstRow.getElementsByTagName('td');
    for (let i = 0; i < cells.length; i++) {
      setColumnsWidth(  [...columnsWidth, cells[i].offsetWidth]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  /**
   * Creates a comma-separated string of selected keys from the selectedKeys Set.
   * Replaces underscores with empty strings.
   */
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
    [selectedKeys]
  )

  return (
    <div className={`my-5`}>
      <div className={`flex flex-col justify-between items-center my-5 gap-y-3.5 ${styleClassNames?.rangeOptionsAndSearchBarArea ?? ''}`}>
        <div>
          <label htmlFor="rangeLength" className='sr-only'>Displayed entries</label>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='bordered'
                className={`
                  ${styleClassNames?.rangeLengthOptions?.buttonBorder ?? 'border-4'}
                  ${styleClassNames?.rangeLengthOptions?.buttonBorderColor ?? 'border-gray-300'}
                  ${styleClassNames?.rangeLengthOptions?.buttonRounded ?? 'rounded-[20px]'}
                  ${styleClassNames?.rangeLengthOptions?.buttonText ?? 'text-center text-white'} 
                  ${styleClassNames?.rangeLengthOptions?.buttonBackgroundColor ?? 'bg-gray-800 hover:bg-gray-700'} 
                  ${styleClassNames?.rangeLengthOptions?.buttonPadding ?? 'px-[10px]'}`
                }
              >
                <span >
                  {`${textContent?.sampleLabelPrefix ?? 'Show'} ${selectedValue} ${textContent?.sampleLabelSuffix ?? 'entries'}`}
                  <ChevronDownIcon 
                    className="pl-[10px] inline-block h-5 w-[30px] text-white ui-open:rotate-180 transition-transform"
                    aria-hidden="true"
                  />
                </span>
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
                handleRangeLengthChange(e.currentKey)
              }}
              className={`
                ${styleClassNames?.rangeLengthOptions?.menuBorder ?? 'border-4'}
                ${styleClassNames?.rangeLengthOptions?.menuBackgroundColor ?? 'border-gray-300'}
                ${styleClassNames?.rangeLengthOptions?.menuRounded ?? 'rounded-[20px]'}
                ${styleClassNames?.rangeLengthOptions?.menuPadding ?? 'p-[10px]'}
                ${styleClassNames?.rangeLengthOptions?.menuTextColor ?? 'text-white'}
                ${styleClassNames?.rangeLengthOptions?.menuBackgroundColor ?? 'bg-gray-800 hover:bg-gray-600'}
              `}
            >
              {rangeLengthOptionsTags.map(option => (
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
            className={styleClassNames?.searchBar?.label ?? 'mr-2.5'}
          >
            {textContent?.searchLabel ?? 'Search'}
          </label>

          <input
            type="text"
            name="search"
            id="search"
            placeholder={textContent?.searchPlaceholder ?? ''}
            className={`
              ${styleClassNames?.searchBar?.inputPadding ?? 'px-[10px] py-[5px]'}
              ${styleClassNames?.searchBar?.inputBackgroundColor ?? 'bg-white'}
              ${styleClassNames?.searchBar?.inputMarginL ?? 'ml-[15px]'}
              ${styleClassNames?.searchBar?.inputBorder ?? 'border-3'}
              ${styleClassNames?.searchBar?.inputBorderColor ?? 'border-gray-300 hover:border-gray-400'}
              ${styleClassNames?.searchBar?.inputRounded ?? 'rounded-[20px]'}
              ${styleClassNames?.searchBar?.inputFocusOutLine ?? 'focus:outline-sky-400'}
              ${styleClassNames?.searchBar?.inputTextColor ?? 'text-black'}
            `}
            onChange={(e) => handleSearchInput(e)}
          />
        </div>
      </div>
      
      <div
        className={`
          ${styleClassNames?.tableBorders ?? 'border-4 border-gray-300'}
          ${styleClassNames?.tableRounded ?? 'rounded-[23px]'}
          ${ styleClassNames?.tablePaddings ?? 'px-[5px] pt-[5px] pb-[15px]'}
          ${ styleClassNames?.tableMargins ?? ''}
          ${styleClassNames?.tableBackgroundColor ?? ''}
        `}
      >
        <table className={`w-full`} role='table'>
          <thead>
            <tr
              role='row'
              key={uuidv4()}
              className={`sticky top-0 z-10`}
            >
              {columns.map((key, index) => (
                <th
                  key={uuidv4()}
                  role='columnheader'
                  className="cursor-pointer"
                  ref={columnHeaderRef}
                >
                  <div
                    aria-label={`Sort by ${key.displayName}`}
                    role='button'
                    key={index}
                    className={`
                      flex justify-between items-center
                      ${styleClassNames?.tableHeaders?.gap ?? 'gap-2.5'}
                      ${styleClassNames?.tableHeaders?.padding ?? 'py-[5px]'}
                      ${styleClassNames?.tableHeaders?.margin ?? 'mb-[10px]'}
                      ${styleClassNames?.tableHeaders?.textColor ?? 'text-white'}
                      ${styleClassNames?.tableHeaders?.backgroundColor ?? 'bg-gray-800 hover:bg-gray-700'} 
                      ${styleClassNames?.tableHeaders?.borderY ?? 'border-y-4'}
                      ${styleClassNames?.tableHeaders?.borderColor ?? 'border-gray-300'}
                      ${columnsWidth[index] ? `w-[${columnsWidth[index]}px]` : ''}
                      ${index === 0 ? (styleClassNames?.tableHeaders?.borderL ?? 'border-l-4') : ''}
                      ${index === 0 ? styleClassNames?.tableHeaders?.roundedL ?? 'rounded-tl-[20px] rounded-bl-[20px]': ''}
                      ${index === columns.length - 1 ? styleClassNames?.tableHeaders?.borderR ?? 'border-r-4' : ''}
                      ${index === columns.length - 1 ? styleClassNames?.tableHeaders?.roundedR ?? 'rounded-tr-[20px] rounded-br-[20px]' : ''}
                    `}
                    onClick={e => handleOrderChange(e, key.property)}
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
                            fill={styleClassNames?.sortIndicatorColor ?? '#FFF'}
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
            {displayedRange.length === 0 && (
              <tr
                role='row'
                data-row
                key={uuidv4()}
                className={`  
                  ${styleClassNames?.rows?.paddingB ?? ''}
                `}
                ref={rowRef}
              >
                <td
                  key={uuidv4()}
                  role='cell'
                  colSpan={columns.length}
                  className={`
                    ${styleClassNames?.rows?.paddingT ?? 'mt-[10px]'}
                    ${'text-center truncate'}
                    ${styleClassNames?.rows?.paddingX ?? 'px-[15px]'}
                  `}
                >
                    <div
                      className={`
                        ${styleClassNames?.rows?.oddRowBackgroundColor ?? 'bg-gray-500'}
                        ${styleClassNames?.rows?.textColor ?? ''}
                      `}
                    >
                      {textContent?.emptyTableText ?? 'No data available in table'}
                    </div>
                </td>
              </tr>
            )}

            {displayedRange.length > 0 && displayedRange.map((row: T, rowIndex: number): ReactNode => (
              <tr
                key={uuidv4()}
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
                  ${styleClassNames?.rows?.height ?? 'h-[30px]'}
                  ${styleClassNames?.rows?.paddingB ?? 'last:pt-[15px]'}
                `}
              >
                {columns.map((column, colIndex) => (
                  Object.keys(row).includes(String(column.property)) && (
                    <td
                      title={row.id ? `id: ${row.id}` : ''}
                      key={uuidv4()}
                      role='cell'
                      className={`
                        ${styleClassNames?.cells ?? 'whitespace-nowrap'} py-[2.5px]
                      `}
                    >
                      <div
                        
                        className={`
                          flex justify-between items-center px-[10px] py-[5px] h-full transition-colors duration-200
                          ${styleClassNames?.rows?.textColor ?? ''}
                          ${
                            rowIndex % 2 === 0
                              ? styleClassNames?.rows?.oddRowBackgroundColor ?? 'bg-gray-500'
                              : styleClassNames?.rows?.evenRowBackgroundColor ?? 'bg-gray-600'
                          }
                          ${columnsWidth[colIndex] ? `w-[${columnsWidth[colIndex]}px]` : ''}
                          ${colIndex === 0
                            ? styleClassNames?.rows?.marginL ?? 'ml-[15px]'
                            : ''
                          }
                          ${colIndex === columns.length - 1
                            ? styleClassNames?.rows?.marginR ?? 'mr-[15px]'
                            : ''
                          }
                        `}
                      >
                        {column.render
                          ? column.render(row[column.property])
                          : row[column.property] as ReactNode
                        }
                      </div>
                    </td>
                  )))
                }
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>

      <div
        hidden={pagesNumbers.length < 2}
        className={`flex flex-col lg:flex-row gap-y-3.5 justify-between items-center mt-5`}
      >
        <p className='inline-block'>
          {allRows.length > Math.min(rangeLength * currentPage, allRows.length)
            ? (
                <span>
                  {textContent?.rangeInfoText?.showEntries_altText ?? 'Showing entries'}
                  <span className='font-bold'>{rangeLength * (currentPage - 1) + 1}</span>
                  {textContent?.rangeInfoText?.to_altText ?? 'to'}
                  <span className='font-bold'>{Math.min(rangeLength * currentPage, allRows.length)}</span>
                  {textContent?.rangeInfoText?.of_altText ?? 'of'}
                  <span className='font-bold'>{allRows.length}</span>
                  {textContent?.rangeInfoText?.entries_altText ?? 'entries'}
                </span>
              )
            : (
                <span>
                  {textContent?.rangeInfoText?.showEntries_altText ?? 'Showing entries'}
                  <span className='font-bold'>{rangeLength * (currentPage - 1) + 1}</span>
                  {textContent?.rangeInfoText?.to_altText ?? 'to'}
                  <span className='font-bold'>{allRows.length}</span>
                  {textContent?.rangeInfoText?.entries_altText ?? 'entries'}
                </span>
              )
            }
        </p>

        <div
          className={`
            flex items-center
            ${styleClassNames?.pagination?.paginationBlockHover ?? ''}
            ${ styleClassNames?.pagination?.rounded ?? 'rounded-[20px]'}
            ${ styleClassNames?.pagination?.border ?? 'border-2'}
            ${styleClassNames?.pagination?.buttonBorderColor ?? 'border-gray-300'}
            ${styleClassNames?.pagination?.buttonBackgroundColor ?? 'bg-gray-800'}
          `}
        >
          {currentPage - 1 >= 1 && (
            <button
              type='button'
              role='previousButton'
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`
                disabled:opacity-50 cursor-pointer
                ${styleClassNames?.pagination?.previousButtonPadding ?? 'pl-[20px] pr-3'}
                ${styleClassNames?.pagination?.previousButtonRoundedL ?? 'rounded-l-[20px]'}
                ${styleClassNames?.pagination?.textColor ?? 'text-white'}
                ${styleClassNames?.pagination?.buttonBackgroundColorHover ?? 'hover:bg-gray-500 py-[9px]'}
              `}
              aria-label='Previous page'
            >
              <svg className='rotate-180 h-[15px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill={styleClassNames?.pagination?.navButtonsColor ?? '#fff'}>
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
                    ? styleClassNames?.pagination?.currentPageButton ?? 'bg-blue-500 text-white first:rounded-l-[20px] last:rounded-r-[20px]'
                    : styleClassNames?.pagination?.otherpages ?? 'text-white hover:bg-gray-500 first:rounded-l-[20px] last:rounded-r-[20px] cursor-pointer'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <div
                key={index}
                className='flex items-start justify-start '>
                <span key={index} className='px-2 pb-2 text-white align-top'>
                  ...
                </span>
              </div>
            )
          )}

          {currentPage + 1 <= pagesNumber && (
            <button
              role='nextButton'
              aria-label='Next page'
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`
                disabled:opacity-50  cursor-pointer
                ${styleClassNames?.pagination?.nextButtonPadding ?? 'pl-3 pr-[20px]'}
                ${styleClassNames?.pagination?.nextButtonRoundedR ?? 'rounded-r-[20px]'}
                ${styleClassNames?.pagination?.textColor ?? 'text-white'}
                ${styleClassNames?.pagination?.buttonBackgroundColorHover ?? 'hover:bg-gray-500 py-[9px]'}
              `}
            >
              <svg className='h-[15px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill={styleClassNames?.pagination?.navButtonsColor ?? '#fff'}>
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