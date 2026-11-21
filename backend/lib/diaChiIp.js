// Quy địa chỉ IP về một dạng trước khi so (Phần chung C4):
// "::1" và "::ffff:127.0.0.1" đổi thành "127.0.0.1", bỏ phần "::ffff:" ở đầu các địa chỉ IPv4.
export function chuanHoaIp(diaChi) {
  if (!diaChi) return '';
  let ip = String(diaChi).trim();
  if (ip === '::1') return '127.0.0.1';
  if (ip.toLowerCase().startsWith('::ffff:')) ip = ip.slice(7);
  return ip;
}

// Địa chỉ IP của yêu cầu. Express đã được đặt chỉ tin máy trung gian loopback (Vite)
// và các máy ghi trong TIN_MAY_TRUNG_GIAN (app.js), nên req.ip là địa chỉ thật của máy gửi.
export function layIp(req) {
  return chuanHoaIp(req.ip);
}
