// Kiểm thử hạ tầng của khung dự án (không phải kiểm thử chức năng):
// đường GET /api/kiem-tra-ket-noi trả đúng mẫu của Phần chung C6 khi máy chủ nối được MySQL.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';

after(async () => {
  await pool.end();
});

test('GET /api/kiem-tra-ket-noi trả { server: "ok", database: "ok" }', async () => {
  const res = await request(app).get('/api/kiem-tra-ket-noi');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { server: 'ok', database: 'ok' });
});

test('Đường không tồn tại trả 404 theo mẫu lỗi { loi }', async () => {
  const res = await request(app).get('/api/khong-co-duong-nay');
  assert.equal(res.status, 404);
  assert.equal(typeof res.body.loi, 'string');
});
