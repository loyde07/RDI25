import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import axios from 'axios';
import Tournament from './Tournament'; // ajuste le chemin si besoin

vi.mock('axios'); // on "mocke" axios pour simuler l’API

describe('Tournament component', () => {
  beforeEach(() => {
    vi.resetAllMocks(); // on nettoie les mocks avant chaque test
  });

  it('charge et affiche les matchs du premier round', async () => {
    // On simule une réponse d’API avec 8 équipes
    axios.get.mockResolvedValueOnce({
      data: [
        { nom: 'Team A' },
        { nom: 'Team B' },
        { nom: 'Team C' },
        { nom: 'Team D' },
        { nom: 'Team E' },
        { nom: 'Team F' },
        { nom: 'Team G' },
        { nom: 'Team H' },
      ],
    });

    render(<Tournament />);

    // Attendre que les équipes soient affichées
    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
    });

    // Vérifie qu’on a bien 4 matchs (8 équipes)
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBe(8); // 2 champs par match x 4 matchs
  });

  it('simule un tournoi complet jusqu’à la finale', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { nom: 'T1' },
        { nom: 'T2' },
        { nom: 'T3' },
        { nom: 'T4' },
        { nom: 'T5' },
        { nom: 'T6' },
        { nom: 'T7' },
        { nom: 'T8' },
      ],
    });

    render(<Tournament />);

    // Attendre que les équipes soient affichées
    await waitFor(() => {
      expect(screen.getByText('T1')).toBeInTheDocument();
    });

    // 1. Remplir les scores du premier round (4 matchs)
    const inputs = screen.getAllByRole('spinbutton');
    for (let i = 0; i < inputs.length; i += 2) {
      fireEvent.change(inputs[i], { target: { value: '1' } });     // team1
      fireEvent.change(inputs[i + 1], { target: { value: '0' } }); // team2
    }

    // 2. Valider tous les premiers matchs
    const buttons = screen.getAllByRole('button', { name: /valider/i });
    buttons.slice(0, 4).forEach((btn) => fireEvent.click(btn));

    // 3. Valider les demi-finales
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /valider/i }).length).toBeGreaterThan(4);
    });

    const semiInputs = screen.getAllByRole('spinbutton').slice(8, 12);
    for (let i = 0; i < semiInputs.length; i += 2) {
      fireEvent.change(semiInputs[i], { target: { value: '1' } });
      fireEvent.change(semiInputs[i + 1], { target: { value: '0' } });
    }

    screen.getAllByRole('button', { name: /valider/i }).slice(4, 6).forEach((btn) => fireEvent.click(btn));

    // 4. Valider la finale
    await waitFor(() => {
      expect(screen.getByText(/En attente des demi-finales.../)).not.toBeInTheDocument();
    });

    const finaleInputs = screen.getAllByRole('spinbutton').slice(-2);
    fireEvent.change(finaleInputs[0], { target: { value: '3' } });
    fireEvent.change(finaleInputs[1], { target: { value: '2' } });

    screen.getAllByRole('button', { name: /valider/i }).slice(-1)[0].click();

    // 5. Vérifie le vainqueur affiché
    await waitFor(() => {
      expect(screen.getByText(/🏆 Vainqueur/)).toBeInTheDocument();
    });
  });
});
