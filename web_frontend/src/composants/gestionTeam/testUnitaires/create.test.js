import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { createTeamAndJoin } from '../outilsGestionTeams/outilsNew.jsx';
import toast from 'react-hot-toast';

vi.mock('axios');
vi.mock('react-hot-toast');

describe('createTeamAndJoin', () => {
  const updateProfileMock = vi.fn();
  const userNonAdmin = { _id: 'user123', droit: 'joueur' };
  const userAdmin = { _id: 'admin123', droit: 'admin' };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('création d\'équipe avec nom vide', async () => {
    axios.post.mockResolvedValue({ data: { data: { _id: 'team1', nom: '' } } });
    axios.patch.mockResolvedValue({});

    const createdTeam = await createTeamAndJoin('', 'logo.png', userNonAdmin, updateProfileMock);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/teams'), { nom: '', logo: 'logo.png' });
    expect(axios.patch).toHaveBeenCalled();
    expect(updateProfileMock).toHaveBeenCalledWith({ droit: 'capitaine' });
    expect(createdTeam.nom).toBe('');
  });

  it('création d\'équipe avec nom très long', async () => {
    const longName = 'A'.repeat(256);
    axios.post.mockResolvedValue({ data: { data: { _id: 'team2', nom: longName } } });
    axios.patch.mockResolvedValue({});

    const createdTeam = await createTeamAndJoin(longName, 'logo.png', userNonAdmin, updateProfileMock);

    expect(createdTeam.nom).toBe(longName);
  });

  it('création d\'équipe avec caractères spéciaux', async () => {
    const specialName = 'Équipe_@#$_2025';
    axios.post.mockResolvedValue({ data: { data: { _id: 'team3', nom: specialName } } });
    axios.patch.mockResolvedValue({});

    const createdTeam = await createTeamAndJoin(specialName, 'logo.png', userNonAdmin, updateProfileMock);

    expect(createdTeam.nom).toBe(specialName);
  });

  it('création d\'équipe avec nom utilisateur classique', async () => {
    const normalName = 'TeamPhoenix';
    axios.post.mockResolvedValue({ data: { data: { _id: 'team4', nom: normalName } } });
    axios.patch.mockResolvedValue({});

    const createdTeam = await createTeamAndJoin(normalName, 'logo.png', userNonAdmin, updateProfileMock);

    expect(createdTeam.nom).toBe(normalName);
  });

  it('admin crée une équipe sans rejoindre ni mise à jour', async () => {
    axios.post.mockResolvedValue({ data: { data: { _id: 'team5', nom: 'AdminTeam' } } });

    const createdTeam = await createTeamAndJoin('AdminTeam', 'logo.png', userAdmin, updateProfileMock);

    expect(axios.post).toHaveBeenCalled();
    expect(axios.patch).not.toHaveBeenCalled();
    expect(updateProfileMock).not.toHaveBeenCalled();
    expect(createdTeam.nom).toBe('AdminTeam');
  });

  it('gère une erreur si équipe déjà existante', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Une équipe avec ce nom existe déjà.' } } });

    await expect(createTeamAndJoin('ExistingTeam', 'logo.png', userNonAdmin, updateProfileMock))
      .rejects.toThrow("Erreur lors de la création de l'équipe");

    expect(toast.error).toHaveBeenCalledWith('Ce nom d’équipe est déjà utilisé. Choisis-en un autre.');
  });

  it('gère une erreur générique', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Erreur inconnue' } } });

    await expect(createTeamAndJoin('AnyTeam', 'logo.png', userNonAdmin, updateProfileMock))
      .rejects.toThrow("Erreur lors de la création de l'équipe");

    expect(toast.error).toHaveBeenCalledWith('Erreur lors de la création de l’équipe. Veuillez réessayer plus tard.');
  });

});