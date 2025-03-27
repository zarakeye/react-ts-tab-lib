import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Column } from './Table';
import Table from './Table';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
}

const columns: Column<User>[] = [
  {
    property: 'firstName',
    displayName: 'Prénom',
    type: 'string',
  },
  {
    property: 'lastName',
    displayName: 'Nom de famille',
    type: 'string',
  },
  {
    property: 'phone',
    displayName: 'Téléphone',
    type: 'string',
  },
];

const rows: User[] = [
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
];

describe('Table Component', () => {
  beforeEach(() => {
    render(
      <Table
        columns={columns}
        rows={rows}
        defaultOrder={{ property: 'lastName', order: 'asc' }}
        textContent={{
          searchLabel: 'Rechercher',
          emptyTableText: 'Aucun employé',
          previousPageButtonLabel: 'Page précédente',
          nextPageButtonLabel: 'Page suivante'
        }}
      />
    );

    screen.debug();
  });

  it('should display correctly columns headers', () => {
    expect(screen.getByText('Prénom')).toBeInTheDocument();
    expect(screen.getByText('Nom de famille')).toBeInTheDocument();
    expect(screen.getByText('Téléphone')).toBeInTheDocument();
  });
  
  it('should display correctly rows', async () => {
    await waitFor(() => {
      expect(screen.getByText('Brown')).toBeInTheDocument();
      expect(screen.getByText('Jackson')).toBeInTheDocument();
      expect(screen.queryAllByText(/White/i)).toHaveLength(0);
    });
  });

  it('should toggle sorting order when clicking on column header',  () => {
    // Vérifier que les noms de famille sont triés par défaut en ASC
    const firstRowBeforeClick = screen.getAllByRole('row')[1]; // La première ligne après l'en-tête
    expect(firstRowBeforeClick.textContent).toMatch(/Anderson/i);
    
    // Trouver l'en-tête de la colonne "Nom" et cliquer dessus
    const lastNameHeader = screen.getByRole('button', { name: /nom de famille/i });
    fireEvent.click(lastNameHeader);

    // Vérifier que les noms de famille sont triés en DESC
    const firstRowAfterFirstClick = screen.getAllByRole('row')[1];
    expect(firstRowAfterFirstClick.textContent).toMatch(/Wilson/i); // Le premier lastName attendu en desc
  })

  it('should filter rows based on search input', () => {
    const searchInput = screen.getByLabelText('Rechercher');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('should display empty table text when no rows match the search input', async () => {
    const searchInput = screen.getByLabelText('Rechercher');
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('Aucun employé')).toBeInTheDocument();
    })
    
  });

  it('should manage pagination', () => {
    const nextButton = screen.getByRole('nextButton');
    fireEvent.click(nextButton);
    
    expect(screen.getByText(/Johnson/i)).toBeInTheDocument(); // Johnson is on the second page();
    expect(screen.queryAllByText(/Lee/i)).toHaveLength(2); // Lee is on the second page();
    expect(screen.queryByText(/Davis/i)).not.toBeInTheDocument(); // Davis is on the first page();
    
  });
});