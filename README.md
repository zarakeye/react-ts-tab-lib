# react-ts-tab-lib : A React table component implemented in TypeScript

    **react-ts-tab-lib** is a typescript library developed with React that renders a Table component rendering a table made of columns defining properties, rows corresponding to objects having these properties. In other words, this component needs at least that the user communicates to it on the one hand a list of entries (for the rows) and their type (let's call this type T), and on the other hand a list of the properties of T of each entry that the user wants to process/display (the columns).

## Installation

    **react-ts-tab-lib** requires react version 18.3.1 or later and can be used in your project by running the following command at the root of your project:

```bash
npm install react-ts-tab-lib
```

To integrate the Table component from react-ts-tab-lib into a component or page in your project, start by importing the Table component at the top of their codebase (/src/MyPage/MyPage.jsx, /src/MyPage/MyPage.tsx, /src/MyPage/index.jsx ou /src/MyPage/index.tsx) :

```ts
import { Table } from 'react-ts-tab-lib'
```

However, to pass the data to the Table component, you must pass them as props in an object of type TableProps which, as we said before, takes at least a 'rows' array of objects of type T and a 'columns' array of objects each containing a key of T: you must therefore also import the Column and TableProps types :

```ts
import type { Column, TableProps } from 'react-ts-tab-lib'
```

## Usage

    Let's imagine that you have as inputs objects of the type User defined as:

```ts
type User {
    id: number;
    firstName: string:
    lastName: string;
    email: string;
    phone: number
}
```

Start by defining the columns of your table, in other words the properties you want to display/process. To do this, you will create an array **columns** of **Column** type objects, which is defined as follows:

```ts
export type Column<T> = {
  property: keyof T;
  displayName?: string;
  type: DataType;
  renderer?: (value: T[keyof T]) => ReactNode;
  specificColumnClassname?: string;
}
```

As you can see, some keys of the Column type are optional and we will cover them later, but for now, let's focus on the required keys. We have two of them: **property** and **type**.

**property** will contain the name of the property taken from the keys of the T type, while **type** will specify its type, allowing us to process values ​​based on their type, which will be taken from the values ​​**string**, **number**, **date**, **boolean** ou **custom**.

Since T is a generic type, you must specify this when defining the columns array :

```ts
const columns: Column<User> = [
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
```

So we chose to define the columns with according to the keys firstName, lastName and phone of the type User.
Let's see what our table looks like.

![ ](/home/stephane/Images/Captures%20d’écran/Copie%20d'écran_20250307_151147.png)

We see our 3 columns but since we have not yet entered our data to process, we can see the message '**No data available in table**' under the column header line.
So let's now add the entries. You need to create an array row of object of type T that we have defined here as type User :

```ts
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
```

Then you must encapsulate these 2 tables within an object of type TableProps that you will pass as props to the Table component using the spread operator :

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

-----------------------------------------------------------

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

------------------------------------------------------------

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

- **onRowHover** : Function to define a behavior when hovering over a row

- **onRowClick** : Function to define a behavior when clicking on a row

- **componentGlobalClassname** : Defines the general style of the component with Tailwind.

- **sampleOptionsClassname**  : Defines the style of the sample option select labels.

- **customSelect** : Defines the style of the sample option select.

- **searchLabelClassname** : Defines the style of the search bar label

- **searchInputClassname** : Defines the style of the search bar.

- **sampleInfoClassname** : Defines the style of the sample info.

- **tableClassname** : Defines the general style of the table.

- **globalColumnsClassname** : Defines the general style of the column headers

- **sortButtonClassname** : Object of type { style: string, color: string } that defines the style of the container of the triangles indicating the order in the column headers, as well as the default color of the triangles.

- **activeSortButtonClassname** : Object of type { style: string, color: string } that defines the style of the container of the triangle indicating the active column and order, as well as the color of the triangle.

- **rowsClassname** : Defines the style of the rows of the table

- **sampleInfoClassname** : Defines the style of the sample info notes

- **currentPagePaginationButtonClassname** : Defines the style of the indicator of the current page

- **pagesPaginationButtonClassname** : Defines the style of the indicator links of the other pages of the table.

- **paginationNavButtonsClassname** : Defines the style of the Previous and Next buttons

- **cellClassname** : Allows you to define the style of a cell in the table.

- **numberOfDisplayedRows** : Array of numbers allowing to define your own sampling options.

- **defaultOrder** : Object of type { property: keyof T; order: OrderType; }, keyof T corresponding to a key of type T (in our case, the User type), and order can take the values ​​'asc' or 'desc'. It allows to define the column on the basis of which the entries will be ordered, and the direction of the order, 'asc' or 'desc'

## API Props

In this section, we assume **User** is the type of data you are processing.

Class names satisfies Tailwiind.

| Props      | DescriptionType                                              | Type                          | Properties            | Property type             | Required | Default value |
|:---------- | ------------------------------------------------------------ | ----------------------------- | --------------------- | ------------------------- | -------- | ------------- |
| rows       | Array of all the User entries you populate your table with   | User []                       |                       |                           | True     |               |
| columns    | Array of which keys of User type you want for your columns   | Array(keyof User)             |                       |                           | True     |               |
| classNames | Object of type ClassNames you use to customize the rendering | Object of type **ClassNames** |                       |                           | False    |               |
|            |                                                              |                               | tableBackgroundColor  | string                    | False    |               |
|            |                                                              |                               | tableBorders          | string                    | False    |               |
|            |                                                              |                               | tablePaddings         | string                    | False    |               |
|            |                                                              |                               | tableMargins          | string                    | False    |               |
|            |                                                              |                               | tableRounded          | string                    | False    |               |
|            |                                                              |                               |                       |                           |          |               |
|            |                                                              |                               | tableHeaders          | TableHeadersClassNames    | False    |               |
|            |                                                              | TableHeadersClassNames        |                       |                           |          |               |
|            |                                                              |                               | font                  | string                    | False    |               |
|            |                                                              |                               | backgroundColor       | string                    | False    |               |
|            |                                                              |                               | color                 | string                    | False    |               |
|            |                                                              |                               | borderY               | string                    | False    |               |
|            |                                                              |                               | borderL               | string                    | False    |               |
|            |                                                              |                               | borderR               | string                    | False    |               |
|            |                                                              |                               | borderColor           | string                    | False    |               |
|            |                                                              |                               | roundedL              | string                    | False    |               |
|            |                                                              |                               | roundedR              | string                    | False    |               |
|            |                                                              |                               | padding               | string                    | False    |               |
|            |                                                              |                               | margin                | string                    | False    |               |
|            |                                                              |                               |                       |                           |          |               |
|            |                                                              |                               | samplingOptions       | SamplingOptionsClassNames | False    |               |
|            |                                                              | SamplingOptionsClassNames     |                       |                           |          |               |
|            |                                                              |                               | buttonBackgroundColor | string                    | False    |               |
|            |                                                              |                               | buttonText            | string                    | False    |               |
|            |                                                              |                               | buttonBorder          | string                    | False    |               |
|            |                                                              |                               | buttonRounded         | string                    | False    |               |
|            |                                                              |                               | buttonPadding         | string                    | False    |               |
|            |                                                              |                               | buttonMargin          | string                    | False    |               |
