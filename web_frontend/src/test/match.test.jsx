import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Match component', () => {
  it('affiche les noms des équipes', () => {
    render(<Match team1="France" team2="Brésil" onWinner={() => {}} />);
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('Brésil')).toBeInTheDocument();
  });

  it('déclare la bonne équipe gagnante', () => {
    const mockOnWinner = vi.fn(); // vi.fn() au lieu de jest.fn()
    render(<Match team1="France" team2="Brésil" onWinner={mockOnWinner} />);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '2' } }); // France
    fireEvent.change(inputs[1], { target: { value: '1' } }); // Brésil

    fireEvent.click(screen.getByRole('button', { name: /valider/i }));

    expect(mockOnWinner).toHaveBeenCalledWith('France');
  });

  it('ne fait rien si les scores sont invalides', () => {
    const mockOnWinner = vi.fn();
    render(<Match team1="France" team2="Brésil" onWinner={mockOnWinner} />);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: 'abc' } });
    fireEvent.change(inputs[1], { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /valider/i }));

    expect(mockOnWinner).not.toHaveBeenCalled();
  });
});
