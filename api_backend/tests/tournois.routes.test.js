import request from 'supertest';
import app from '../server.js'; 
import mongoose from 'mongoose';
import Match from '../models/match.model.js';
import Team from '../models/team.model.js';

let server;

beforeAll(async () => {
  server = app.listen(0); //port aléatoire
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('Tournois API', () => {
  let tournoisId, team1, team2, match;

  beforeAll(async () => {
    tournoisId = new mongoose.Types.ObjectId();
    team1 = await Team.create({ nom: 'Team A', tournois_id: tournoisId });
    team2 = await Team.create({ nom: 'Team B', tournois_id: tournoisId });
    match = await Match.create({ tournois_id: tournoisId, team1_id: team1._id, team2_id: team2._id, round: 1 });
  });

  afterAll(async () => {
    await Team.deleteMany({ tournois_id: tournoisId });
    await Match.deleteMany({ tournois_id: tournoisId });
  });

  it('✅ Update winner', async () => {
    const res = await request(server)
      .put(`/api/matches/${match._id}/winner`)
      .send({ winner_id: team1._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.winner_id).toBe(team1._id.toString());
  });

  it('✅ Génère round suivant automatiquement', async () => {
    await request(server)
      .put(`/api/matches/${match._id}/winnerr/testtt`)
      .send({ winner_id: team1._id });

    const nextMatch = await Match.findOne({ tournois_id: tournoisId, round: 2 });
    expect(nextMatch).not.toBeNull();
  });
});
