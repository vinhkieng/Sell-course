// Kiểm tra dữ liệu gửi lên bằng schema Zod trước khi tới controller (Phần chung C6).
// Lỗi trả 400 kèm cac_o { ten_o: "câu lỗi" } để frontend hiện dòng đỏ dưới đúng ô.
// Trường lạ không có trong schema bị bỏ qua.
import { loi400 } from '../lib/httpError.js';

function gomLoi(issues) {
  const cacO = {};
  for (const loi of issues) {
    const tenO = loi.path.join('.') || '_chung';
    if (!cacO[tenO]) cacO[tenO] = loi.message; // giữ lỗi đầu tiên của mỗi ô
  }
  return cacO;
}

// Cách dùng trong route: validate({ body: schemaDangKy }) hoặc validate({ query: schemaLoc })
// Dữ liệu đã kiểm tra nằm ở req.validated.body, req.validated.query, req.validated.params
// Câu chung ở trường loi mặc định là câu dưới đây; phần chức năng có câu riêng thì truyền cauChung.
export function validate(schemas, cauChung = 'Thông tin chưa hợp lệ, vui lòng kiểm tra lại.') {
  return (req, res, next) => {
    req.validated = {};
    for (const phan of ['body', 'query', 'params']) {
      if (!schemas[phan]) continue;
      const ketQua = schemas[phan].safeParse(req[phan] ?? {});
      if (!ketQua.success) {
        throw loi400(cauChung, { cacO: gomLoi(ketQua.error.issues) });
      }
      req.validated[phan] = ketQua.data;
    }
    next();
  };
}
