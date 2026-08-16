const request = require('supertest');
const express = require('express');
const siswaRouter = require('../routes/siswa');
const app = express();

app.use(express.json());
app.use('/api/siswa', siswaRouter);

// Mock service GoogleSheetsService
jest.mock('../services/GoogleSheetsService', () => {
  return jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([{ id: '1', nama: 'Ali', email: 'ali@mail.com' }]),
    getById: jest.fn().mockImplementation((id) => {
      if (id === '1') return Promise.resolve({ id: '1', nama: 'Ali', email: 'ali@mail.com' });
      return Promise.resolve(null);
    }),
    create: jest.fn().mockResolvedValue({ id: '2', nama: 'Budi', email: 'budi@mail.com' }),
    update: jest.fn().mockResolvedValue({ id: '1', nama: 'Ali Updated', email: 'ali@mail.com' }),
    delete: jest.fn().mockResolvedValue({ message: 'Data berhasil dihapus' }),
  }));
});

// Mock middleware auth untuk testing
jest.mock('../middleware/authMiddleware', () => (req, res, next) => next());

describe('Siswa API', () => {
  it('GET /api/siswa harus mengembalikan daftar siswa', async () => {
    const res = await request(app).get('/api/siswa');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0].nama).toBe('Ali');
  });

  it('GET /api/siswa/:id dengan id valid', async () => {
    const res = await request(app).get('/api/siswa/1');
    expect(res.status).toBe(200);
    expect(res.body.nama).toBe('Ali');
  });

  it('GET /api/siswa/:id dengan id tidak ditemukan', async () => {
    const res = await request(app).get('/api/siswa/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/siswa sukses membuat siswa baru', async () => {
    const res = await request(app)
      .post('/api/siswa')
      .send({ nama: 'Budi', email: 'budi@mail.com' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('PUT /api/siswa/:id memperbarui data', async () => {
    const res = await request(app)
      .put('/api/siswa/1')
      .send({ nama: 'Ali Updated' });
    expect(res.status).toBe(200);
    expect(res.body.nama).toBe('Ali Updated');
  });

  it('DELETE /api/siswa/:id menghapus data', async () => {
    const res = await request(app).delete('/api/siswa/1');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Data berhasil dihapus');
  });
});