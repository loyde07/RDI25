import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Match } from './pages/tournois'; // si Match est exporté séparément sinon le mettre dans un fichier test dédié

describe('Match Component', () => {
  it('should call onWinner with team1 when score1 > score2', () => {
    const mockOnWinner = jest.fn();
    render(<Match team1="Team A" team2="Team B" onWinner={mockOnWinner} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '3' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '1' } });
    fireEvent.click(screen.getByText('Valider'));

    expect(mockOnWinner).toHaveBeenCalledWith('Team A');
  });

  it('should call onWinner with team2 when score2 > score1', () => {
    const mockOnWinner = jest.fn();
    render(<Match team1="Team A" team2="Team B" onWinner={mockOnWinner} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '2' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '5' } });
    fireEvent.click(screen.getByText('Valider'));

    expect(mockOnWinner).toHaveBeenCalledWith('Team B');
  });

  it('should not call onWinner if invalid input', () => {
    const mockOnWinner = jest.fn();
    render(<Match team1="Team A" team2="Team B" onWinner={mockOnWinner} />);

    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[1], { target: { value: '1' } });
    fireEvent.click(screen.getByText('Valider'));

    expect(mockOnWinner).not.toHaveBeenCalled();
  });
});
