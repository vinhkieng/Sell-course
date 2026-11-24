// Bộ chữ được nhận trong họ tên (Phần 5 mục 5.4) và tên danh mục (Phần 6 mục 6.4):
// chữ cái a-z và chữ tiếng Việt có dấu (kể cả đ), hoa và thường. Không nhận chữ nước ngoài khác.
// Chuỗi cần đổi về dạng NFC (normalize('NFC')) trước khi so, để chữ có dấu gõ kiểu tổ hợp vẫn khớp.
// Frontend có bản giống hệt ở frontend/src/utils/chuViet.js.
const CHU_THUONG =
  'aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệfghiìíỉĩịjklmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvwxyỳýỷỹỵz';

export const CHU_VIET = CHU_THUONG + CHU_THUONG.toUpperCase();
