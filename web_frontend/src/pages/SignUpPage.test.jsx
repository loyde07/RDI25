import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';

import { MemoryRouter } from "react-router-dom";
import React from "react";
import { describe, it, expect, vi } from "vitest"; // ou Jest sinon
import SignUpPage from "./SignUpPage";
import { useAuthStore } from "../store/authStore";

// On mock le store
vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("SignUpPage", () => {
  let mockSignup; 

  beforeEach(() => {
    mockSignup = vi.fn(); 
    useAuthStore.mockReturnValue({
      signup: mockSignup, 
      error: '',
      isLoading: false,
    });
  });

  it("renders all input fields and signup button", () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    expect(screen.getByPlaceholderText(/^Nom$/i)).to.exist;
    expect(screen.getByPlaceholderText(/prenom/i)).to.exist;
    expect(screen.getByPlaceholderText(/pseudo/i)).to.exist;
    expect(screen.getByPlaceholderText(/adresse mail/i)).to.exist;
    expect(screen.getByPlaceholderText(/password/i)).to.exist;
    expect(screen.getByRole("button", { name: /S'inscrire/i })).to.exist;
  });

  it("shows error if last name is too short", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "D" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Pass_word123" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le nom doit contenir au moins 2 caractères/i)).to.exist;
    });
  });

  it("shows error if first name is too short", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "J" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Pass_word123" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le prénom doit contenir au moins 2 caractères/i)).to.exist;
    });
  });

  it("shows error if pseudo is too short or too long", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "jo" } }); // trop court
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Pass_word123" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo doit contenir entre 3 et 30 caractères/i)).to.exist;
    });
  
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "a".repeat(31) } }); // trop long
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo doit contenir entre 3 et 30 caractères/i)).to.exist;
    });
  });
  
  it("shows error if pseudo contains only numbers", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Pass_word123" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo ne peut pas être uniquement des chiffres/i)).to.exist;
    });
  });

  it("shows error if pseudo contains invalid characters", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "john@doe" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Pass_word123" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores/i)).to.exist;
    });
  });

  it("shows error if form fields are empty", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    const button = screen.getByTestId("submit-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).to.exist;
    });
  });

  it("shows error if email is invalid", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    const errorMessage = await screen.findByText((content, element) => 
      content.includes('Veuillez entrer une adresse email valide')
    );
    expect(errorMessage).to.exist;
    
  });

  it("shows error if password is too short", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "123" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins 6 caractères/i)).to.exist;
    });
  });

  it("shows error if password has no uppercase letter", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password123!" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins une majuscule/i)).to.exist;
    });
  });

  it("shows error if password has no number", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Password!" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins un chiffre/i)).to.exist;
    });
  });
    
  it("shows error if password has no special character", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Password123" } });
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins un caractère spécial/i)).to.exist;
    });
  });
  
  it("shows error if password is same as pseudo or email", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    
    // Cas où mot de passe == pseudo
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "johnny" } });
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas être identique au pseudo ou à l'email/i)).to.exist;
    });
  
    // Cas où mot de passe == email
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "john@example.com" } });
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas être identique au pseudo ou à l'email/i)).to.exist;
    });
  });

  it("calls signup and redirects on valid form submission", async () => {

    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Pass_word123" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith("Doe", "John", "johnny", "john@example.com", "Pass_word123");
    });
  });

  it("disables button and shows loader when loading", () => {
    useAuthStore.mockReturnValue({
      signup: vi.fn(),
      error: '',
      isLoading: true,
    });

    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    const button = screen.getByTestId("submit-button");
    expect(button).toBeDisabled(); // Vérifie que le bouton est désactivé
    expect(screen.getByTestId("loader")).to.exist; // Le loader Lucide génère une balise <svg role="img">
  });
});
