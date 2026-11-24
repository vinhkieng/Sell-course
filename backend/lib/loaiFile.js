// Loại file thật theo mấy byte đầu, không tin phần đuôi tên file (Phần chung C12).
// Phần 5 dùng cho ảnh đại diện; Phần 7 dùng lại cho ảnh bìa, video, tài liệu.
// Trả 'jpg', 'png', 'pdf', 'mp4' hoặc null.
export function loaiFile(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf.length >= 5 && buf.toString('latin1', 0, 5) === '%PDF-') return 'pdf';
  // MP4: chữ "ftyp" ở vị trí byte thứ 4
  if (buf.length >= 8 && buf.toString('latin1', 4, 8) === 'ftyp') return 'mp4';
  return null;
}
