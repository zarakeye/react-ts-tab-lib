# react-ts-tab-lib : A React table component implemented in TypeScript

    A small TypeScript library developed for React rendering a generic table of selected properties of typed entries. It allows to customize the displayed name of every property as column header and how its value is rendered. A search bar allows to look for some occurrence of its input in entries.

## Installation

    **react-ts-tab-lib** requires react 19 and can be used in your project by running the following command at the root of your project:

```bash
npm install react-ts-tab-lib
```

## Basic usage

    Start by importing the `Table` component and the prop type `Columns`  from the library.

Then, create an `Columns` array to define which properties you want to diplay and their types, and a second array containing your typed entries.

Let's say we're working on entries of type `User` : here is a basic usage of our library:

```ts
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
                columns={columns}
                rows={rows}
            />
        </main>
    )
}


export default App;
```

![Desciption](/public/basic_usage.jpg)

> By default, entries are ordered on the first column in ascending order, so in alphabetic order as firstName is a string.

## Use cases

### To change the default order

    Add a `defaultOrder` prop to precise the property and the order. Let's define lastName and descending order :

```ts
<Table
    columns={columns}
    rows={rows}
    defaultOrder={{
        property: 'lastName',
        order: 'asc'
    }}
/>
```

![Description](/public/change_default_order.jpg)

### To toggle the order between ascending and descending order :

     Just click on the header of the column.

### To customize how the value of a property is rendered :

    For example, let's imagine that we want `lastName` values to be uppercased.

You have to define into its object in the `columns` array a `render` function as below :

```ts
const columns: Column<User>[] = [
    ...,
    {
        proprety: 'lastName',
        type: 'string',
        render: (value: string | number | null) => value && String(value).toUpperCase()
    },
    ...
]
```

### To customize texts

Add a `textContent` prop :

```ts
<Table
    columns
    defaultOrder={{
        property: 'lastName',
        order: 'asc'
    }}
    textContent={{
        searchLabel: 'Rechercher',
        sampleLabelPrefix: 'Affiche ',
        sampleLabelSuffix: ' employés par page',
        emptyTableText: 'Aucun employé',
        rangeInfoText: {
          showEntries_altText: 'Affichage des employés ',
          to_altText: ' à ',
          of_altText: ' sur ',
          entries_altText: ''
        },
        previousPageButtonLabel: 'Page précédente',
        nextPageButtonLabel: 'Page suivante'
      }}
/>
```

> `<mark>`*Note that you must respect this definition of custtomizeSampleInfoTextContent if you want to customize the message* `</mark>`

### To define a background color on hover a row :

    In your main CSS file, add that :

```css
[data-row]:hover div {
  background-color: #e8e8e8 !important;
}
```

> `<mark>`Do not forget the mention !important `</mark>`

### To define a behaviour when you click on a row :

    Let's say we have a page `Profile` accessible at the route `/profile/:id` managed by react-router. We have to import the hook `useNavigate` from `react-router-dom` and define the handler of the event prop `onRowClick`

```ts
<Table
    ...
    onRowClick={
       (row: Employee | null) => {
           if (!row) return;
           navigate(`/profile/${row?.id}`);
       }
    }
/>
```

### To customize range options

    Give to the `rangeOptions` prop an array of numbers representing the lengths available for sampling.

```ts
<Table
    ...
    rangeOptions={[5, 12, 15, 25]}
/>
```

---

### To make the component more visually appealing and to respect the graphic charter of my page.

We recommend to use Tailwindcss to define the styles you want to apply to the component.

Look at the table of the API props below to know the options you have :

## API Props

In this section, we assume **User** is the type of data you are processing.

Class names satisfies Tailwiind.

| Props                  | DescriptionType                                              | Type                                | Properties                   | Property type           | Required | Default value                 |
| :--------------------- | ------------------------------------------------------------ | ----------------------------------- | ---------------------------- | ----------------------- | -------- | ----------------------------- |
| rows                   | Array of all the User entries you populate your table with   | User []                             |                              |                         | True     |                               |
| columns                | Array of which keys of User type you want for your columns   | Array(keyof User)                   |                              |                         | True     |                               |
| defaultOrder           | Object defining the column to order by default and the order |                                     |                              | ActiveOrderType `<T>` | False    |                               |
| textContent            | Obejct containing the customized texts                       |                                     |                              | TextContentType         | False    |                               |
| onRowHover()           | Function to customize a row hovering                         | (row: T\| null) => void;            |                              |                         | False    |                               |
| onRowClick()           |                                                              | (row: T\| null) => void;            |                              |                         | False    |                               |
| defaultSamplingOptions | Array of numbers defining samples length options             |                                     |                              |                         | False    | [10, 20, 50, 100]             |
| styleClassNames        | Object of type ClassNames you use to customize the rendering | Object of type **StyleClassNames** |                              |                         | False    |                               |
|                        |                                                              |                                     | tableBackgroundColor         | string                  | False    |                               |
|                        |                                                              |                                     | tableBorders                 | string                  | False    | 'border-4 border-gray-300'    |
|                        |                                                              |                                     | tablePaddings                | string                  | False    | 'px-[5px] pt-[5px] pb-[15px]' |
|                        |                                                              |                                     | tableMargins                 | string                  | False    |                               |
|                        |                                                              |                                     | tableRounded                 | string                  | False    | 'rounded-[23px]'              |
|                        |                                                              |                                     | tableHeaders                 | TableHeadersClassNames  | False    |                               |
|                        |                                                              |                                     | rangeOptionsAndSearchBarArea | string                  | False    | ''                            |
|                        |                                                              |                                     | rangeOptions                 | RangeOptionsClassNames  | False    |                               |
|                        |                                                              |                                     | searchBar                    | SearchBarClassNames     | False    |                               |
|                        |                                                              |                                     | sortIndicatorColor           | string                  | False    |                               |
|                        |                                                              |                                     | rows                         | RowsClassNames          | False    |                               |
|                        |                                                              |                                     | cells                        | string                  | False    |                               |
|                        |                                                              |                                     | pagination                   | PaginationClassNames    | False    |                               |

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

## rangeOptions options

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
