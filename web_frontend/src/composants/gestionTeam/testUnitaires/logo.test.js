import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import axios from 'axios';
import { uploadLogo } from '../outilsGestionTeams/outilsNew.jsx';
import toast from 'react-hot-toast';

vi.mock('axios');
vi.mock('react-hot-toast');

describe('uploadLogo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('retourne le chemin du logo en cas de succès', async () => {
    const fakeFile = new File(['logo'], 'logo.png', { type: 'image/png' });
    axios.post.mockResolvedValue({ data: { path: '/uploads/logo.png' } });

    const path = await uploadLogo(fakeFile);

    expect(axios.post).toHaveBeenCalled();
    expect(path).toBe('/uploads/logo.png');
  });

  it('ne fait rien si aucun fichier', async () => {
    const result = await uploadLogo(null);
    expect(result).toBeUndefined();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('lance une erreur et toast en cas d\'échec', async () => {
    const fakeFile = new File(['logo'], 'logo.png', { type: 'image/png' });
    axios.post.mockRejectedValue(new Error('Erreur serveur'));

    await expect(uploadLogo(fakeFile)).rejects.toThrow("Erreur lors de l'upload du logo");
    expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'upload du logo");
  });
});



describe('uploadLogo - intégration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit envoyer le fichier et retourner le chemin du logo', async () => {
    const mockFile = new File(['image content'], 'logo.png', { type: 'image/png' });
    const mockPath = '/uploads/logo.png';

    axios.post.mockResolvedValue({ data: { path: mockPath } });

    const result = await uploadLogo(mockFile);

    // Vérifie que axios.post a été appelé avec le bon endpoint et formData
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/teams/upload-logo'),
      expect.any(FormData),
      expect.objectContaining({
        headers: { "Content-Type": "multipart/form-data" }
      })
    );

    // Vérifie que le FormData contient bien le fichier
    const formDataArg = axios.post.mock.calls[0][1];
    expect(formDataArg instanceof FormData).toBe(true);

    // On vérifie que le fichier a bien été append avec la clé "logo"
    const entries = Array.from(formDataArg.entries());
    const foundEntry = entries.find(([key]) => key === 'logo');
    expect(foundEntry).toBeTruthy();
    expect(foundEntry[1]).toEqual(mockFile);

    expect(result).toBe(mockPath);
  });

  it('doit lever une erreur et afficher un toast si axios échoue', async () => {
    const mockFile = new File(['image content'], 'logo.png', { type: 'image/png' });

    axios.post.mockRejectedValue(new Error('Erreur réseau'));

    await expect(uploadLogo(mockFile)).rejects.toThrow('Erreur lors de l\'upload du logo');
  });

  it('ne fait rien si aucun fichier est passé', async () => {
    const result = await uploadLogo(undefined);

    expect(result).toBeUndefined();
    expect(axios.post).not.toHaveBeenCalled();
  });
});