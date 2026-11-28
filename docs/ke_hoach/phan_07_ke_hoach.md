# Kế hoạch Phần 7. Tạo khóa học (đã duyệt)

- Đặc tả: docs/dac_ta/phan_07_tao_khoa_hoc.md. Danh sách kiểm thử: docs/kiem_thu/phan_07_tao_khoa_hoc.md.
- File này ghi lại kế hoạch người dùng đã duyệt và toàn bộ câu trả lời, để các lần làm sau (đợt 2, đợt 3, Phần 8) làm đúng như đã chốt.
- Mỗi đợt làm xong: chạy npm test, npm run lint ở backend và frontend, npm run build ở frontend, báo kết quả rồi dừng chờ người dùng. Chưa commit khi người dùng chưa bảo.

## 1. Tình trạng

| Đợt | Nội dung | Tình trạng |
| --- | --- | --- |
| 1. Máy chủ | Toàn bộ API (kể cả kiểm bài trắc nghiệm), việc chạy mỗi giờ dọn file tạm | Đã xong, người dùng báo đạt (111/111 kiểm thử backend) |
| 2. Trang | Bước 1, bước 2, thêm và sửa bài video, tài liệu, đăng khóa, nút ở hồ sơ, hỏi khi rời trang | Đã xong (npm test backend 111/111, vitest 35/35, lint hai bên, build đạt), người dùng báo đạt bấm tay |
| 3. Soạn trắc nghiệm | Khu soạn câu hỏi trên trang, luật bài số 1 với bài trắc nghiệm | Đã xong (npm test backend 111/111, vitest 43/43, lint hai bên, build đạt), người dùng báo đạt bấm tay P07-25, P07-27 |

Phần 7 đã làm xong cả 3 đợt.

## 2. Cách chia 3 đợt

Chia theo "máy chủ trước, trang sau" (CLAUDE.md: làm backend trước, kiểm tra chạy đúng, rồi làm trang). Không chia theo kiểu "trắc nghiệm để sau" vì khóa mẫu trong danh sách kiểm thử đã có bài trắc nghiệm và luật "bài số 1 phải là video hoặc tài liệu" cần loại trắc nghiệm.

| Đợt | Mã P07 | Cách kiểm | Xong đợt thì chạy được gì |
| --- | --- | --- | --- |
| 1 | P07-01 đến P07-22, P07-30 | Tự động (npm test) | npm test qua hết; chưa có trang |
| 2 | P07-23, P07-24, P07-25 (trừ phần trắc nghiệm), P07-26, P07-27 (phần tài liệu), P07-28, P07-29 | Bấm tay; vitest cho hàm thuần | Tạo và đăng được khóa gồm bài video và tài liệu. Lựa chọn "Trắc nghiệm" ở ô "Loại bài" tạm mờ cho tới đợt 3 |
| 3 | P07-25 (phần trắc nghiệm: thêm trắc nghiệm vào số 1, bấm "Xóa" bài 1 khi bài 2 là trắc nghiệm), P07-27 (phần trắc nghiệm) | Bấm tay; vitest cho hàm thuần | Đủ Phần 7 |

Sau đợt 2 chạy lại toàn bộ kiểm thử (cả backend và frontend) để chắc việc đổi cách gắn bộ chuyển trang (K1) không ảnh hưởng các trang cũ.

## 3. Danh sách file

### Đợt 1 (đã xong)

Tạo mới:
- backend/routes/nguoiCungCapRoutes.js: nhóm /api/nguoi-cung-cap, chỉ cho người cung cấp; nhận file bằng multer ghi thẳng xuống đĩa; dữ liệu kèm file sai thì xóa file vừa nhận. Phần 8 trở đi thêm đường vào đây.
- backend/controllers/fileTamController.js: nhận và trả cho 3 đường file tạm.
- backend/controllers/khoaHocController.js: nhận và trả cho đường đăng khóa.
- backend/services/fileTamService.js: lưu file tạm, tính mã băm SHA-256 (đọc dần từng đoạn), kiểm trùng, kiểm hạn mức 5GB, đọc file mô tả, xóa file tạm, dọn file quá 24 giờ.
- backend/services/khoaHocService.js: đăng khóa trong một giao dịch, chuyển file sang thư mục chính thức, lỗi thì trả file về chỗ tạm.
- backend/validators/khoaHocValidator.js: khuôn kiểm bước 1, bài học, câu hỏi, các ô gửi kèm file tạm. Phần 8 dùng lại.
- backend/repositories/baiHocRepository.js: ghi bài, ghi câu hỏi, tìm bài trùng mã băm, cộng dung lượng tính hạn mức.
- backend/tests/phan_07_tao_khoa_hoc.test.js: kiểm thử P07-01 đến P07-22 và P07-30.

Sửa:
- backend/app.js: riêng đường /api/nguoi-cung-cap/khoa-hoc nhận JSON tới 20MB (bộ đọc riêng gắn trước bộ đọc chung 1MB).
- backend/server.js: việc chạy mỗi giờ dọn file tạm quá 24 giờ, chạy thêm một lần lúc khởi động.
- backend/routes/index.js: gắn nhóm /nguoi-cung-cap.
- backend/repositories/khoaHocRepository.js: thêm hàm ghi khóa mới.
- backend/lib/loaiFile.js: thêm hàm loaiFileTrenDia (đọc 8 byte đầu của file trên đĩa).
- backend/constants/nghiepVu.js: thêm các số của Phần 7.
- backend/validators/danhMucValidator.js: thêm hàm laTenDanhMucDung dùng khi chọn "Khác".
- backend/config.js, backend/scripts/kiemThu.js: khi kiểm thử dùng thư mục lưu file riêng (THU_MUC_LUU_TRU, trong thư mục tạm của Windows, chạy xong thì xóa).
- backend/CLAUDE.md: ghi hai ngoại lệ của C10 và biến THU_MUC_LUU_TRU.
- docs/dac_ta/phan_00_chung.md và CLAUDE.md (giống hệt nhau): thêm ngoại lệ thứ hai ở C10.
- docs/dac_ta/phan_07_tao_khoa_hoc.md: mục 7.3 (thời lượng), 7.4 (trắc nghiệm nhận mọi ký tự gõ được), 7.7 (hai câu mới).

### Đợt 2 (đã xong)

Tạo mới (trang đặt trong pages/provider/tao_khoa_hoc/ theo luật xếp thư mục của frontend/CLAUDE.md):
- frontend/src/pages/provider/tao_khoa_hoc/TrangTaoKhoaHoc.jsx + .css: trang /nguoi-cung-cap/tao-khoa-hoc. Giữ toàn bộ dữ liệu đang tạo; chuyển qua lại giữa bước 1, bước 2 và trang thêm hoặc sửa bài trên cùng một đường dẫn; mở trang thì gọi DELETE /api/nguoi-cung-cap/file-tam; thiếu họ tên hoặc số điện thoại thì chỉ hiện dòng nhắc và liên kết "Cập nhật hồ sơ".
- frontend/src/pages/provider/tao_khoa_hoc/ThanhBuoc.jsx: thanh "1. Thông tin khóa học", "2. Bài học".
- frontend/src/pages/provider/tao_khoa_hoc/BuocThongTin.jsx: bước 1.
- frontend/src/pages/provider/tao_khoa_hoc/ChonAnhBia.jsx: ảnh bìa (xem trước, tên file, dung lượng, "Đổi ảnh", "Xóa ảnh").
- frontend/src/pages/provider/tao_khoa_hoc/BuocBaiHoc.jsx: bước 2, hộp "Xóa bài học này?", hộp cam kết "Đăng", đánh dấu đỏ bài trùng file hoặc mất file tạm.
- frontend/src/pages/provider/tao_khoa_hoc/TrangSoanBai.jsx: trang "Thêm bài học" và "Sửa bài học".
- frontend/src/pages/provider/tao_khoa_hoc/ChonFileBai.jsx: chọn video hoặc PDF, phát thử video bằng thẻ video ẩn, thanh "Đang tải lên N%", "Hủy tải lên", "Chọn lại".
- frontend/src/pages/chung/ho_so/HoSoQuanLyKhoaHoc.jsx: mục "Quản lý khóa học" ở hồ sơ (tiêu đề, nút "+ Tạo khóa học mới", mờ kèm dòng nhắc khi thiếu thông tin). Danh sách khóa để Phần 8 làm.
- frontend/src/hooks/useHoiKhiRoiTrang.js: hỏi lại khi rời trang (đóng tab, tải lại, bấm liên kết trong web).
- frontend/src/api/khoaHoc.js: gửi file tạm (có tiến độ, hủy giữa chừng), xóa file tạm, đăng khóa.
- frontend/src/utils/soanKhoaHoc.js + .test.js: hàm thuần kiểm bằng vitest (chèn, xóa, đổi số thứ tự bài; kiểm bước 1 và bài; định dạng thời lượng, dung lượng, giá).

Sửa:
- frontend/src/App.jsx: đổi sang createBrowserRouter để dùng được useBlocker (K1); AppRouter.jsx giữ nguyên các đường đã có.
- frontend/src/router/AppRouter.jsx: thêm /nguoi-cung-cap/tao-khoa-hoc trong khung công khai (có chân trang), chỉ cho người cung cấp.
- frontend/src/pages/chung/ho_so/TrangHoSo.jsx: dùng HoSoQuanLyKhoaHoc thay khung tạm.
- frontend/src/components/HopThoai.jsx + .css: cho bỏ tiêu đề và đặt nút bên trái (K3, thuộc tính gon).
- frontend/src/contexts/AuthProvider.jsx: đăng xuất và bị đẩy ra (khóa tài khoản, đăng nhập nơi khác) chuyển trang kèm state.boQuaHoiRoiTrang để không hỏi "Rời trang?" (câu trả lời D3).
- frontend/src/styles/variables.css: thêm các màu của thiet_ke/tao_khoa_hoc/.
- docs/dac_ta/phan_07_tao_khoa_hoc.md mục 7.4: trang kiểm 10.000 ký tự khi bấm "Tiếp tục" (câu trả lời D4).

Thêm so với danh sách trên: frontend/src/pages/provider/tao_khoa_hoc/OTruong.jsx (một ô của form: nhãn, ô, lỗi, gợi ý), dùng ở bước 1 và trang soạn bài. Kiểu của mọi thành phần trong thư mục này nằm chung ở TrangTaoKhoaHoc.css.

Dùng lại: ONhap, HopThoai, useThongBao, kiemTraTenDanhMuc và chuanHoaTenDanhMuc (lựa chọn "Khác"), lớp nút nut-dam và nut-vien, dinhDangTien, GET /api/danh-muc, GET /api/ho-so.

### Đợt 3 (đã xong)

- frontend/src/pages/provider/tao_khoa_hoc/SoanTracNghiem.jsx (tạo mới): ô "Thời gian làm bài (phút)", khu soạn câu (nội dung, bốn lựa chọn A, B, C, D, nút tròn chọn đáp án đúng), câu tự đánh số, "+ Thêm câu hỏi" (tối đa 50), thùng rác xóa câu.
- Sửa TrangSoanBai.jsx (bật lựa chọn "Trắc nghiệm", giữ câu khi đổi loại, báo "Bài số 1..." dưới ô Số thứ tự), BuocBaiHoc.jsx (nhãn bài trắc nghiệm, dải đỏ khi xóa bài 1), TrangTaoKhoaHoc.jsx (không lưu bài làm trắc nghiệm lên số 1), TrangTaoKhoaHoc.css, styles/variables.css (màu khung câu), utils/soanKhoaHoc.js + .test.js (kiểm bài trắc nghiệm, luật bài số 1, chữ nhãn loại bài, dữ liệu gửi kèm câu hỏi).

## 4. Các đường API (đã làm ở đợt 1)

Mọi đường nằm trong nhóm /api/nguoi-cung-cap: chỉ người cung cấp (khách 401, vai trò khác 403).

| Đường | Làm gì |
| --- | --- |
| POST /api/nguoi-cung-cap/file-tam | Form tải file: ô loai ('Video', 'Tài liệu', 'Ảnh bìa', gửi trước ô file), thoi_luong (giây, chỉ video), so_bai_hien_co, ma_file_tam_dang_dung (chuỗi JSON danh sách mã), file. Kiểm theo thứ tự mục 7.5. Đúng thì trả 201 { ma_file_tam, ten_file, dung_luong, thoi_luong } |
| DELETE /api/nguoi-cung-cap/file-tam | Xóa mọi file tạm của chính người đó |
| DELETE /api/nguoi-cung-cap/file-tam/:ma_file_tam | Xóa một file tạm của chính người đó; mã của người khác không bị đụng tới; mã sai mẫu trả 400 |
| POST /api/nguoi-cung-cap/khoa-hoc | Đăng khóa, nhận JSON tới 20MB (quá thì 413). Đúng thì trả 201 { id } |

Mã lỗi:
- Gửi file tạm: sai loại, quá dung lượng, sai thời lượng, hết hạn mức, đủ 50 bài trả 400; file vượt giới hạn nhận của máy chủ (300MB) trả 413; trùng file trả 409 mã TRUNG_FILE. Câu lỗi ở cả loi và cac_o.file.
- Đăng khóa: lỗi dữ liệu trả 400 với cac_o theo đường dẫn ô, ví dụ "thong_tin.ten_khoa_hoc", "bai_hoc.2.cau_hoi.0.noi_dung", "bai_hoc" (bài số 1 là trắc nghiệm).
- Thiếu họ tên hoặc số điện thoại: 400 mã THIEU_HO_SO.
- Trùng file: 409 { ma: "TRUNG_FILE", vi_tri_bai }.
- File tạm không còn hoặc không thuộc người này hoặc sai loại: 400 mã FILE_TAM_KHONG_CON kèm vi_tri_bai (không có vi_tri_bai là ảnh bìa).
- Danh mục đã chọn không còn: 400 mã DANH_MUC_KHONG_CON, câu "Danh mục không còn tồn tại." ở cac_o["thong_tin.id_danh_muc"].
- Câu chung "Thông tin chưa hợp lệ, vui lòng kiểm tra lại." cho các lỗi trang đã chặn trước. Ô quá dài mà trang đã chặn bằng giới hạn số ký tự (tên khóa, tên bài quá 200, câu hỏi quá 1000, lựa chọn quá 255) dùng "Nội dung quá dài.".

Dùng lại: GET /api/danh-muc (Phần 6), GET /api/ho-so (Phần 5). Trường id_bai_hoc_dang_thay để Phần 8 làm (K6).

## 5. Xử lý file tạm

- Chỗ lưu: backend/luu_tru/tam/<id người cung cấp>/<uuid>.<đuôi>, kèm file mô tả <uuid>.json (tên gốc, dung lượng, mã băm, loại, thời lượng, đuôi, thời điểm tải). Mã file tạm là uuid đó. Lúc đang nhận, file có tên tạm "tai-<uuid>" chưa có đuôi; kiểm xong mới đổi tên.
- File không qua kiểm tra bị xóa ngay.
- Đăng xong: file chuyển sang luu_tru/video, tai_lieu, anh_bia với tên ngẫu nhiên mới; file mô tả bị xóa. Giao dịch lỗi thì trả file về chỗ tạm.
- "Hủy tải lên", "Hủy" ở trang thêm bài, "Xóa" một bài, chọn file khác thay file cũ, "Xóa ảnh" hoặc "Đổi ảnh": trang gọi xóa đúng file đó.
- "Hủy" cả lần tạo khóa: xóa mọi file tạm của người đó.
- Mở lại trang tạo khóa (sau khi thoát, đóng tab, mất mạng): trang gọi xóa mọi file tạm cũ.
- Bỏ dở lâu ngày: việc chạy mỗi giờ xóa file và file mô tả quá 24 giờ, so theo giờ ghi file trên máy chủ (ngoại lệ thứ hai ở C10); file tải dở không có file mô tả cũng bị dọn.
- Danh sách mã file tạm trang gửi kèm: máy chủ chỉ nhận mã đúng mẫu uuid và chỉ đọc trong thư mục của chính người đó.
- Trùng file: mã băm không được trùng bai_hoc.ma_bam_dang_dung (bài đã xóa và bài của khóa bị gỡ không chặn, C3) và không trùng file tạm trong danh sách trang gửi kèm. Lúc đăng kiểm lại từng bài, kể cả hai bài trong cùng khóa dùng chung một file; ghi từng bài theo số thứ tự, MySQL chặn trùng thì biết đúng bài số mấy.
- Hạn mức 5GB (5.368.709.120 byte): tổng dung lượng các bài chưa xóa thuộc khóa chưa xóa và chưa bị gỡ của người đó, cộng video và PDF trong danh sách file tạm của trang, cộng file mới. Ảnh bìa không tính.
- 50 bài: so_bai_hien_co bằng 50 thì từ chối file mới. Khi sửa bài thay file, trang gửi số bài không tính bài đang sửa.

## 6. Câu trả lời của người dùng

### Mục 9 (chỗ đặc tả, thiết kế và code khác nhau)
1. Câu "Video này không phát được...": theo đặc tả 7.7 và C18 ("vào Cài đặt, chọn Camera, chọn Định dạng, chọn Tương thích nhất."), không dùng mũi tên của thiết kế.
2. Thanh tiến độ: "Đang tải lên 62%" theo đặc tả và C18, không có dấu ba chấm.
3. Dòng bài ở bước 2: "Video, 05:40" theo C18, không dùng dấu chấm giữa.
4. Liên kết đầu trang bước 2 và trang thêm bài: "Quay lại" theo C18, không có mũi tên.
5. Đầu trang "Thêm bài học" lúc đang tạo khóa: theo T3.
6. Kiểu hộp: hộp "Đăng" (không tiêu đề) và hộp "Xóa bài học này?" (tiêu đề 22px, nút bên trái theo thứ tự "Xóa", "Hủy") làm đúng thiết kế của Phần 7; hộp của Phần 6 giữ nguyên.
7. Chữ mờ ô "Tên danh mục mới": thống nhất "Ví dụ: Nấu Ăn" như Phần 6.
8. "chỉ gồm chữ" ở luật trắc nghiệm: theo N2.
9. Dọn file tạm quá 24 giờ: theo K4.

### Nghiệp vụ
- N1. 5GB = 5 x 1024 x 1024 x 1024 = 5.368.709.120 byte (khớp cách tính 300MB và 20MB của đặc tả).
- N2. Ô câu hỏi và lựa chọn trắc nghiệm nhận mọi ký tự gõ được; "chỉ gồm chữ" nghĩa là chỉ có chữ viết, không có hình ảnh hay file. Đã sửa câu ở đặc tả 7.4.
- N3. Gửi file tạm không cần hồ sơ đủ họ tên và số điện thoại; chỉ chặn lúc đăng khóa. Trang vẫn không cho vào khi thiếu thông tin.
- N4. Bấm "Sửa" một bài lúc đang tạo khóa: giống Phần 8, tiêu đề "Sửa bài học", điền sẵn nội dung, ô "Loại bài" mờ; muốn đổi loại thì xóa bài rồi thêm lại.
- N5. Cho trùng tên khóa học (với khóa của mình hoặc của người khác).

### Người dùng thấy
- T1. Danh mục đã chọn bị admin xóa hoặc gộp trong lúc tạo khóa: lúc đăng máy chủ từ chối; trang quay về bước 1, ô Danh mục báo đỏ "Danh mục không còn tồn tại.", danh sách danh mục được tải lại, các bài giữ nguyên.
- T2. Hỏi lại khi rời trang: đóng tab hoặc tải lại thì dùng hộp hỏi có sẵn của trình duyệt (chữ không đổi được). Bấm liên kết trong web thì dùng HopThoai: tiêu đề "Rời trang?", dòng "Dữ liệu khóa học đang tạo sẽ bị mất.", hai nút "Ở lại" và "Rời trang".
- T3. Đầu trang "Thêm bài học" lúc đang tạo khóa: liên kết "Quay lại" về bước 2, giống bấm "Hủy" (file vừa tải bị xóa); đường dẫn vị trí "Hồ sơ / Quản lý khóa học / Tạo khóa học mới / Thêm bài học" (sửa bài thì chữ cuối là "Sửa bài học"); dòng "Khóa: <tên khóa>" không có nhãn trạng thái.
- T4. Bấm "Hủy" ở bước 1 hoặc bước 2: đang có dữ liệu thì hiện hộp hỏi của T2; đồng ý thì xóa mọi file tạm rồi về /ho-so#quan-ly-khoa-hoc. Chưa nhập gì thì về luôn.
- T5. Thời lượng video: dưới 1 giờ ghi mm:ss (ví dụ "05:40"); từ 1 giờ trở lên ghi giờ:phút:giây (ví dụ "1:02:05"). Đã ghi vào đặc tả 7.3.
- T6. Ô giá bán: tự thêm dấu chấm ngăn nghìn khi gõ như thiết kế ("349.000"); chỉ nhận chữ số; gõ "10000,5" thì báo "Giá bán phải từ 10.000đ đến 50.000.000đ".
- T7. Máy chủ báo trùng file lúc đăng: đóng hộp "Đăng", cuộn tới bài bị trùng, bài đó viền đỏ kèm "File này đã có trên AVA", không hiện thêm ô thông báo nhỏ.
- T8. Trang tạo khóa khi hồ sơ thiếu thông tin: liên kết chữ "Cập nhật hồ sơ", mở /ho-so#thong-tin-ca-nhan.
- T9. Dung lượng file: dưới 10 MB ghi 1 chữ số thập phân với dấu phẩy ("3,4 MB"); từ 10 MB ghi số nguyên ("48 MB"); dưới 1 MB ghi KB ("850 KB").
- File tạm không còn lúc bấm "Đăng" (đã mở trang tạo khóa ở tab khác hoặc để trang quá 24 giờ): bài đó viền đỏ kèm "File của bài này không còn trên máy chủ, vui lòng sửa bài và chọn lại file."; nếu là ảnh bìa thì quay về bước 1, báo cùng câu dưới ô Ảnh bìa. Đã ghi vào đặc tả 7.7.

### Trước đợt 2
- D1. Ô "Số thứ tự" chỉ nhận chữ số; để trống hoặc 0 thì xếp vào cuối.
- D2. File đã tải xong ở trang "Thêm bài học": tên file, dung lượng, nút "Chọn lại"; ở "Sửa bài học" nút ghi "Thay file".
- D3. Bấm "Đăng xuất" khi đang tạo khóa: đăng xuất luôn, không hỏi.
- D4. Trang kiểm 10.000 ký tự của bốn ô dài khi bấm "Tiếp tục", máy chủ vẫn kiểm lại; máy chủ báo lúc "Đăng" thì quay về bước 1, báo dưới đúng ô. Đã ghi vào đặc tả 7.4.
- D5. Ảnh bìa đang tải lên thì nút "Tiếp tục" mờ; lỗi lạ lúc đăng thì đóng hộp "Đăng", hiện ô thông báo nhỏ màu đỏ, dữ liệu giữ nguyên; chữ "Tạo khóa học mới" trên đường dẫn vị trí ở trang thêm bài bấm được, làm giống "Quay lại".

### Trước đợt 3
- E1. Bấm chọn "Trắc nghiệm" thì có sẵn 1 câu trống, dòng đếm "1/50 câu"; "Lưu bài học" khi chưa đủ 5 câu thì báo "Bài trắc nghiệm cần ít nhất 5 câu.".
- E2. Bấm "Xóa" ở bài 1 khi bài 2 là trắc nghiệm: dải đỏ dưới dòng "N bài học" và viền đỏ bài số 1 như thiet_ke/quan_ly_khoa_hoc/buoc_2_loi_bai_so_1.html; mất khi bấm việc khác ở bước 2 (Sửa, Xóa bài khác, Thêm bài học, Đăng) hoặc rời bước 2.
- E3. Ô "Thời gian làm bài (phút)" để trống lúc đầu, chỉ nhận chữ số, dòng gợi ý "Từ 1 đến 180 phút."; "Lưu bài học" khi ô trống hoặc ngoài 1 đến 180 thì báo "Thời gian làm bài từ 1 đến 180 phút." dưới ô.
- E4. Đủ 50 câu thì "+ Thêm câu hỏi" mờ; thùng rác xóa câu ngay, các câu sau tự đánh số lại.
- E5. Lỗi từng câu: thiếu nội dung báo dưới ô nội dung; thiếu lựa chọn thì ô trống viền đỏ kèm "Vui lòng nhập đủ 4 lựa chọn" thay dòng gợi ý; chưa chọn đáp án báo "Vui lòng chọn đáp án đúng"; sai cả hai thì hiện cả hai dòng; trang cuộn tới lỗi đầu tiên.
- E6. Bài trắc nghiệm lên số 1 khi thêm, sửa hoặc khi đổi số thứ tự bài khác: báo "Bài số 1 phải là bài video hoặc tài liệu." dưới ô Số thứ tự, không lưu.
- E7. Nhãn bài trắc nghiệm ở bước 2: nền vàng, "Trắc nghiệm, 5 câu, 10 phút".
- E8. Đã soạn câu rồi đổi sang Video hoặc Tài liệu: câu giữ tạm trong trang (đổi lại thì còn nguyên); "Lưu bài học" chỉ lưu dữ liệu của loại đang chọn.

### Kỹ thuật
- K1. Đổi App.jsx sang createBrowserRouter để dùng useBlocker chặn việc bấm liên kết rời trang; AppRouter.jsx và mọi đường dẫn giữ nguyên; không cài thư viện mới. Sau đợt 2 chạy lại toàn bộ kiểm thử.
- K2. Khi kiểm thử, file lưu ở thư mục tạm của Windows (biến THU_MUC_LUU_TRU, chỉ dùng khi kiểm thử); npm test tạo thư mục đó và xóa khi chạy xong. File thật trong backend/luu_tru không bị đụng tới. (Đã làm ở đợt 1.)
- K3. HopThoai thêm hai lựa chọn: bỏ tiêu đề, đặt nút bên trái theo thứ tự thiết kế Phần 7. Hộp Phần 6 giữ nguyên.
- K4. Dọn file tạm quá 24 giờ so theo giờ ghi file trên máy chủ; đã thêm ngoại lệ thứ hai vào C10 (phan_00_chung.md và CLAUDE.md giống hệt nhau) và backend/CLAUDE.md.
- K5. Mã lỗi khi gửi file tạm: 400 (riêng vượt giới hạn nhận của máy chủ là 413), trùng file 409; câu lỗi ở loi và cac_o.file; ma_file_tam_dang_dung gửi dạng chuỗi JSON.
- K6. Trường id_bai_hoc_dang_thay (câu "File giống hệt file hiện tại") để Phần 8 làm cùng chức năng thay file.
- K7. Phần 7 đặt file trang trong pages/provider/tao_khoa_hoc/. Tới Phần 8, các thành phần dùng chung hai nơi (bước 1, bước 2, trang soạn bài) chuyển sang components/khoa_hoc/; ghi việc chuyển vào kế hoạch Phần 8.
- K8. multer ghi thẳng file xuống thư mục tạm của người đó, giới hạn 314.572.800 byte; ảnh bìa và PDF kiểm dung lượng riêng sau khi nhận; loại file kiểm bằng 8 byte đầu, mã băm tính bằng cách đọc dần từng đoạn.

## 7. Kiểm thử

- Tự động (đợt 1, đã đạt): P07-01 đến P07-22, P07-30. File mẫu tạo trong bộ nhớ (Buffer), có byte ngẫu nhiên để mã băm khác nhau; file lớn (PDF 20MB cộng 1 byte, ảnh 2MB cộng 1 byte, JSON hơn 20MB) cũng tạo trong bộ nhớ. P07-08 ghi thẳng vào ava_test các bài có dung_luong lớn, không tạo file 5GB thật.
- Bấm tay (đợt 2 và 3): P07-23 đến P07-29.
- Vitest (đợt 2 và 3): các hàm trong utils/soanKhoaHoc.js.
- Không có file mẫu nào trong dự án; file kiểm thử gửi lên chỉ nằm ở thư mục tạm của Windows và bị xóa sau khi chạy; backend/luu_tru đã bị .gitignore chặn, chỉ giữ các file .gitkeep.

## 8. Danh sách bấm tay mở khóa sau Phần 7 (sau đợt 2)

- P05-17: kiểm được trọn.
- P06-12 phần cần khóa học: cột "Số khóa", nút "Xóa" mờ kèm chữ khi rê chuột, gộp danh mục có khóa. Phần xem dòng lịch sử gộp chờ Phần 19.
- P01-18: kiểm được (cần ít nhất 6 khóa ở 6 danh mục, mỗi khóa 3 bài với file khác nhau).
- P01-16: kiểm được một phần (menu chỉ hiện danh mục có khóa đang bán, sắp theo tên; bấm thì địa chỉ là /khoa-hoc?danh_muc=<id>, trang đó là Phần 10). Phần "danh mục chỉ có khóa bị ẩn" chờ Phần 8.
- P01-19: kiểm thêm trang /nguoi-cung-cap/tao-khoa-hoc có chân trang.
