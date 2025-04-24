import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Tournament from './Tournament';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');

const mockTeams = [
  { nom: 'Team A' },
  { nom: 'Team B' },
  { nom: 'Team C' },
  { nom: 'Team D' },
  { nom: 'Team E' },
  { nom: 'Team F' },
  { nom: 'Team G' },
  { nom: 'Team H' },
];

describe('Tournament Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockTeams });
  });

  it('should fetch teams and render first round of matches', async () => {
    render(<Tournament />);

    await waitFor(() => {
      expect(screen.getAllByText(/Team [A-H]/).length).toBeGreaterThan(0);
    });

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBe(8); // 4 matches x 2 teams
  });

  it('should simulate a full tournament flow', async () => {
    render(<Tournament />);

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
    });

    const inputs = screen.getAllByRole('spinbutton');
    const buttons = screen.getAllByText('Valider');

    // Round 1
    for (let i = 0; i < 4; i++) {
      userEvent.clear(inputs[i * 2]);
      userEvent.type(inputs[i * 2], '2');
      userEvent.clear(inputs[i * 2 + 1]);
      userEvent.type(inputs[i * 2 + 1], '1');
      userEvent.click(buttons[i]);
    }

    // Round 2
    await waitFor(() => {
      expect(screen.getAllByText('Valider').length).toBe(2); // 2 matches
    });

    const round2Inputs = screen.getAllByRole('spinbutton');
    const round2Buttons = screen.getAllByText('Valider');

    userEvent.clear(round2Inputs[0]);
    userEvent.type(round2Inputs[0], '3');
    userEvent.clear(round2Inputs[1]);
    userEvent.type(round2Inputs[1], '1');
    userEvent.click(round2Buttons[0]);

    userEvent.clear(round2Inputs[2]);
    userEvent.type(round2Inputs[2], '2');
    userEvent.clear(round2Inputs[3]);
    userEvent.type(round2Inputs[3], '0');
    userEvent.click(round2Buttons[1]);

    // Final
    await waitFor(() => {
      expect(screen.getAllByText('Valider').length).toBe(1); // final match
    });

    const finalInputs = screen.getAllByRole('spinbutton');
    const finalButton = screen.getByText('Valider');

    userEvent.clear(finalInputs[0]);
    userEvent.type(finalInputs[0], '1');
    userEvent.clear(finalInputs[1]);
    userEvent.type(finalInputs[1], '0');
    userEvent.click(finalButton);

    await waitFor(() => {
      expect(screen.getByText(/🏆 Vainqueur/)).toBeInTheDocument();
    });
  });
});
