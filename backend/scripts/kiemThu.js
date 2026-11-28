// Lệnh npm test của backend (Phần chung C2):
// 1. Xóa và tạo lại database ava_test từ file database/AVA_CSDL_18-11.sql (không sửa file SQL,
//    chỉ đổi tên database khi nạp). Database ava không bị đụng tới.
// 2. Tạo một admin dùng cho kiểm thử.
// 3. Chạy mọi file *.test.js trong thư mục tests bằng node:test, lần lượt từng file.
// Kiểm thử dùng hộp thư giả và VNPay giả, không gửi email thật, không gọi VNPay thật.
import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { ADMIN_KIEM_THU } from '../tests/duLieuKiemThu.js';

const THU_MUC_BACKEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE_SQL = path.resolve(THU_MUC_BACKEND, '..', 'database', 'AVA_CSDL_18-11.sql');
const TEN_DB_KIEM_THU = 'ava_test';

function timFileKiemThu(thuMuc) {
  if (!fs.existsSync(thuMuc)) return [];
  const ketQua = [];
  for (const muc of fs.readdirSync(thuMuc, { withFileTypes: true })) {
    const duongDan = path.join(thuMuc, muc.name);
    if (muc.isDirectory()) ketQua.push(...timFileKiemThu(duongDan));
    else if (muc.name.endsWith('.test.js')) ketQua.push(duongDan);
  }
  return ketQua.sort();
}

async function taoLaiDatabaseKiemThu() {
  const sql = fs
    .readFileSync(FILE_SQL, 'utf8')
    .replace(/CREATE DATABASE IF NOT EXISTS ava\b/, `CREATE DATABASE ${TEN_DB_KIEM_THU}`)
    .replace(/USE ava;/, `USE ${TEN_DB_KIEM_THU};`);
  const ketNoi = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4',
    multipleStatements: true,
  });
  try {
    await ketNoi.query(`DROP DATABASE IF EXISTS ${TEN_DB_KIEM_THU}`);
    await ketNoi.query(sql);
  } finally {
    await ketNoi.end();
  }
}

async function main() {
  // Mọi bước sau dùng database ava_test và chế độ kiểm thử
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = TEN_DB_KIEM_THU;
  // File chinh_sach.json của kiểm thử nằm ở thư mục tạm, không ghi đè file thật (Phần 1 mục 1.4)
  process.env.DUONG_DAN_CHINH_SACH = path.join(os.tmpdir(), 'ava_kiem_thu', 'chinh_sach.json');
  // File tải lên khi kiểm thử nằm ở thư mục tạm của máy, ngoài dự án; chạy xong thì xóa (Phần 7)
  const thuMucLuuTruKiemThu = path.join(os.tmpdir(), 'ava_kiem_thu', 'luu_tru');
  process.env.THU_MUC_LUU_TRU = thuMucLuuTruKiemThu;
  fs.rmSync(thuMucLuuTruKiemThu, { recursive: true, force: true });

  console.log(`Đang tạo lại database ${TEN_DB_KIEM_THU} từ file SQL...`);
  await taoLaiDatabaseKiemThu();

  // Nạp sau khi đã đặt biến môi trường để config.js đọc đúng database ava_test
  const { taoAdmin } = await import('../services/taoAdminService.js');
  const { default: pool } = await import('../database/db.js');
  await taoAdmin(ADMIN_KIEM_THU);
  const { taoThuMucLuuTru } = await import('../lib/khoiDong.js');
  await taoThuMucLuuTru();
  await pool.end();

  const cacFile = timFileKiemThu(path.join(THU_MUC_BACKEND, 'tests'));
  if (cacFile.length === 0) {
    console.log('Chưa có file kiểm thử nào trong thư mục tests.');
    return;
  }
  // Chạy lần lượt từng file (các file dùng chung database ava_test)
  const ketQua = spawnSync(
    process.execPath,
    ['--test', '--test-concurrency=1', '--test-reporter=spec', ...cacFile],
    { stdio: 'inherit', env: process.env, cwd: THU_MUC_BACKEND },
  );
  process.exitCode = ketQua.status ?? 1;
  fs.rmSync(thuMucLuuTruKiemThu, { recursive: true, force: true });
}

try {
  await main();
} catch (loi) {
  console.error('Chuẩn bị kiểm thử thất bại:', loi.message);
  console.error('Kiểm tra MySQL đã bật chưa và các dòng DB_ trong file backend/.env.');
  process.exitCode = 1;
}
