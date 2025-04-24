import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';


import app from '../../server.js';
import { User } from '../../models/user.model.js';
import {generateTokenAndSetCookie} from '../../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../../mailtrap/emails.js';

let mongo;

// Mocks des fonctions utilisées dans signup
jest.mock('../../utils/generateTokenAndSetCookie.js', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../mailtrap/emails.js', () => ({
  __esModule: true,
  sendVerificationEmail: jest.fn()
}));

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('POST /api/auth/signup', () => {

  it('✅ Crée un utilisateur avec succès', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      lName: 'Doe',
      fName: 'John',
      pseudo: 'johnny',
      email: 'john@example.com',
      password: 'StrongPass123!'
    });

    expect(res.status).toBe(201);
    expect(res.body.sucess).toBe(true);
    expect(res.body.user.pseudo).toBe('johnny');
    expect(res.body.user.password).toBeUndefined();
    expect(generateTokenAndSetCookie).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalled();
  });

  it('❌ Échoue si un champ est manquant', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fName: 'John',
      pseudo: 'johnny',
      email: 'john@example.com',
      password: 'StrongPass123!'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it('❌ Échoue si email déjà existant', async () => {
    await User.create({
      lName: 'Test',
      fName: 'User',
      pseudo: 'uniquePseudo',
      email: 'existing@example.com',
      password: 'hashedpass'
    });

    const res = await request(app).post('/api/auth/signup').send({
      lName: 'New',
      fName: 'User',
      pseudo: 'anotherPseudo',
      email: 'existing@example.com',
      password: 'StrongPass123!'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it('❌ Échoue si pseudo déjà utilisé', async () => {
    await User.create({
      lName: 'Test',
      fName: 'User',
      pseudo: 'duplicatePseudo',
      email: 'someone@example.com',
      password: 'hashedpass'
    });

    const res = await request(app).post('/api/auth/signup').send({
      lName: 'Another',
      fName: 'User',
      pseudo: 'duplicatePseudo',
      email: 'new@example.com',
      password: 'StrongPass123!'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("pseudo already exists");
  });

  it('💥 Gère une erreur interne (ex: save échoue)', async () => {
    jest.spyOn(User.prototype, 'save').mockImplementationOnce(() => {
      throw new Error("Erreur simulée");
    });

    const res = await request(app).post('/api/auth/signup').send({
      lName: 'Doe',
      fName: 'Jane',
      pseudo: 'jane123',
      email: 'jane@example.com',
      password: 'StrongPass123!'
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Erreur simulée");
  });

  it('❌ Échoue si les champs sont vides (ex: "")', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      lName: '',
      fName: '',
      pseudo: '',
      email: '',
      password: ''
    });
  
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it('💥 Gère une erreur si generateTokenAndSetCookie échoue', async () => {
    generateTokenAndSetCookie.mockImplementationOnce(() => {
      throw new Error("Cookie error");
    });
  
    const res = await request(app).post('/api/auth/signup').send({
      lName: 'Doe',
      fName: 'Error',
      pseudo: 'cookieerror',
      email: 'cookie@example.com',
      password: 'StrongPass123!'
    });
  
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Cookie error");
  });
  
  
});