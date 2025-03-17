# react-ts-tab-lib : A React table component implemented in TypeScript

    A small TypeScript library developed for React rendering a generic table of selected properties of typed entries. It allows to customize the displayed name of every property as column header and how its value is rendered. A search bar allows to look for some occurrence of its input in entries.

## Installation

    **react-ts-tab-lib** requires react 19 and can be used in your project by running the following command at the root of your project:

```bash
npm install react-ts-tab-lib
```

## Basic usage

    Start by importing the `Table` component and the prop type `Columns`  from the library.

Then, create an `Columns` array to define which properties you want to diplay and a second array containing your typed entries.

Let's say we're working on entries of type `User` : here is a basic usage of our library:

```tsx
import { Table } from 'react-ts-tab-lib'
import type { Column } from 'react-ts-tab-lib'

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
}

function App(): JSX.Element {
    const columns: Column<User>[] = [
        {
            property: 'firstName',
            type: 'string'
        },
        {
            property: 'lastName',
            type: 'string'
        },
        {        
            property: 'phone',
            type: 'number'
        }
    ]

    const rows: User[] = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            phone: 1234567890,
        },
        ...........
        ...........
        {
            id: 108,
            firstName: "Tony",
            lastName: "Stark",
            email: "tony.stark@starkindustry.com",
            phone: 1356445656
        }
    }

    const tableProps: TableProps<User> {
        columns,
        rows
    }

    return (
        <main>
            <Table
                keys={ rows.length }
                { ...tableProps }
            />
        </main>
    )
}
```

![Desciption](/public/basic_usage.jpg)

> By default, entries are ordered on the first column in ascending order, so in alphabetic order as firstName is a string.

## Use cases

### To change the default order

Add a defaultOrder prop to precise the property and the order. Let's define lastName and descending order :

```tsx
import { Table } from 'react-ts-tab-lib'
import type { Column, TableProps } from 'react-ts-tab-lib'

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
}


function App(): JSX.Element {
    const columns: Column<User>[] = [
        {
            property: 'firstName',
            type: 'string'
        },
        {
            property: 'lastName',
            type: 'string'
        },
        {        
            property: 'phone',
            type: 'number'
        }
    ]

    const rows: User[] = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            phone: 1234567890,
        },
        ...........
        ...........
        {
            id: 108,
            firstName: "Tony",
            lastName: "Stark",
            email: "tony.stark@starkindustry.com",
            phone: 1356445656
        }
    }

    const tableProps: TableProps<User> {
        columns,
        rows,
        defaultOrder={
            {
                property: 'lastName',
                order: 'asc'
            }
        }
    }

    return (
        <main>
            <Table
                keys={ rows.length }

                { ...tableProps }
            />
        </main>
    )
}
```

![Description](/public/change_default_order.jpg)

### To customize texts

Add a textContent prop :

```tsx
import { Table } from 'react-ts-tab-lib'
import type { Column, TableProps } from 'react-ts-tab-lib'

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
}


function App(): JSX.Element {
    const columns: Column<User>[] = [
        {
            property: 'firstName',
            type: 'string'
        },
        {
            property: 'lastName',
            type: 'string'
        },
        {  
            property: 'phone',
            type: 'number'
        }
    ]

    const rows: User[] = [
        {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            phone: 1234567890,
        },
        ...........
        ...........
        {
            id: 108,
            firstName: "Tony",
            lastName: "Stark",
            email: "tony.stark@starkindustry.com",
            phone: 1356445656
        }
    }

    const tableProps: TableProps<User> {
        columns,
        rows,
        defaultOrder={
            {
                property: 'lastName',
                order: 'asc'
            }
        },
        textContent={{
        searchLabel: 'Rechercher',
        sampleLabelPrefix: 'Affiche ',
        sampleLabelSuffix: ' employés par page',
        emptyTableText: 'Aucun employé',
        custtomizeSampleInfoTextContent: (sampleBegin, sampleEnd, sampleLength) => {
          if (sampleLength > sampleEnd) {
            return <span>Affichage des employés <span className='font-bold'>{sampleBegin}</span> à <span className='font-bold'>{sampleEnd}</span> sur <span className='font-bold'>{sampleLength}</span></span>
          } else {
            return sampleLength > 1 ? <span>Affichage des employés <span className='font-bold'>'${sampleBegin}</span> à <span className='font-bold'>'${sampleEnd}</span></span>:''
          }
        },
        previousPageButtonLabel: 'Page précédente',
        nextPageButtonLabel: 'Page suivante'
      }}
    }

    return (
        <main>
                <Table
                    keys={ rows.length }
                    defaultOrder={
                            {
                                  property: 'lastName',
                                  order: 'asc'
                            }
                    }
                    { ...tableProps }
                />
        </main>
    )
}
```

> <mark>*Note that you must respect this definition of custtomizeSampleInfoTextContent if you want to customize the message*</mark>



### To define a background color on hover a row :

In your main CSS file, add that :

```css
[data-row]:hover div {
  background-color: #e8e8e8 !important;
}

```

> <mark>Do not forget the mention !important</mark>



![Description](/home/stephane/Documents/GitHub/OC-DA-JS-React/P14_OC_DA_JS_React/react-ts-tab-lib/public/customizing_texts.jpg)



### To define a behaviour when you click on a row :

Let's say we have 

```ts
const tableProps: TableProps<User> = { columns, rows }

return (
    <Table key={rows.length} {...tableProps} />
)
```

> Note that it is necessary to add a **key** attribute to which you will give the value **rows.length** if the **rows** array is likely to see its size change. The **rows.length** value assigned to the **key** attribute will therefore change dynamically, which will force React to re-render the component.
> In any case, adding it but when it is not necessary will not change the behavior of the component in any way, so we strongly recommend doing it for safety: it is a **good practice**!

From 2 entries, you are given, at the bottom left of the table, the number of the first and last entries currently displayed.
But if we have a large number of entries, it is more judicious to browse them by samples: for this, the select at the top left allows you to define the number of entries that we want to display at a time. When the number of lines is greater than the number selected for sampling, the table is paginated and navigation buttons and the current page appear at the bottom right while we have at the bottom left additional information on the total number of entries.
And here is our table now hydrated with enough entries to display all types of information and possible actions :

![ ](/home/stephane/Images/Captures%20d’écran/Copie%20d'écran_20250307_154938.png)

You get a component with a very spartan style but very functional.

The small opposite triangles next to the column header are indicators that the entries can be ordered based on their value for that property: ascending or descending for numbers, alphabetical or inverse for strings, chronological or inverse for dates, true or false for booleans. When you see 2 gray triangles superimposed in a column header, it means that the entries are not ordered according to the corresponding property.
On the other hand, when you see a single black triangle, it means that the entries are ordered according to that column. An upward triangle means ascending, alphabetical or chronological order, while a downward triangle means the opposite.
By default, the order is ascending (points upward) and is done on the first column. When you click on the header of another column, it is on that one that the order is done.
When you click on the same header multiple times in a row, the order is toggled with each click.

The search bar at the top right, which allows you to filter the displayed entries. Indeed, when you enter something in the bar, a case-insensitive match search is immediately launched on each property of each entry in the table and all those whose at least one of the properties contains the entry will be displayed.

We have shown you the default behavior of our Table component so far and, we must admit, it has a rather minimalist and spartan style for now. But, good news, our component is almost entirely customizable with a multitude of props to change the style of each element thanks to Tailwindcss or even change the texts. Let's see together how through common use cases.

### Use cases :

> *I want to modify words and texts in the component*

Ok. The words and the content of the component texts are customizable thanks to the **textContent** prop which is a **TextContentType** object type containing only optional keys:

```ts
type TextContentType = {
  searchLabel?: string | null;
  sampleLabelPrefix?: string | null;
  sampleLabelSuffix?: string | null;
  emptyTableText?: string | null;
  custtomizeSampleInfoTextContent?: (sampleBegin: number, sampleEnd: number, allRows: number) => string | null;
  previousPageButtonLabel?: string | null;
  nextPageButtonLabel?: string | null;
}
```

Let's assume that you want to translate the entire component into French, for example.
You will need to define the different possible properties of textContent:

- **searchLabel** : Allows you to modify the label of the search bar
- **sampleLabelPrefix** : changes the prefix label of the select by the number of entries per sample
- **sampleLabelSuffix** : changes the suffix label of the select by the number of entries per sample
- **emptyTableText** : Modifies the sentence that accompanies an empty table of entries
- **customizeSampleInfoTextContent** : Function that modifies the text giving information on the first and last entry of a sample as well as the total of entries
- **previousPageButtonLabel** : modifies the text displayed by the Previous button
- **nextPageButtonLabel** : modifies the text displayed by the Next button

In the tableProps prop, add the object :

```ts
textContent = {
    searchLabel: 'Rechercher',
    sampleLabelPrefix: 'Affiche ',
    sampleLabelSuffix: ' employés par page',
    emptyTableText: 'Aucun employé',
    custtomizeSampleInfoTextContent: (sampleBegin, sampleEnd, sampleLength) => {
      if (sampleLength > sampleEnd) {
        return `Affichage des employés ${sampleBegin} à ${sampleEnd} sur ${sampleLength}`
      } else {
        return sampleLength > 1 ? `Affichage des employés ${sampleBegin} à ${sampleEnd}`:''
      }
    },
    previousPageButtonLabel: 'Page précédente',
    nextPageButtonLabel: 'Page suivante'
}
```

We strongly advise you to scrupulously respect the structure of the definition of the **customizeSampleInfoTextContent(sampleBegin, sampleEnd, sampleLength)** function because if its logic is not well thought out, its rendering may be hazardous.

![ ](/home/stephane/Images/Captures%20d’écran/Copie%20d'écran_20250307_184031.png)

There you go! Mission accomplished!!... Next?...

---

> *I would like to customize the display name of my columns*

To do that, you must enter, for each column whose display name you want to customize, the displayName key of the object that corresponds to it in the columns table.

```ts
const columns: Column<User>[] = [
    {
      displayName: "Prénom",
      property: "firstName",
      type: "string",
    },
    {
      displayName: "Nom de famille",
      property: "lastName",
      type: "string",
    },
    {
      displayName: "Téléphone",
      property: "phone",
      type: "number",
    }
  ];
```

Which gives :

![ ](/home/stephane/Images/Captures%20d’écran/Copie%20d'écran_20250307_185802.png)

Now you have completely customized the component texts !!!

---

> *Now I would like to make the component more visually appealing and to respect the graphic charter of my page.*

To do this, you will use Tailwindcss to define the styles you want to apply to the component. Tailwind is a dependency of the library. You can define your own Tailwindcss themes and classes in your project; they will be usable for the component of our library.

The TableProps type is defined as :

```ts
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
```

All optional properties are those that you will use to style the component and customize its behaviours.

## API Props

In this section, we assume **User** is the type of data you are processing.

Class names satisfies Tailwiind.

| Props                  | DescriptionType                                              | Type                         | Properties           | Property type             | Required | Default value                 |
|:---------------------- | ------------------------------------------------------------ | ---------------------------- | -------------------- | ------------------------- | -------- | ----------------------------- |
| rows                   | Array of all the User entries you populate your table with   | User []                      |                      |                           | True     |                               |
| columns                | Array of which keys of User type you want for your columns   | Array(keyof User)            |                      |                           | True     |                               |
| defaultOrder           | Object defining the column to order by default and the order |                              |                      | ActiveOrderType`<T>`      | False    |                               |
| textContent            | Obejct containing the customized texts                       |                              |                      | TextContentType           | False    |                               |
| onRowHover()           | Function to customize a row hovering                         | (row: T\| null) => void;     |                      |                           | False    |                               |
| onRowClick()           |                                                              | (row: T\| null) => void;     |                      |                           | False    |                               |
| defaultSamplingOptions | Array of numbers defining samples length options             |                              |                      |                           | False    | [10, 20, 50, 100]             |
| classNames             | Object of type ClassNames you use to customize the rendering | Object of type**ClassNames** |                      |                           | False    |                               |
|                        |                                                              |                              | tableBackgroundColor | string                    | False    |                               |
|                        |                                                              |                              | tableBorders         | string                    | False    | 'border-4 border-gray-300'    |
|                        |                                                              |                              | tablePaddings        | string                    | False    | 'px-[5px] pt-[5px] pb-[15px]' |
|                        |                                                              |                              | tableMargins         | string                    | False    |                               |
|                        |                                                              |                              | tableRounded         | string                    | False    | 'rounded-[23px]'              |
|                        |                                                              |                              | tableHeaders         | TableHeadersClassNames    | False    |                               |
|                        |                                                              |                              | samplingOptions      | SamplingOptionsClassNames | False    |                               |
|                        |                                                              |                              | searchBar            | SearchBarClassNames       | False    |                               |
|                        |                                                              |                              | sortIndicatorColor   | string                    | False    |                               |
|                        |                                                              |                              | rows                 | RowsClassNames            | False    |                               |
|                        |                                                              |                              | cells                | string                    | False    |                               |
|                        |                                                              |                              | pagination           | PaginationClassNames      | False    |                               |

## tableHeaders options

| Option          | Description | Type    | Default value                         |
| --------------- | ----------- | ------- | ------------------------------------- |
| font            |             |         |                                       |
| backgroundColor |             | string  | 'bg-gray-800 hover:bg-gray-700'       |
| textColor       |             | string  | 'text-white'                          |
| borderY         |             | string  | 'border-y-4'                          |
| borderL         |             | string  | 'border-l-4'                          |
| borderR         |             | string  | 'border-r-4'                          |
| borderColor     |             |         | 'border-gray-300'                     |
| roundedL        |             | string  | 'rounded-tl-[20px] rounded-bl-[20px]' |
| roundedR        |             | string  | 'rounded-tr-[20px] rounded-br-[20px]' |
| padding         |             | string  | 'py-[5px]'                            |
| gap             |             | sttring | 'gap-2.5'                             |

## samplingOptions options

| Option                | Description | Type   | Default value                   |
| --------------------- | ----------- | ------ | ------------------------------- |
| buttonBackgroundColor |             | string | 'bg-gray-800 hover:bg-gray-700' |
| buttonText            |             | string | 'text-center text-white'        |
| buttonBorder          |             | string | 'border-4'                      |
| buttonRounded         |             | string | 'rounded-[20px]'                |
| buttonPadding         |             | string | 'px-[10px]'                     |
| menuBorder            |             | string | 'border-4'                      |
| menuBorderColor       |             | string | 'border-gray-300'               |
| menuRounded           |             | string | 'rounded-[20px]'                |
| menuPadding           |             | string | 'p-[10px]'                      |
| menuBackgroundColor   |             | string | 'bg-gray-800 hover:bg-gray-600' |

## searchBar options

| option               | Description | Type | Default value                           |
| -------------------- | ----------- | ---- | --------------------------------------- |
| inputPaddingX        |             |      | 'px-[10px]'                             |
| inputBackgroundColor |             |      | 'bg-white'                              |
| inputMarginL         |             |      | 'ml-[15px]'                             |
| inputBorder          |             |      | 'border-3'                              |
| inputBorderColor     |             |      | 'border-gray-300 hover:border-gray-400' |
| inputRounded         |             |      | 'rounded-[20px]'                        |
| inputFocusOutLine    |             |      | 'focus:outline-sky-400'                 |
| inputTextColor       |             |      | 'text-black'                            |

## rows options

| Option                 | Description | Type   | Default value |
| ---------------------- | ----------- | ------ | ------------- |
| oddRowBackgroundColor  |             | string | 'bg-gray-500' |
| evenRowBackgroundColor |             | string | 'bg-gray-600' |
| marginL                |             | string | 'ml-[15px]'   |
| marginR                |             | string | 'mr-[15px]'   |
| paddingT               |             | string | 'pt-[10px]'   |
| height                 |             | string | 'h-[30px]'    |
| textColor              |             | string |               |

## pagination options

| Option                     | Description | Type   | Default value       |
| -------------------------- | ----------- | ------ | ------------------- |
| paginationBlockHover       |             | string |                     |
| rounded                    |             | string | 'rounded-[20px]'    |
| border                     |             | string | 'border-2'          |
| buttonBorderColor          |             | string | 'border-gray-300'   |
| buttonBackgroundColor      |             | string | 'bg-gray-800'       |
| previousButtonPadding      |             | string | 'pl-[20px] pr-3'    |
| previousButtonRoundedL     |             | string | 'rounded-l-[20px]'  |
| nextButtonPadding          |             | string | 'pl-3 pr-[20px]'    |
| nextButtonRoundedR         |             | string | 'rounded-r-[20px]'  |
| buttonBackgroundColorHover |             | string | 'hover:bg-gray-500' |
| navButtonsColor            |             | string | '#fff'              |
