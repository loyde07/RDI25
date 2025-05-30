import Tournois from '../models/tournois.model.js';
import Match from '../models/match.model.js';
import Team from '../models/team.model.js';
import Inscription from '../models/inscription.model.js';

export const inscriptionTournois = async (req, res) => {
  try {
    const { team_id, tournois_id } = req.body;

    // Vérifie si cette équipe est déjà inscrite à ce tournoi
    const exists = await Inscription.findOne({ team_id, tournois_id });
    if (exists) {
      return res.status(400).json({ message: "Cette équipe est déjà inscrite à ce tournoi." });
    }

    const inscription = new Inscription({ team_id, tournois_id });
    await inscription.save();

    res.status(201).json({ message: "Équipe inscrite avec succès.", inscription });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}


export const genereMatchs = async (req, res) => {
  const tournoisId = req.params.id;

  try {
    // Vérifier que le tournoi existe
    const tournoi = await Tournois.findById(tournoisId);
    if (!tournoi) {
      return res.status(404).json({ message: "Tournoi non trouvé" });
    }

    // Récupérer les inscriptions avec population des équipes
    const inscriptions = await Inscription.find({ tournois_id: tournoisId })
      .populate('team_id')
      .lean();

    // Vérifier que les inscriptions ont bien des équipes
    const validInscriptions = inscriptions.filter(ins => ins.team_id);
    if (validInscriptions.length !== inscriptions.length) {
      console.warn("Certaines inscriptions n'ont pas d'équipe valide");
    }

    const teams = validInscriptions.map(ins => ins.team_id._id); // Utiliser _id directement

    if (teams.length < 2) {
      return res.status(400).json({ 
        message: "Pas assez d'équipes inscrites",
        required: 2,
        registered: teams.length
      });
    }

    // Supprimer anciens matchs
    await Match.deleteMany({ tournois_id: tournoisId });

    // Créer les matchs - version améliorée avec gestion des byes
    const matchesToCreate = [];
    for (let i = 0; i < teams.length; i += 2) {
      const match = {
        tournois_id: tournoisId,
        team1_id: teams[i],
        round: 1,
        status: 'pending',
        createdAt: new Date()
      };

      // Gérer le cas d'un nombre impair d'équipes
      if (i + 1 < teams.length) {
        match.team2_id = teams[i + 1];
      } else {
        // Équipe seule - victoire automatique
        match.status = 'completed';
        match.winner_id = teams[i];
      }

      matchesToCreate.push(match);
    }

    // Créer les matchs en base
    const createdMatches = await Match.insertMany(matchesToCreate);

    // Mettre à jour le tournoi avec les nouveaux matchs
    await Tournois.findByIdAndUpdate(tournoisId, {
      $set: { 
        matches: createdMatches.map(m => m._id),
        status: 'en cours' 
      }
    });

    res.status(201).json({
      success: true,
      message: `${createdMatches.length} matchs générés`,
      matches: createdMatches
    });

  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      message: "Erreur lors de la génération des matchs",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


export const getMatchsAvecEquipes = async (req, res) => {
  try {
    const tournoisId = req.params.id;

    if (!tournoisId) {
      return res.status(400).json({ message: "ID du tournoi manquant" });
    }

    const matches = await Match.find({ tournois_id: tournoisId })
      .populate('team1_id')
      .populate('team2_id')
      .populate('winner_id');

    res.json({ matchs: matches });
  } catch (err) {
    console.error("Erreur lors du chargement des matchs :", err);
    res.status(500).json({ message: "Erreur lors du chargement des matchs" });
  }
};


export const resetTournois = async (req, res) => {  
  try {
    await Match.deleteMany({ tournois_id: req.params.id });
    res.status(200).json({ message: 'Matchs supprimés' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression matchs' });
  }
};

// Créer un nouveau tournoi
export const createTournois = async (req, res) => {
    try {
        const { nom, jeu, dateDebut, dateFin, equipesParticipantes } = req.body;
        
        const newTournois = new Tournois({
            nom,
            jeu,
            dateDebut: dateDebut ? new Date(dateDebut) : null,
            equipesParticipantes: equipesParticipantes || []
        });

        const savedTournois = await newTournois.save();
        res.status(201).json(savedTournois);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Récupérer tous les tournois
export const getAllTournois = async (req, res) => {
    try {
        const tournois = await Tournois.find()
            .populate('matches')
            .populate('matchEnCours')
            .populate('equipesParticipantes')
            .populate('gagnant');
        res.json(tournois);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Récupérer un tournoi par son ID
export const getTournoisById = async (req, res) => {
    try {
        const tournois = await Tournois.findById(req.params.id)
            .populate({
                path: 'matches',
                populate: [
                    { path: 'team1_id', model: 'Team' },
                    { path: 'team2_id', model: 'Team' },
                    { path: 'winner_id', model: 'Team' }
                ]
            })
            .populate('matchEnCours')
            .populate('equipesParticipantes')
            .populate('gagnant');

        if (!tournois) {
            return res.status(404).json({ message: 'Tournoi non trouvé' });
        }
        res.json(tournois);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour un tournoi
export const updateTournois = async (req, res) => {
    try {
        const { nom, jeu, status, matchEnCours, equipesParticipantes, gagnant } = req.body;
        
        const updatedTournois = await Tournois.findByIdAndUpdate(
            req.params.id,
            { 
                nom, 
                jeu, 
                status,
                matchEnCours,
                equipesParticipantes,
                gagnant,
                // Mettre à jour la date de fin si le statut est "terminé"
                ...(status === 'terminé' && { dateFin: new Date() }),
                // Mettre à jour la date de début si le statut passe à "en cours"
                ...(status === 'en cours' && !this.dateDebut && { dateDebut: new Date() })
            },
            { new: true }
        ).populate('matches matchEnCours equipesParticipantes gagnant');

        if (!updatedTournois) {
            return res.status(404).json({ message: 'Tournoi non trouvé' });
        }
        res.json(updatedTournois);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Supprimer un tournoi
export const deleteTournois = async (req, res) => {
    try {
        const deletedTournois = await Tournois.findByIdAndDelete(req.params.id);
        if (!deletedTournois) {
            return res.status(404).json({ message: 'Tournoi non trouvé' });
        }
        res.json({ message: 'Tournoi supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ajouter un match à un tournoi
export const addMatchToTournois = async (req, res) => {
    try {
        const { team1_id, team2_id, round } = req.body;
        
        // Vérifier que le tournoi existe
        const tournois = await Tournois.findById(req.params.id);
        if (!tournois) {
            return res.status(404).json({ message: 'Tournoi non trouvé' });
        }

        // Créer le nouveau match
        const newMatch = new Match({
            tournois_id: req.params.id,
            team1_id,
            team2_id,
            round
        });

        const savedMatch = await newMatch.save();

        // Ajouter le match au tournoi
        tournois.matches.push(savedMatch._id);
        await tournois.save();

        res.status(201).json(savedMatch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Définir le match en cours
export const setCurrentMatch = async (req, res) => {
    try {
        const { matchId } = req.body;
        
        // Vérifier que le match existe
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match non trouvé' });
        }

        // Vérifier que le match appartient au tournoi
        if (match.tournois_id.toString() !== req.params.id) {
            return res.status(400).json({ message: 'Ce match ne fait pas partie de ce tournoi' });
        }

        // Mettre à jour le tournoi
        const updatedTournois = await Tournois.findByIdAndUpdate(
            req.params.id,
            { matchEnCours: matchId },
            { new: true }
        ).populate('matchEnCours');

        res.json(updatedTournois);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Ajouter une équipe au tournoi
export const addTeamToTournois = async (req, res) => {
    try {
        const { teamId } = req.body;
        
        // Vérifier que l'équipe existe
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }

        // Vérifier que le tournoi existe
        const tournois = await Tournois.findById(req.params.id);
        if (!tournois) {
            return res.status(404).json({ message: 'Tournoi non trouvé' });
        }

        // Vérifier que l'équipe n'est pas déjà inscrite
        if (tournois.equipesParticipantes.includes(teamId)) {
            return res.status(400).json({ message: 'Cette équipe est déjà inscrite au tournoi' });
        }

        // Ajouter l'équipe au tournoi
        tournois.equipesParticipantes.push(teamId);
        const updatedTournois = await tournois.save();

        res.json(updatedTournois);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};