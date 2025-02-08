/* eslint-disable @typescript-eslint/no-explicit-any */
import { join } from 'path';
import { type ChangeEvent, type ReactNode, useState, useRef, useEffect, JSX } from 'react';

export type Column<T> = {
  displayName: string;
  property: keyof T;
  filter?: 'asc' | 'desc' | 'default';
  type: 'string' | 'number' | 'date' | 'boolean';
  order?: number;
}

export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
}

function Table <T extends Record<string, any>>({ columns = [], rows = [] }: TableProps<T>): JSX.Element {
  const [sampleLength, setSampleLength] = useState<number>(10);
  const optionsOfNumberOfDisplayedEntries = [10, 20, 50, 100];
  const [allRows, setAllRows] = useState<T[]>(rows);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [restOfEntries, setRestOfEntries] = useState<number>(0);
  const [displayedSample, setDisplayedSample] = useState<T[]>([]);
  const [editingColumn, setEditingColumn] = useState<keyof T | null>(null);
  const [searchQueries, setSearchQueries] = useState<{ [key in keyof T]: T[key] }[]>([]);

  const ascFilteringButtonRef = useRef<HTMLButtonElement>(null);
  const descFilteringButtonRef = useRef<HTMLButtonElement>(null);

  const columnNameRef = useRef<HTMLDivElement>(null);

  const handleSort = (e: React.MouseEvent<HTMLButtonElement>, property: keyof T, type: 'string' | 'number' | 'date' | 'boolean', sort: 'asc' | 'desc') => {
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
              return new Date(a).getTime() - new Date(b).getTime();
            } else {
              throw new Error('Invalid date type');
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

  const handleDisplayedEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSampleLength(parseInt(e.target.value));
  }

  const handleHeaderClick = (property: keyof T) => setEditingColumn(property);

  const handleInputBlur = () => setEditingColumn(null);

  const handleFilter = (e: ChangeEvent<HTMLInputElement>, property: keyof T) => {
    setSearchQueries(prev => ({ ...prev, [property]: e.target.value }));
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchBaseArray: T[] = [];
    rows.forEach(row => {
      const mergedRow = Object.values(row).join(' ').toString().toLowerCase().trim();
      // searchBaseArray.push(Object.values(row).join(' ').toString().toLowerCase().trim())
      if (mergedRow.includes(e.target.value.trim().toLowerCase())) {
        searchBaseArray.push(row);
      }
    });
    // searchBaseArray.filter(row => row.includes(e.target.value.trim().toLowerCase()));
    // const filteredRows =
    // const filteredRows = searchBaseArray.findIndex((row) => row.includes(e.target.value.trim()));
    // console.log('filteredRows', filteredRows);

    setAllRows(searchBaseArray);

  }

  useEffect(() => {
    setRestOfEntries(allRows.length % sampleLength);
    setPagesNumber( Math.ceil(allRows.length / sampleLength));
  }, [ allRows.length, sampleLength]);

  useEffect(() => {
    if (currentPage < pagesNumber) {
      setDisplayedSample(allRows.slice(sampleLength * (currentPage - 1), currentPage * sampleLength - 1));
    } else {
      setDisplayedSample(allRows.slice(sampleLength * (currentPage - 1)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ allRows, sampleLength, pagesNumber, restOfEntries]);

  return (
    <>
      <div className='flex justify-between mt-5 mb-2.5'>
        <div>
          <select
            name="sampleLength"
            id="sampleLength"
            onChange={handleDisplayedEntriesChange}
            className='border-1 border-black rounded-[5px] mr-1.5'
          >
            {optionsOfNumberOfDisplayedEntries.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <label htmlFor="sampleLength">displayed entries</label>
        </div>

        <div>
          <label htmlFor="search">Search</label>
          <input type="text" name="search" id="search" className='ml-1.5 border-1 border-black rounded-[5px]' onChange={(e) => handleSearch(e)}/>
        </div>
      </div>
      
      <table className='w-full border-2'>
        <thead >
          <tr>
            {columns.map((key, index) => (
              <th 
                key={index} 
                style={{ width: `${100 / columns.length}%` }}
                className='px-[10px] py-[5px] border-2 align-top'
              >
                <div className='flex items-center justify-between'>
                  {editingColumn === key.property ? (
                    <div className='flex flex-col h-[55px] gap-1'>
                      <label htmlFor={`search-${String(key.property)}`} className='pr-2.5'>{key.displayName} :</label>
                      <input
                        type="text"
                        className='border-1 border-black rounded-[5px] w-[100%]'
                        onChange={(e) => handleFilter(e, key.property)}
                        onBlur={handleInputBlur}
                        autoFocus
                        name={`search-${String(key.property)}`}
                      />
                    </div>
                  ) : (
                    <div className='flex items-center w-[100%] h-[55px]'>
                      <p
                        ref={columnNameRef}
                        className='mr-2 flex-1 cursor-pointer'
                        onClick={() => handleHeaderClick(key.property) }                     
                      >
                        {key.displayName}
                      </p>
                      <div className='flex flex-col gap-1'>
                        <button type='button' ref={ascFilteringButtonRef} onClick={(e) => handleSort(e, key.property, key.type, 'asc')} className='cursor-pointer'>
                          <svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#175729">
                            <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                          </svg>
                        </button>
                        <button type='button' ref={descFilteringButtonRef} onClick={(e) => handleSort(e, key.property, key.type, 'desc')} className='cursor-pointer'>
                          <svg className='rotate-180' xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#175729">
                            <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )} 
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='pb-2.5'>
          {displayedSample.map((row: T, rowIndex: number): ReactNode => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td title={`id: ${row.id}`}
                  key={colIndex}
                  className='px-[15px] truncate'
                  style={{ width: `${100 / columns.length}%` }}
                >
                  {row[column.property] as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-between mt-5'>
        <p>Showing entries {sampleLength * (currentPage - 1) + 1} to {sampleLength * currentPage > allRows.length ? allRows.length : sampleLength * currentPage} of {allRows.length} entries</p>
        {currentPage >= 2 && <button type='button' onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>}
        <p>Page {currentPage} of {pagesNumber}</p>
        {pagesNumber && currentPage < pagesNumber && <button type='button' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>}
      </div>
    </>
  );
}

export default Table;

