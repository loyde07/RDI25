import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import '@testing-library/jest-dom';
import React from "react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

import EditProfilePage from "./EditProfilePage"; // à adapter selon ton chemin
import { useAuthStore } from "../store/authStore";
import { useEcoleStore } from "../store/ecoleStore";
import { toast } from 'react-hot-toast';

const pseudoTestCases = [
  { value: "jean42", expected: false }, // déjà utilisé
  { value: "_Jean_", expected: true },
  { value: "J3@n", expected: false },  // contient @
  { value: "user.name", expected: false }, // contient .
  { value: "Xx_Jean_xX", expected: true },
  { value: "jean-dupont", expected: true },
  { value: "42", expected: false }, // chiffres seuls
  { value: "___", expected: true },
  { value: "🚀Jean", expected: false }, // emoji
  { value: "jean!", expected: false },
  { value: "jean\n42", expected: false }, // retour à la ligne
  { value: " jean ", expected: true }, // espaces mais seront trim
  { value: "J", expected: false }, // trop court
  { value: "JeanJeanJeanJean", expected: true }, // limite 16
  { value: "👑", expected: false },
  { value: "jéan", expected: false }, // accent
  { value: "jean__42__ok", expected: true },
  { value: "Jean*%$#", expected: false },
  { value: "Jean42Jean42", expected: true },
  { value: "J42!", expected: false }, // caractère spécial
  { value: "", expected: false }, // vide

];

const nomTestCases = [
  { value: "Jean", expected: true },
  { value: "D", expected: false, error: "Le nom doit contenir au moins 2 caractères." },
  { value: "Dupont", expected: false, error: "Aucune modification détectée." },
  { value: "Jean-Pierre", expected: true },
  { value: "Jean Pierre", expected: true },
  { value: "O'Connor", expected: false, error: "Nom invalide." },
  { value: "Lévesque", expected: true },
  { value: "Müller", expected: true },
  { value: "Smith!", expected: false, error: "Nom invalide." },
  { value: "Robert2", expected: false, error: "Nom invalide." },
  { value: " Martin ", expected: true },
  { value: "👑Martin", expected: false, error: "Nom invalide." },
  { value: "Jean_Pierre", expected: false, error: "Nom invalide." },
  { value: "Jean-Pierre-Durand", expected: true },
  { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", expected: false, error: "Nom invalide." }, // 31 char
  { value: "Élodie", expected: true },
  { value: "Ångström", expected: true },
  { value: "Dupont-Durand-Lelong", expected: true },
  { value: "Chloë", expected: true },
  { value: "Nørregaard", expected: true },
  { value: "", expected: false, error: "Aucune modification détectée." },

];

const prenomTestCases = [
  { value: "Alice", expected: true },
  { value: "A", expected: false, error: "Le prénom doit contenir au moins 2 caractères." },
  { value: "Jean", expected: false, error: "Aucune modification détectée." },
  { value: "Jean-Pierre", expected: true },
  { value: "Jean Pierre", expected: true },
  { value: "O'Connor", expected: false, error: "Prénom invalide." },
  { value: "Léa", expected: true },
  { value: "Müller", expected: true },
  { value: "Smith!", expected: false, error: "Prénom invalide." },
  { value: "Robert2", expected: false, error: "Prénom invalide." },
  { value: " Martin ", expected: true },
  { value: "👑Martin", expected: false, error: "Prénom invalide." },
  { value: "Jean_Pierre", expected: false, error: "Prénom invalide." },
  { value: "Jean-Pierre-Durand", expected: true }, // car regex autorise max 30 caractères mais pas de tirets multiples ?
  { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", expected: false, error: "Prénom invalide." }, // 31 char
  { value: "Élodie", expected: true },
  { value: "Ångström", expected: true },
  { value: "Chloë", expected: true },
  { value: "Nørregaard", expected: true },
  { value: "", expected: false, error: "Aucune modification détectée." },
];

const passwordTestCases = [
  { val1: "", val2: "", expected: false, error: "Aucune modification détectée." },   //  Mot de passe vide
  { val1: "Abcdef1!", val2: "Abcdef1!", expected: true },   // Valide
  { val1: "Abcdef1!", val2: "Abcdef2!", expected: false, error: "Les mots de passe ne correspondent pas." },   //  Mots de passe différents
  { val1: "Ab1!", val2: "Ab1!", expected: false, error: "Le mot de passe doit contenir au moins 6 caractères." },   //  Trop court
  { val1: "Abcdefghijklmnopqrstu1!", val2: "Abcdefghijklmnopqrstu1!", expected: false, error: "Le mot de passe ne doit pas dépasser 20 caractères." },   //  Trop long
  { val1: "abcdef1!", val2: "abcdef1!", expected: false, error: "Le mot de passe doit contenir au moins une majuscule." },  //  Pas de majuscule
  { val1: "Abcdefg!", val2: "Abcdefg!", expected: false, error: "Le mot de passe doit contenir au moins un chiffre." },   //  Pas de chiffre
  { val1: "Abcdefg1", val2: "Abcdefg1", expected: false, error: "Le mot de passe doit contenir au moins un caractère spécial." },  //  Pas de caractère spécial
  { val1: "Abcdef1 !", val2: "Abcdef1 !", expected: false, error: "Le mot de passe ne doit pas contenir d'espaces." },   //  Contient un espace
  { val1: "jean42", val2: "jean42", expected: false, error: "Le mot de passe ne doit pas être identique au pseudo ou à l'email." },   //  Identique au pseudo
  { val1: "jean@example.com", val2: "jean@example.com", expected: false, error: "Le mot de passe ne doit pas être identique au pseudo ou à l'email." },  //  Identique à l’email
  { val1: "A1!abc", val2: "A1!abc", expected: true },   //  Mot de passe limite basse (6 caractères valides)
  { val1: "A1!abcdefghijklmnopq", val2: "A1!abcdefghijklmnopq", expected: true },   //  Mot de passe limite haute (20 caractères valides)
  { val1: "MøtDeP@ss1!", val2: "MøtDeP@ss1!", expected: true },  //  Unicode accepté s’il est valide
  { val1: "aaa", val2: "aaa", expected: false, error: "Le mot de passe doit contenir au moins 6 caractères." },   //  Manque tout (aucune règle respectée)
  { val1: "Abcdefg$%3", val2: "Abcdefg$%3", expected: true },   //  Caractères spéciaux valides
  { val1: "Abcdefg1!", val2: "Abcdefg2!", expected: false, error: "Les mots de passe ne correspondent pas." },   // valeurs différentes
];


// Mocks des stores
vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("../store/ecoleStore", () => ({
  useEcoleStore: vi.fn(),
}));

vi.mock('react-hot-toast', () => {
  if (process.env.TEST_DISABLE_TOAST_MOCK === 'true') {
    return import('react-hot-toast'); // utilise le vrai
  }

  const toast = vi.fn();
  toast.success = vi.fn();
  toast.error = vi.fn();
  toast.loading = vi.fn();
  toast.dismiss = vi.fn();
  return {
    __esModule: true,
    default: toast,
    toast
  };
});

describe("EditProfilePage", () => {
  let mockUpdateUser;

  beforeEach(() => {
    process.env.TEST_DISABLE_TOAST_MOCK = 'true'; // active le vrai toast
  });

  // En haut de ton fichier de test (EditProfile.test.jsx)
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(() => {
    useEcoleStore.mockReturnValue({
      ecoles: [
        { _id: "123", nom: "EPHEC" },
        { _id: "456", nom: "ULB" },
        { _id: "789", nom: "UCL" },
        { _id: "101", nom: "VUB" },],
      fetchEcoles: vi.fn(),
    });

    mockUpdateUser = vi.fn();
    useAuthStore.mockReturnValue({
      updateProfile: mockUpdateUser,
      user: {
        lName: "Dupont",
        fName: "Jean",
        pseudo: "jean42",
        email: "jean@example.com",
        ecole_id: { _id: "123", nom: "EPHEC" },
        niveau: "Iron 2",
      },
      error: '',
      isLoading: false,
      isAuthenticated: true,
    });
  });

  beforeEach(() => {
    toast.error.mockClear();
    toast.success.mockClear();
    toast.loading.mockClear();
    toast.dismiss.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks(); // reset tous les mocks (y compris toast, updateUser, etc.)
  });



  it("renders form with user data and update button", () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

    expect(screen.getByDisplayValue("Dupont")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/^Jean$/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("jean42")).toBeInTheDocument();
    expect(screen.getByText("EPHEC")).toBeInTheDocument();
    expect(screen.getByText("Iron 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enregistrer les informations/i })).toBeInTheDocument();
  });

  nomTestCases.forEach(({ value, expected, error }) => {
    it(`test nom "${value}" - should be ${expected ? 'accepted' : `rejected with "${error}"`}`, async () => {
      render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

      const nomLabel = screen.getByLabelText("Nom");
      const nomContainer = nomLabel.closest("div");
      const pencilButton = nomContainer?.querySelector("button svg");

      if (pencilButton) {
        fireEvent.click(pencilButton.parentElement);
      }

      const input = screen.getByDisplayValue("Dupont"); // valeur initiale fictive
      fireEvent.change(input, { target: { value } });

      const checkButton = nomContainer?.querySelector("button svg[data-icon='check']") ||
        nomContainer?.querySelector("button > svg");

      if (checkButton) {
        fireEvent.click(checkButton.parentElement);
      }

      const submitButton = screen.getByRole("button", { name: /Enregistrer les informations/i });
      fireEvent.click(submitButton);

      if (expected) {
        await waitFor(() => {
          expect(mockUpdateUser).toHaveBeenCalledWith({ nom: value.trim() });
        });
        expect(toast.error).not.toHaveBeenCalled();
      } else {
        await waitFor(() => {
          expect(mockUpdateUser).not.toHaveBeenCalled();
          const errorCalls = toast.error.mock.calls.map(call => call[0]);
          expect(errorCalls).toContain(error); // plus souple

        });
      }

      mockUpdateUser.mockReset();
    });
  });

  prenomTestCases.forEach(({ value, expected, error }) => {
    it(`test prenom "${value}" - should be ${expected ? 'accepted' : `rejected with "${error}"`}`, async () => {
      render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

      const prenomLabel = screen.getByLabelText("Prénom");
      const prenomContainer = prenomLabel.closest("div");
      const pencilButton = prenomContainer?.querySelector("button svg");

      if (pencilButton) {
        fireEvent.click(pencilButton.parentElement);
      }

      const input = screen.getByDisplayValue("Jean"); // valeur initiale fictive
      fireEvent.change(input, { target: { value } });

      const checkButton = prenomContainer?.querySelector("button svg[data-icon='check']") ||
        prenomContainer?.querySelector("button > svg");

      if (checkButton) {
        fireEvent.click(checkButton.parentElement);
      }

      const submitButton = screen.getByRole("button", { name: /Enregistrer les informations/i });
      fireEvent.click(submitButton);

      if (expected) {
        await waitFor(() => {
          expect(mockUpdateUser).toHaveBeenCalledWith({ prenom: value.trim() });
        });
        expect(toast.error).not.toHaveBeenCalled();
      } else {
        await waitFor(() => {
          expect(mockUpdateUser).not.toHaveBeenCalled();
          const errorCalls = toast.error.mock.calls.map(call => call[0]);
          expect(errorCalls).toContain(error); // plus souple

        });
      }

      mockUpdateUser.mockReset();
    });
  });

  pseudoTestCases.forEach(({ value, expected }) => {
    it(`test pseudo "${value}" - should be ${expected ? 'accepted' : 'rejected'}`, async () => {
      render(<MemoryRouter><EditProfilePage /></MemoryRouter>);
      const pseudoLabel = screen.getByLabelText("Pseudo");
      const pseudoContainer = pseudoLabel.closest("div");
      const pencilButton = pseudoContainer?.querySelector("button svg");

      if (pencilButton) {
        fireEvent.click(pencilButton.parentElement);
      }

      const input = screen.getByDisplayValue("jean42");
      fireEvent.change(input, { target: { value } });

      const checkButton = pseudoContainer?.querySelector("button svg[data-icon='check']") ||
        pseudoContainer?.querySelector("button > svg");

      if (checkButton) {
        fireEvent.click(checkButton.parentElement);
      }

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      if (expected) {
        await waitFor(() => {
          expect(mockUpdateUser).toHaveBeenCalledWith({ pseudo: value.trim() });
        });
      } else {
        await waitFor(() => {
          expect(mockUpdateUser).not.toHaveBeenCalled();
        });
      }

      // Reset mock for next test case
      mockUpdateUser.mockReset();
    });
  });

  it("test école choices are visible", () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

    const niveauLabel = screen.getByLabelText("Niveau");
    const niveauContainer = niveauLabel.closest("div");
    const pencilButton = niveauContainer?.querySelector("button svg");

    if (pencilButton) {
      fireEvent.click(pencilButton.parentElement);
    }

    const select = screen.getByLabelText("École");
    const options = within(select).getAllByRole("option");
    expect(options.length).toBe(4);
    expect(options[0].textContent).toBe("EPHEC");
    expect(options[1].textContent).toBe("ULB");
    expect(options[2].textContent).toBe("UCL");
    expect(options[3].textContent).toBe("VUB");
  });

  it("test école selection", async () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

    const ecoleLabel = screen.getByLabelText("École");
    const ecoleContainer = ecoleLabel.closest("div");
    const pencilButton = ecoleContainer?.querySelector("button svg");

    if (pencilButton) {
      fireEvent.click(pencilButton.parentElement);
    }

    const select = screen.getByLabelText("École");
    fireEvent.change(select, { target: { value: "456" } }); // ULB

    const checkButton = ecoleContainer?.querySelector("button svg[data-icon='check']") ||
      ecoleContainer?.querySelector("button > svg");

    if (checkButton) {
      fireEvent.click(checkButton.parentElement);
    }

    const submitButton = screen.getByRole("button", { name: /Enregistrer les informations/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ ecole_id: "456" });
    });
  });

  it("test niveau choices are visible", () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);
    const select = screen.getByLabelText("Niveau");
    const options = within(select).getAllByRole("option");
    expect(options.length).toBe(24);
    expect(options[0].textContent).toBe("Iron 1");
    expect(options[1].textContent).toBe("Iron 2");
    expect(options[2].textContent).toBe("Iron 3");
    expect(options[3].textContent).toBe("Bronze 1");
    expect(options[4].textContent).toBe("Bronze 2");
    expect(options[5].textContent).toBe("Bronze 3");
    expect(options[6].textContent).toBe("Silver 1");
    expect(options[7].textContent).toBe("Silver 2");
    expect(options[8].textContent).toBe("Silver 3");
    expect(options[9].textContent).toBe("Gold 1");
    expect(options[10].textContent).toBe("Gold 2");
    expect(options[11].textContent).toBe("Gold 3");
    expect(options[12].textContent).toBe("Platinum 1");
    expect(options[13].textContent).toBe("Platinum 2");
    expect(options[14].textContent).toBe("Platinum 3");
    expect(options[15].textContent).toBe("Diamond 1");
    expect(options[16].textContent).toBe("Diamond 2");
    expect(options[17].textContent).toBe("Diamond 3");
    expect(options[18].textContent).toBe("Ascendant 1");
    expect(options[19].textContent).toBe("Ascendant 2");
    expect(options[20].textContent).toBe("Ascendant 3");
    expect(options[21].textContent).toBe("Immortal 1");
    expect(options[22].textContent).toBe("Immortal 2");
    expect(options[23].textContent).toBe("Immortal 3");
  });

  it("test niveau selection", async () => {
    render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

    const niveauLabel = screen.getByLabelText("Niveau");
    const niveauContainer = niveauLabel.closest("div");
    const pencilButton = niveauContainer?.querySelector("button svg");

    if (pencilButton) {
      fireEvent.click(pencilButton.parentElement);
    }

    const select = screen.getByLabelText("Niveau");
    fireEvent.change(select, { target: { value: 3 } });
    console.log(select.value);

    const checkButton = niveauContainer?.querySelector("button svg[data-icon='check']") ||
      niveauContainer?.querySelector("button > svg");

    if (checkButton) {
      fireEvent.click(checkButton.parentElement);
    }

    const submitButton = screen.getByRole("button", { name: /Enregistrer les informations/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ niveau: "3" });
    });
  });

  passwordTestCases.forEach(({ val1, val2, expected, error }, idx) => {
    it(`Test ${idx + 1}: "${val1}" et "${val2}" => expected: ${expected}`, async () => {
      render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

      const TogglePasswordSection = screen.getByRole("button", { name: /Changer le mot de passe/i });
      fireEvent.click(TogglePasswordSection);

      const passwordInput = screen.getByTestId("password");
      const confirmInput = screen.getByTestId("confirmPassword");
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.change(passwordInput, { target: { value: val1 } });
      fireEvent.change(confirmInput, { target: { value: val2 } });

      fireEvent.click(submitButton);

      if (expected) {
        expect(mockUpdateUser).toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
      } else {
        expect(mockUpdateUser).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(error);
      }
    });
  });

  // it("succès modifier le champs pseudo", async () => {
  //   render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

  //   const pseudoLabel = screen.getByLabelText("Pseudo");
  //   const pseudoContainer = pseudoLabel.closest("div");
  //   const pencilButton = pseudoContainer?.querySelector("button svg");

  //   if (pencilButton) {
  //     fireEvent.click(pencilButton.parentElement);
  //   }

  //   const input = screen.getByDisplayValue("jean42");
  //   fireEvent.change(input, { target: { value: "nouveauPseudo" } });

  //   const checkButton = pseudoContainer?.querySelector("button svg[data-icon='check']") ||
  //                       pseudoContainer?.querySelector("button > svg");

  //   if (checkButton) {
  //     fireEvent.click(checkButton.parentElement);
  //   }

  //   const submitButton = screen.getByRole("button", { name: /Enregistrer les informations/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockUpdateUser).toHaveBeenCalledWith({ pseudo: "nouveauPseudo" });
  //   });
  // });


  // it("annule la modification du champ pseudo via l’icône ban", async () => {
  //   render(<MemoryRouter><EditProfilePage /></MemoryRouter>);

  //   const pseudoInput = screen.getByLabelText("Pseudo");
  //   const pseudoContainer = pseudoInput.closest("div");

  //   const pencilButton = within(pseudoContainer).getByRole("button");

  //   await waitFor(() => {
  //     expect(pseudoInput).toBeDisabled();
  //   });

  //   fireEvent.click(pencilButton);

  //   await waitFor(() => {
  //     expect(pseudoInput).not.toBeDisabled();
  //   });


  //   fireEvent.change(pseudoInput, { target: { value: "valeurTemporaire" } });

  //   const buttons = within(pseudoContainer).getAllByRole("button");
  //   const banButton = buttons[1]; // Assurez-vous que c'est le bon bouton

  //   fireEvent.click(banButton);

  //   await waitFor(() => {
  //     expect(pseudoInput.value).toBe("jean42");
  //   });

  //   const submitButton = screen.getByRole("button", { name: /Enregistrer les informations/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockUpdateUser).not.toHaveBeenCalled();
  //   });
  // });
});
