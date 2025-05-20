import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';


import { MemoryRouter } from "react-router-dom";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "./LoginPage";
import { useAuthStore } from "../store/authStore";

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("LoginPage", () => {
  let mockLogin;

  beforeEach(() => {
    mockLogin = vi.fn();
    useAuthStore.mockReturnValue({
      login: mockLogin,
      error: '',
      isLoading: false,
    });
  });

  it("renders email and password fields and login button", () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByPlaceholderText(/adresse mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("shows error if email is empty", async () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Password123!" } });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    });
  });

  it("shows error if email is invalid", async () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Password123!" } });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByText(/Veuillez entrer une adresse email valide/i)).toBeInTheDocument();
    });
  });

  it("shows error if password is empty", async () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "user@mail.com" } });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByText(/Veuillez remplir tous les champs/i)).toBeInTheDocument();
    });
  });

  it("calls login function when inputs are valid", async () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "user@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "Password123!" } });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@mail.com", "Password123!");
    });
  });

  it("displays backend error if login fails", async () => {
    useAuthStore.mockReturnValue({
      login: vi.fn(),
      error: "Identifiants incorrects",
      isLoading: false,
    });

    render(<MemoryRouter><LoginPage /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText(/adresse mail/i), { target: { value: "user@mail.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "WrongPassword" } });
    fireEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByText(/Identifiants incorrects/i)).toBeInTheDocument();
    });
  });
});
