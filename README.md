# react-ts-tab-lib : A React table component implemented in TypeScript

**react-ts-tab-lib** is a typescript library developed with React that renders a Table component rendering a table made of columns defining properties, rows corresponding to objects having these properties. In other words, this component needs at least that the user communicates to it on the one hand a list of entries (for the rows) and their type (let's call this type T), and on the other hand a list of the properties of T of each entry that the user wants to process/display (the columns).

## Installation

**react-ts-tab-lib** requires react version 18.3.1 or later and can be used in your project by running the following command at the root of your project:

```bash
npm install react-ts-tab-lib -D
```

To integrate the Table component from react-ts-tab-lib into a component or page in your project, start by importing the Table component at the top of their codebase (/src/MyPage/MyPage.jsx, /src/MyPage/MyPage.tsx, /src/MyPage/index.jsx ou /src/MyPage/index.tsx) :

```tsx
import { Table } from 'react-ts-tab-lib'
```

However, to pass the data to the Table component, you must pass them as props in an object of type TableProps which, as we said before, takes at least a 'rows' array of objects of type T and a 'columns' array of objects each containing a key of T: you must therefore also import the Column and TableProps types :

```ts
import type { Column, TableProps } from 'react-ts-tab-lib'
```

## Usage

Let's imagine that you have as inputs objects of the type User defined as:

```tsx
type User {
    id: number;
    firstName: string:
    lastName: string;
    email: string;
    phone: number
}
```

so you will create an array 'rows' of User objects :

```ts
const rows: User[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com'
        phone: 0978907876
    },
    ...
    ...
    {
        id: 15,
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony.stark@starkindustry.com',
        phone: 1467357882
    }
]
```

and an array 'columns' of objects of type Column<User> having at least the string  property **property** defined, which must be the name of a key of type User: let's say firstName, lastName and email :

```ts
const columns: Column<User> = [
    {
       property: 'firstName' 
    },
    {
       property: 'lastName' 
    },
    {
       property: 'phone' 
    }
]
```

Then you must encapsulate these 2 tables within an object of type TableProps that you will pass as props to the Table component using the spread operator :

```tsx
const tableProps: TableProps<User> = { columns, rows }


return (
    <Table key={rows.length} {...tableProps} />
)
```

> Note that it is necessary to add a **key** attribute to which you will give the value **rows.length** if the **rows** array is likely to see its size change. The **rows.length** value assigned to the **key** attribute will therefore change dynamically, which will force React to re-render the component.
> In any case, adding it but when it is not necessary will not change the behavior of the component in any way, so we strongly recommend doing it for safety: it is a **good practice**!

You get a component with a very spartan style but very functional ![ ](/home/stephane/Images/Captures%20d’écran/Copie%20d'écran_20250303_000421.png)

You can observe different areas in the rendered component. The major part is occupied by the table. You will notice triangle buttons next to the name of a column. These buttons allow, by taking the corresponding property as a reference, to order the entries in ascending or descending order in the case of a property of type number or date, or in alphabetical order or its inverse in the case of a string type.
But it is common to have a large number of entries in a table, and it would be annoying to have to scroll again and again to browse them all. This is why you have a sampling system of the displayed entries, complete with a pagination system to browse the entries page by page.
So you have a select 'Displayed entries' which overhangs the table and allows to choose among several options the maximum number of entries displayed per page.
Just below the table, on the left, you have an indication of the sample displayed with the number of the first entry of the sample and its last, as well as the total number of entries in the table.
On this same line, on the right, you find the different buttons used to navigate between the different pages of the table with an immediate indication of the current page as well as the number of pages.
I will end this first presentation with the search bar at the top right, which allows you to filter the displayed entries. Indeed, when you enter something in the bar, a case-insensitive match search is immediately launched on each property of each entry in the table and all those whose at least one of the properties contains the entry will be displayed.

But I doubt you want to keep this style for your project so let's see how to customize the component so that it best meets your expectations because yes, good news, it is almost entirely configurable just with props.

### Use cases :

- 
