// Ghi nhật ký tập trung. Không bao giờ ghi: mật khẩu, mã phiên (JWT), mã 6 số, khóa VNPay,
// mật khẩu ứng dụng Gmail, số CCCD (Phần chung C2). Khi ghi lỗi chỉ ghi câu lỗi, không ghi
// nguyên dữ liệu người dùng gửi lên.
function ghi(muc, thongDiep, chiTiet) {
  const thoiGian = new Date().toISOString();
  const dong = `[${thoiGian}] ${muc} ${thongDiep}`;
  if (muc === 'ERROR') console.error(dong, chiTiet ?? '');
  else if (muc === 'WARN') console.warn(dong, chiTiet ?? '');
  else console.info(dong, chiTiet ?? '');
}

const logger = {
  info: (thongDiep, chiTiet) => ghi('INFO', thongDiep, chiTiet),
  warn: (thongDiep, chiTiet) => ghi('WARN', thongDiep, chiTiet),
  error: (thongDiep, chiTiet) => ghi('ERROR', thongDiep, chiTiet),
};

export default logger;
