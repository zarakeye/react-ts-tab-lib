/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [restOfEntries, setRestOfEntries] = useState<number>(0);
  const [displayedSample, setDisplayedSample] = useState<T[]>([]);

  const alphabeticalSortButtonRef = useRef<HTMLButtonElement>(null);
  const reverseAlphabeticalSortButtonRef = useRef<HTMLButtonElement>(null);

  const handleDisplayedEntriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSampleLength(parseInt(e.target.value));
  }

  useEffect(() => {
    setRestOfEntries(rows.length % sampleLength);
    setPagesNumber( Math.ceil(rows.length / sampleLength));
  }, [ rows.length, sampleLength]);

  useEffect(() => {
    if (currentPage < pagesNumber) {
      setDisplayedSample(rows.slice(sampleLength * (currentPage - 1), currentPage * sampleLength - 1));
    } else {
      setDisplayedSample(rows.slice(sampleLength * (currentPage - 1)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ rows, sampleLength, pagesNumber, restOfEntries]);

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
          <input type="text" name="search" id="search" className='ml-1.5 border-1 border-black rounded-[5px]'/>
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
                  <p className='mr-2'>{key.displayName}</p>
                  <div className='flex flex-col gap-1'>
                    <button type='button' ref={alphabeticalSortButtonRef} >
                      <svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#e8eaed">
                        <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                      </svg>
                    </button>
                    <button type='button' ref={reverseAlphabeticalSortButtonRef}>
                      <svg className='rotate-180' xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 -960 960 960" width="10px" fill="#e8eaed">
                        <path d="M152-160q-23 0-35-20.5t1-40.5l328-525q12-19 34-19t34 19l328 525q13 20 1 40.5T808-160H152Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedSample.map((row: T, rowIndex: number): ReactNode => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className='px-[10px] truncate'
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
        <p>Showing entries {sampleLength * (currentPage - 1) + 1} to {sampleLength * currentPage > rows.length ? rows.length : sampleLength * currentPage} of {rows.length} entries</p>
        {currentPage >= 2 && <button type='button' onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>}
        <p>Page {currentPage} of {pagesNumber}</p>
        {pagesNumber && currentPage < pagesNumber && <button type='button' onClick={() => setCurrentPage(currentPage + 1)}>Next</button>}
      </div>
    </>
  );
}

export default Table;

