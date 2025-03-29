import './App.css'
import Table from './components/Table/Table'
import type { Column } from './components/Table'

interface RowData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number
};

function App() {
  const columns: Column<RowData>[] = [
    {
      displayName: "Prénom",
      property: "firstName",
      type: "string",
    },
    {
      displayName: "Nom de famille",
      property: "lastName",
      type: "string",
      render: (value: string | number) => {
        return String(value).toUpperCase();
      }
    },
    {
      displayName: "Téléphone",
      property: "phone",
      type: "number",
    }
  ];
  
  const rows: RowData[] = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: 1234567890,
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: 9876543210
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@email.com",
      phone: 5555555555
    },
    {
      id: 4,
      firstName: "Alice",
      lastName: "Williams",
      email: "alice.williams@email.com",
      phone: 1112223333
    },
    {
      id: 5,
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie.brown@email.com",
      phone: 4445556666
    },
    {
      id: 6,
      firstName: "David",
      lastName: "Lee",
      email: "david.lee@email.com",
      phone: 7778889999
    },
    {
      id: 7,
      firstName: "Eve",
      lastName: "Garcia",
      email: "eve.garcia@email.com",
      phone: 2223334444
    },
    {
      id: 8,
      firstName: "Frank",
      lastName: "Davis",
      email: "frank.davis@email.com",
      phone: 6667778888
    },
    {
      id: 9,
      firstName: "Grace",
      lastName: "Wilson",
      email: "grace.wilson@email.com",
      phone: 9990001111
    },
    {
      id: 10,
      firstName: "Hank",
      lastName: "Miller",
      email: "hank.miller@email.com",
      phone: 3334445555
    },
    {
      id: 11,
      firstName: "Ivy",
      lastName: "Anderson",
      email: "ivy.anderson@email.com",
      phone: 6667778888
    },
    {
      id: 12,
      firstName: "Jack",
      lastName: "Taylor",
      email: "jack.taylor@email.com",
      phone: 9990001111
    },
    {
      id: 13,
      firstName: "Kate",
      lastName: "Moore",
      email: "kate.moore@email.com",
      phone: 2223334444
    },
    {
      id: 14,
      firstName: "Liam",
      lastName: "Jackson",
      email: "liam.jackson@email.com",
      phone: 5556667777
    },
    {
      id: 15,
      firstName: "Mia",
      lastName: "White",
      email: "mia.white@email.com",
      phone: 8889990000
    },
    {
      id: 16,
      firstName: "Noah",
      lastName: "Harris",
      email: "noah.harris@email.com",
      phone: 1112223333
    },
    {
      id: 17,
      firstName: "Olivia",
      lastName: "Martin",
      email: "olivia.martin@email.com",
      phone: 4445556666
    },
    {
      id: 18,
      firstName: "Peter",
      lastName: "Thompson",
      email: "peter.thompson@email.com",
      phone: 7778889999
    },
    {
      id: 19,
      firstName: "Quinn",
      lastName: "Garcia",
      email: "quinn.garcia@email.com",
      phone: 2223334444
    },
    {
      id: 20,
      firstName: "Rachel",
      lastName: "Lee",
      email: "rachel.lee@email.com",
      phone: 5556667777
    },
    {
      id: 21,
      firstName: "Sam",
      lastName: "Davis",
      email: "sam.davis@email.com",
      phone: 8889990000
    },
    {
      id: 22,
      firstName: "Taylor",
      lastName: "Wilson",
      email: "taylor.wilson@email.com",
      phone: 1112223333
    },
    {
      id: 23,
      firstName: "Uma",
      lastName: "Anderson",
      email: "uma.anderson@email.com",
      phone: 4445556666
    },
    // {
    //   id: 24,
    //   firstName: "Victor",
    //   lastName: "Taylor",
    //   email: "victor.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 25,
    //   firstName: "Wendy",
    //   lastName: "Moore",
    //   email: "wendy.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 26,
    //   firstName: "Xavier",
    //   lastName: "Jackson",
    //   email: "xavier.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 27,
    //   firstName: "Yvonne",
    //   lastName: "White",
    //   email: "yvonne.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 28,
    //   firstName: "Zachary",
    //   lastName: "Harris",
    //   email: "zachary.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 29,
    //   firstName: "Ava",
    //   lastName: "Martin",
    //   email: "ava.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 30,
    //   firstName: "Benjamin",
    //   lastName: "Thompson",
    //   email: "benjamin.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 31,
    //   firstName: "Cora",
    //   lastName: "Garcia",
    //   email: "cora.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 32,
    //   firstName: "Dylan",
    //   lastName: "Lee",
    //   email: "dylan.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 33,
    //   firstName: "Ella",
    //   lastName: "Davis",
    //   email: "ella.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 34,
    //   firstName: "Finn",
    //   lastName: "Wilson",
    //   email: "finn.wilson@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 35,
    //   firstName: "Greta",
    //   lastName: "Anderson",
    //   email: "greta.anderson@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 36,
    //   firstName: "Hank",
    //   lastName: "Taylor",
    //   email: "hank.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 37,
    //   firstName: "Ivy",
    //   lastName: "Moore",
    //   email: "ivy.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 38,
    //   firstName: "Jack",
    //   lastName: "Jackson",
    //   email: "jack.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 39,
    //   firstName: "Kelly",
    //   lastName: "White",
    //   email: "kelly.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 40,
    //   firstName: "Liam",
    //   lastName: "Harris",
    //   email: "liam.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 41,
    //   firstName: "Mia",
    //   lastName: "Martin",
    //   email: "mia.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 42,
    //   firstName: "Noah",
    //   lastName: "Thompson",
    //   email: "noah.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 43,
    //   firstName: "Olivia",
    //   lastName: "Garcia",
    //   email: "olivia.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 44,
    //   firstName: "Peter",
    //   lastName: "Lee",
    //   email: "peter.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 45,
    //   firstName: "Quinn",
    //   lastName: "Davis",
    //   email: "quinn.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 46,
    //   firstName: "Rachel",
    //   lastName: "Wilson",
    //   email: "rachel.wilson@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 47,
    //   firstName: "Sam",
    //   lastName: "Anderson",
    //   email: "sam.anderson@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 48,
    //   firstName: "Taylor",
    //   lastName: "Taylor",
    //   email: "taylor.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 49,
    //   firstName: "Uma",
    //   lastName: "Moore",
    //   email: "uma.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 50,
    //   firstName: "Victor",
    //   lastName: "Jackson",
    //   email: "victor.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 51,
    //   firstName: "Walter",
    //   lastName: "White",
    //   email: "walter.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 52,
    //   firstName: "Xavier",
    //   lastName: "Harris",
    //   email: "xavier.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 53,
    //   firstName: "Yvonne",
    //   lastName: "Martin",
    //   email: "yvonne.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 54,
    //   firstName: "Zachary",
    //   lastName: "Thompson",
    //   email: "zachary.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 55,
    //   firstName: "Ava",
    //   lastName: "Garcia",
    //   email: "ava.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 56,
    //   firstName: "Benjamin",
    //   lastName: "Lee",
    //   email: "benjamin.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 57,
    //   firstName: "Cora",
    //   lastName: "Davis",
    //   email: "cora.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 58,
    //   firstName: "Dylan",
    //   lastName: "Wilson",
    //   email: "dylan.wilson@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 59,
    //   firstName: "Ella",
    //   lastName: "Anderson",
    //   email: "ella.anderson@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 60,
    //   firstName: "Finn",
    //   lastName: "Taylor",
    //   email: "finn.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 61,
    //   firstName: "Greta",
    //   lastName: "Moore",
    //   email: "greta.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 62,
    //   firstName: "Hank",
    //   lastName: "Jackson",
    //   email: "hank.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 63,
    //   firstName: "Ivy",
    //   lastName: "White",
    //   email: "ivy.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 64,
    //   firstName: "Jack",
    //   lastName: "Harris",
    //   email: "jack.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 65,
    //   firstName: "Kelly",
    //   lastName: "Martin",
    //   email: "kelly.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 66,
    //   firstName: "Liam",
    //   lastName: "Thompson",
    //   email: "liam.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 67,
    //   firstName: "Mia",
    //   lastName: "Garcia",
    //   email: "mia.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 68,
    //   firstName: "Noah",
    //   lastName: "Lee",
    //   email: "noah.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 69,
    //   firstName: "Olivia",
    //   lastName: "Davis",
    //   email: "olivia.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 70,
    //   firstName: "Peter",
    //   lastName: "Wilson",
    //   email: "peter.wilson@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 71,
    //   firstName: "Quinn",
    //   lastName: "Anderson",
    //   email: "quinn.anderson@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 72,
    //   firstName: "Rachel",
    //   lastName: "Taylor",
    //   email: "rachel.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 73,
    //   firstName: "Sam",
    //   lastName: "Moore",
    //   email: "sam.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 74,
    //   firstName: "Taylor",
    //   lastName: "Jackson",
    //   email: "taylor.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 75,
    //   firstName: "Uma",
    //   lastName: "White",
    //   email: "uma.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 76,
    //   firstName: "Victor",
    //   lastName: "Harris",
    //   email: "victor.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 77,
    //   firstName: "Walter",
    //   lastName: "Martin",
    //   email: "walter.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 78,
    //   firstName: "Xavier",
    //   lastName: "Thompson",
    //   email: "xavier.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 79,
    //   firstName: "Yvonne",
    //   lastName: "Garcia",
    //   email: "yvonne.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 80,
    //   firstName: "Zachary",
    //   lastName: "Lee",
    //   email: "zachary.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 81,
    //   firstName: "Ava",
    //   lastName: "Davis",
    //   email: "ava.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 82,
    //   firstName: "Benjamin",
    //   lastName: "Wilson",
    //   email: "benjamin.wilson@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 83,
    //   firstName: "Cora",
    //   lastName: "Anderson",
    //   email: "cora.anderson@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 84,
    //   firstName: "Dylan",
    //   lastName: "Taylor",
    //   email: "dylan.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 85,
    //   firstName: "Ella",
    //   lastName: "Moore",
    //   email: "ella.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 86,
    //   firstName: "Finn",
    //   lastName: "Jackson",
    //   email: "finn.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 87,
    //   firstName: "Greta",
    //   lastName: "White",
    //   email: "greta.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 88,
    //   firstName: "Hank",
    //   lastName: "Harris",
    //   email: "hank.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 89,
    //   firstName: "Ivy",
    //   lastName: "Martin",
    //   email: "ivy.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 90,
    //   firstName: "Jack",
    //   lastName: "Thompson",
    //   email: "jack.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 91,
    //   firstName: "Kelly",
    //   lastName: "Garcia",
    //   email: "kelly.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 92,
    //   firstName: "Liam",
    //   lastName: "Lee",
    //   email: "liam.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 93,
    //   firstName: "Mia",
    //   lastName: "Davis",
    //   email: "mia.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 94,
    //   firstName: "Noah",
    //   lastName: "Wilson",
    //   email: "noah.wilson@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 95,
    //   firstName: "Olivia",
    //   lastName: "Anderson",
    //   email: "olivia.anderson@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 96,
    //   firstName: "Peter",
    //   lastName: "Taylor",
    //   email: "peter.taylor@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 97,
    //   firstName: "Quinn",
    //   lastName: "Moore",
    //   email: "quinn.moore@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 98,
    //   firstName: "Rachel",
    //   lastName: "Jackson",
    //   email: "rachel.jackson@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 99,
    //   firstName: "Sam",
    //   lastName: "White",
    //   email: "sam.white@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 100,
    //   firstName: "Taylor",
    //   lastName: "Harris",
    //   email: "taylor.harris@email.com",
    //   phone: 1112223333
    // },
    // {
    //   id: 101,
    //   firstName: "Uma",
    //   lastName: "Martin",
    //   email: "uma.martin@email.com",
    //   phone: 4445556666
    // },
    // {
    //   id: 102,
    //   firstName: "Victor",
    //   lastName: "Thompson",
    //   email: "victor.thompson@email.com",
    //   phone: 7778889999
    // },
    // {
    //   id: 103,
    //   firstName: "Walter",
    //   lastName: "Garcia",
    //   email: "walter.garcia@email.com",
    //   phone: 2223334444
    // },
    // {
    //   id: 104,
    //   firstName: "Xavier",
    //   lastName: "Lee",
    //   email: "xavier.lee@email.com",
    //   phone: 5556667777
    // },
    // {
    //   id: 105,
    //   firstName: "Yvonne",
    //   lastName: "Davis",
    //   email: "yvonne.davis@email.com",
    //   phone: 8889990000
    // },
    // {
    //   id: 106,
    //   firstName: "Zach",
    //   lastName: "Wilson",
    //   email: "zach.wilson@email.com",
    //   phone: 1112223333
    // }
  ];

  return (
    <Table
      columns={columns}
      rows={rows}
      defaultOrder={
        {
          property: 'lastName',
          order: 'asc'
        }
      }
      styleClassNames={{
        rows: {
          textColor: 'text-white',
        }
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
  )
}

export default App;