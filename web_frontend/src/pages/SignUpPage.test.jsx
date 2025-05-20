import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';

import { MemoryRouter } from "react-router-dom";
import React from "react";
import { describe, it, expect, vi } from "vitest"; // ou Jest sinon
import SignUpPage from "./SignUpPage";
import { useAuthStore } from "../store/authStore";
import { useEcoleStore } from "../store/ecoleStore";

// On mock le store
vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("../store/ecoleStore", () => ({
  useEcoleStore: vi.fn()
}));

describe("SignUpPage", () => {
  let mockSignup; 

  beforeEach(() => {

    useEcoleStore.mockReturnValue({
      ecoles: [{ _id: '123', nom: 'EPHEC' }],
      fetchEcoles: vi.fn()
    });
  

    mockSignup = vi.fn(); 
    useAuthStore.mockReturnValue({
      signup: mockSignup, 
      error: '',
      isLoading: false,
    });
  });

  it("renders all input fields, selects and signup button", () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText(/^Nom$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Prenom/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Pseudo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Adresse mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument(); 

    expect(screen.getByText(/École/i)).toBeInTheDocument();
    expect(screen.getByText(/Niveau/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /S'inscrire/i })).toBeInTheDocument();
  });
  

  it("shows error if last name is too short", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "D" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
    await waitFor(() => {
      expect(screen.getByText(/Le nom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
    });
  });

  it("accepts first name with hyphen", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "Jean-Luc" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "jeanluc42" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "jeanluc@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
    });
  });
  

  it("shows error if first name is too short", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "J" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le prénom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
    });
  });

  it("shows error if pseudo is too short or too long", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "jo" } }); // trop court
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo doit contenir entre 3 et 20 caractères/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "a".repeat(21) } }); // trop court

    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo doit contenir entre 3 et 20 caractères/i)).toBeInTheDocument();
    });
    
  
  });
  
  it("shows error if pseudo contains only numbers", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123" } });
    
    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo ne peut pas être uniquement composé de chiffres/i)).toBeInTheDocument();
    });
  });

  it("shows error if pseudo contains invalid characters", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "john@doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le pseudo ne peut contenir que lettres, chiffres, tirets et underscores/i)).toBeInTheDocument();
    });
  });

  it("shows error if form fields are empty", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument;
    });
  });

  it("shows error if email is invalid", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "pass_word123" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));

    const errorMessage = await screen.findByText((content, element) => 
      content.includes('Veuillez entrer une adresse email valide')
    );
    expect(errorMessage).toBeInTheDocument();;
    
  });

  it("disables the submit button and shows loading when isLoading is true", () => {
    useAuthStore.mockReturnValue({
      signup: mockSignup,
      error: '',
      isLoading: true,
    });
  
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    const button = screen.getByTestId("submit-button");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
  

  it("accepts email with subdomain", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    // Renseigne les autres champs valides...
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), {target: { value: "john@sub.domain.com" }});
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass_word123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
    });
  });
  

  it("shows error if password is too short", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "123" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins 6 caractères/i)).toBeInTheDocument();;
    });
  });

  it("shows error if password has no uppercase letter", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "password123!" } });
  
    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins une majuscule/i)).toBeInTheDocument();;
    });
  });

  it("shows error if password has no number", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Password!" } });
    
    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins un chiffre/i)).toBeInTheDocument();;
    });
  });
    
  it("shows error if password has no special character", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Password123" } });
    
    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe doit contenir au moins un caractère spécial/i)).toBeInTheDocument();;
    });
  });
  
  it("shows error if password is same as pseudo or email", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "John_12" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    
    // Cas où mot de passe == pseudo
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "John_12" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas être identique au pseudo ou à l'email/i)).toBeInTheDocument();;
    });
  
    // Cas où mot de passe == email
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "john@example.com" } });
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas être identique au pseudo ou à l'email/i)).toBeInTheDocument();;
    });
  });

  it("shows error if password contains spaces", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Pass word123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas contenir d'espaces/i)).toBeInTheDocument();
    });
  });

    it("shows error if password is too long", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Passwwwwwwwwwwwwwwwwwwwwwwwwwwwwwword123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas dépasser 20 caractères/i)).toBeInTheDocument();
    });
  });

  it("shows error if ecole is unselected", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByTestId("submit-button"));
    
    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    });
  });


  it("shows error if niveau is unselected", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
    
    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    });
  });



    it("shows error if password is too long", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Passwwwwwwwwwwwwwwwwwwwwwwwwwwwwwword123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));
  
    fireEvent.click(screen.getByTestId("submit-button"));
  
    await waitFor(() => {
      expect(screen.getByText(/Le mot de passe ne doit pas dépasser 20 caractères/i)).toBeInTheDocument();
    });
  });

  it("shows error if ecole is unselected", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByText(/École/i));
    await waitFor(() => screen.getByText("EPHEC"));
    fireEvent.click(screen.getByText("EPHEC"));

    fireEvent.click(screen.getByTestId("submit-button"));
    
    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    });
  });


  it("shows error if niveau is unselected", async () => {
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/^Nom$/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText(/Prenom/i), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), { target: { value: "johnny" } });
    fireEvent.change(screen.getByPlaceholderText(/Adresse mail/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: "Password123!" } });

    fireEvent.click(screen.getByText(/Niveau/i));
    await waitFor(() => screen.getByText("Iron 2"));
    fireEvent.click(screen.getByText("Iron 2"));

    fireEvent.click(screen.getByTestId("submit-button"));
    
    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    });
  });



  it("shows backend error if signup fails", async () => {
    useAuthStore.mockReturnValue({
      signup: mockSignup,
      error: "Adresse email déjà utilisée",
      isLoading: false,
    });
  
    render(<MemoryRouter><SignUpPage /></MemoryRouter>);
  
    await waitFor(() => {
      expect(screen.getByText(/Adresse email déjà utilisée/i)).toBeInTheDocument();;
    });
  });
  
});
