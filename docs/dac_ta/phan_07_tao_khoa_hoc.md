# PHẦN 7. TẠO KHÓA HỌC (NGƯỜI CUNG CẤP)

Làm sau Phần 6.

## 7.1 Mục đích và ai dùng
- Người cung cấp đã điền đủ họ tên và số điện thoại trong hồ sơ tạo khóa học qua hai bước: bước 1 "Thông tin khóa học", bước 2 "Bài học", rồi bấm "Đăng" là khóa lên bán ngay. Không có admin duyệt.

## 7.2 Màn thiết kế
- thiet_ke/tao_khoa_hoc/buoc_1.html (màn "Tạo khóa - Bước 1"): bước 1.
- thiet_ke/tao_khoa_hoc/buoc_1_bao_loi.html (màn "Tạo khóa - Bước 1 (báo lỗi)"): bước 1 báo lỗi (kèm ô "Tên danh mục mới" khi chọn "Khác").
- thiet_ke/tao_khoa_hoc/buoc_2_chua_du_3_bai.html (màn "Tạo khóa - Bước 2 (chưa đủ 3 bài)"): bước 2 khi chưa đủ 3 bài (nút "Đăng" mờ).
- thiet_ke/tao_khoa_hoc/buoc_2_hop_dang.html (màn "Tạo khóa - Bước 2 (hộp Đăng)"): bước 2 khi đủ 3 bài và hộp xác nhận "Đăng" có ô cam kết.
- thiet_ke/tao_khoa_hoc/them_bai_video.html (màn "Thêm bài (video)"): thêm bài loại Video, đang tải file lên.
- thiet_ke/tao_khoa_hoc/them_bai_tai_lieu_sai_loai_file.html (màn "Thêm bài (tài liệu, sai loại file)"): thêm bài loại Tài liệu, chọn sai loại file.
- thiet_ke/tao_khoa_hoc/them_bai_video_qua_300mb.html (màn "Thêm bài (video, quá 300MB)"): video quá 300MB.
- thiet_ke/tao_khoa_hoc/them_bai_video_khong_phat_duoc.html (màn "Thêm bài (video không phát được)"): video không phát được trên trình duyệt.
- thiet_ke/tao_khoa_hoc/them_bai_file_da_co.html (màn "Thêm bài (file đã có trên AVA)"): file đã có trên AVA.
- thiet_ke/tao_khoa_hoc/them_bai_trac_nghiem.html (màn "Thêm bài (trắc nghiệm)"): thêm bài loại Trắc nghiệm (soạn câu hỏi).
- thiet_ke/tao_khoa_hoc/them_bai_trac_nghiem_bao_loi.html (màn "Thêm bài (trắc nghiệm, báo lỗi)"): bài trắc nghiệm báo lỗi.

## 7.3 Giao diện và hành vi
- Lối vào: hồ sơ người cung cấp, mục "Quản lý khóa học", nút "+ Tạo khóa học mới" (và mục "Tạo khóa học" trên đầu trang). Hồ sơ thiếu họ tên hoặc số điện thoại thì nút này mờ kèm dòng "Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học."; mở thẳng /nguoi-cung-cap/tao-khoa-hoc thì cũng chỉ thấy dòng này và liên kết về hồ sơ.
- Thanh hai bước "1. Thông tin khóa học" và "2. Bài học" ở đầu trang. Toàn bộ dữ liệu đang tạo chỉ nằm trong trang (bộ nhớ của trang), chưa ghi gì vào cơ sở dữ liệu cho tới khi bấm "Đăng". Rời trang, đóng tab, mất mạng thì mất hết; khi đang có dữ liệu mà bấm rời trang thì trình duyệt hỏi lại.
- Bước 1: Tên khóa học (đếm "0/200 ký tự"), Mô tả, Danh mục (danh sách từ GET /api/danh-muc, cuối danh sách có "Khác"; chọn "Khác" thì hiện ô "Tên danh mục mới"), Giá bán (VND) kèm dòng "Bạn nhận 60% giá bán, hoặc 90% khi học viên mua qua link giới thiệu của bạn.", ba ô "Bạn sẽ học được gì", "Yêu cầu trước khi học", "Dành cho ai" (không bắt buộc, mỗi dòng một ý), Ảnh bìa (không bắt buộc, xem trước, "Đổi ảnh", "Xóa ảnh"), nút "Tiếp tục" và "Hủy".
- Bấm "Tiếp tục": trang kiểm tra bước 1 (7.4), lỗi hiện dưới ô; đúng hết thì sang bước 2. Tên danh mục mới trùng một danh mục có sẵn (so không phân biệt hoa thường và dấu với danh sách đã tải) thì báo "Danh mục này đã có, vui lòng chọn trong danh sách". Bước 2 có nút "Quay lại" về bước 1 mà không mất dữ liệu.
- Bước 2: tên khóa, nút "+ Thêm bài học", số bài, danh sách bài theo số thứ tự (bài số 1 có nhãn "Bài học thử"; mỗi bài có loại, thời lượng video dạng mm:ss khi dưới 1 giờ (ví dụ "05:40"), từ 1 giờ trở lên dạng giờ:phút:giây (ví dụ "1:02:05"), nút "Sửa", "Xóa"), nút "Đăng" (mờ khi chưa đủ 3 bài hợp lệ) và "Hủy".
- Thêm bài: trang "Thêm bài học" gồm Tên bài, Số thứ tự (mặc định là cuối danh sách, dòng "Nếu trùng với bài khác, các bài từ số này trở đi sẽ tự dời xuống một số."), Loại bài (Video, Tài liệu, Trắc nghiệm), phần nội dung theo loại, nút "Lưu bài học" và "Hủy". "Lưu bài học" chỉ giữ bài trong trang rồi quay về bước 2; "Hủy" quay về bước 2 không lưu (file tạm vừa tải bị xóa).
- Bài video: chọn file thì trình duyệt phát thử trước (dùng thẻ video ẩn). Không phát được hoặc không có hình thì báo lỗi "Video này không phát được trên trình duyệt. Hãy xuất lại video ở kiểu nén H.264. Với iPhone: vào Cài đặt, chọn Camera, chọn Định dạng, chọn Tương thích nhất." và không gửi lên. Phát được thì lấy thời lượng (giây, làm tròn lên) rồi gửi file lên máy chủ ngay, có thanh tiến độ "Đang tải lên 62%" và nút "Hủy tải lên". "Lưu bài học" mờ cho tới khi file tải xong và qua kiểm tra.
- Bài tài liệu: chọn file PDF, gửi lên ngay như video.
- Bài trắc nghiệm: ô "Thời gian làm bài (phút)" thay cho ô file; khu soạn câu: mỗi câu có ô nội dung câu hỏi, bốn ô lựa chọn A, B, C, D và nút tròn chọn đáp án đúng; câu tự đánh số; "+ Thêm câu hỏi" (tối đa 50 câu), biểu tượng thùng rác xóa một câu; thứ tự câu cố định theo lúc thêm.
- Bấm "Đăng": hộp xác nhận có ô tích "Tôi cam kết có quyền sử dụng toàn bộ video, tài liệu và hình ảnh trong khóa học này, và chịu trách nhiệm nếu vi phạm bản quyền." cùng nút "Đăng" (chỉ sáng khi đã tích) và "Hủy". Đăng thành công: về /ho-so#quan-ly-khoa-hoc, ô thông báo nhỏ "Đã đăng khóa học".
- Máy chủ báo một bài bị trùng file lúc đăng: giữ nguyên trang bước 2, đánh dấu đỏ đúng bài đó với câu "File này đã có trên AVA" để người cung cấp sửa bài thay file rồi bấm "Đăng" lại; không mất các bài khác.

## 7.4 Quy tắc
- Tên khóa học bắt buộc, tối đa 200 ký tự. Mô tả bắt buộc. Bốn ô "Mô tả", "Bạn sẽ học được gì", "Yêu cầu trước khi học", "Dành cho ai" mỗi ô tối đa 10.000 ký tự; quá thì hiện câu "Nội dung quá dài." ngay dưới ô đó (trang không có bộ đếm cho bốn ô này; trang kiểm khi bấm "Tiếp tục", máy chủ kiểm lại lúc đăng; máy chủ báo lỗi lúc "Đăng" thì trang quay về bước 1 và hiện câu dưới đúng ô). Danh mục bắt buộc, mỗi khóa đúng một danh mục. Tên danh mục mới theo luật ở Phần 6 mục 6.4.
- Giá bán một ô duy nhất, số nguyên đồng, từ 10.000 đến 50.000.000. Không có khóa miễn phí, không có ô tỷ lệ doanh thu.
- Ảnh bìa JPG hoặc PNG thật, tối đa 2MB.
- Mỗi khóa từ 3 đến 50 bài, tính cả bài trắc nghiệm. Mỗi bài là một trong ba loại: Video, Tài liệu (PDF), Trắc nghiệm. Bài số 1 phải là bài video hoặc tài liệu. Bài có số thứ tự nhỏ nhất là bài học thử.
- Tên bài bắt buộc, tối đa 200 ký tự.
- Video: file .mp4 thật, tối đa 300MB (314.572.800 byte), thời lượng 1 giây đến 6 giờ. Tài liệu: file .pdf thật, tối đa 20MB (20.971.520 byte). Không nhận file Word. Không nhúng YouTube.
- Bài trắc nghiệm: thời gian làm bài 1 đến 180 phút; 5 đến 50 câu; mỗi câu nội dung tối đa 1000 ký tự, đúng 4 lựa chọn mỗi lựa chọn tối đa 255 ký tự, không ô nào để trống, chỉ gồm chữ viết (nhận mọi ký tự gõ được như chữ số, dấu câu, ký hiệu, ví dụ "C++", "MP4", "2 + 2 = ?"; không có hình ảnh hay file); đúng 1 đáp án.
- Số thứ tự tự dời: chèn bài vào số đã có thì bài đang ở số đó và các bài sau dời xuống một số (có bài 1, 2, 3, thêm vào số 2 thì bài 2 cũ thành 3, bài 3 cũ thành 4); gõ số lớn hơn số bài hiện có thì xếp vào cuối; xóa bài thì các bài sau dồn lên, không để trống số. Xóa bài hoặc đổi số thứ tự mà làm bài trắc nghiệm lên số 1 thì không cho và báo "Bài số 1 phải là bài video hoặc tài liệu." (bấm "Xóa" ở bài 1 khi bài 2 là trắc nghiệm thì hiện ngay dải báo đỏ, không mở hộp xóa).
- Hạn mức 5GB mỗi người cung cấp: cộng dung lượng video và PDF của các bài chưa xóa thuộc khóa chưa xóa và chưa bị gỡ vĩnh viễn của người đó, cộng dung lượng các file tạm đang dùng trên trang (danh sách ma_file_tam trang gửi kèm, xem 7.5); không tính ảnh bìa và kho lưu trữ. File mới làm vượt 5GB thì từ chối.
- Chống đăng lại file đã có: dấu vân tay (mã băm SHA-256) của file không được trùng bai_hoc.ma_bam_dang_dung của bất kỳ bài nào trên AVA (kể cả của chính người đó), và không trùng một file tạm khác đang dùng trên chính trang đó (danh sách ma_file_tam trang gửi kèm, xem 7.5). Trùng thì báo "File này đã có trên AVA", không nói trùng với khóa nào. Bài đã xóa, bài của khóa bị gỡ vĩnh viễn (khong_chan_ma_bam = 1) và bài của khóa đã xóa không còn chặn.
- File được gửi lên máy chủ ngay khi chọn và chỉ giữ tạm; admin không thấy gì của khóa chưa đăng.
- Đăng: máy chủ làm tất cả trong một lần: kiểm tra lại toàn bộ bước 1 và các bài; kiểm tra lại mã băm từng bài (trùng thì trả lỗi kèm vị trí bài, không ghi gì); nếu chọn "Khác" thì tạo danh mục mới, nhưng nếu lúc này tên đó đã có (ví dụ admin vừa thêm) thì tự dùng danh mục có sẵn, không báo lỗi; ghi khóa, các bài, câu hỏi; chuyển file từ chỗ tạm sang thư mục chính thức; khóa "Đang bán" ngay; lịch sử ghi một dòng 'Đăng khóa học' cho cả khóa.
- Sau khi đăng khóa đầu tiên, họ tên và số điện thoại của người cung cấp không sửa được nữa (Phần 5).

## 7.5 Đường xử lý ở máy chủ (chỉ người cung cấp)
- Máy chủ không biết khi nào người dùng đóng tab, nên: mỗi lần mở trang tạo khóa hoặc trang quản lý khóa, trang gọi DELETE /api/nguoi-cung-cap/file-tam để xóa mọi file tạm cũ còn sót của chính người đó (đúng Chương 2: thoát giữa chừng thì mất hết file đã tải). Mỗi lần gửi file, trang gửi kèm danh sách ma_file_tam đang dùng trên trang; máy chủ chỉ so trùng và chỉ cộng hạn mức với các file tạm trong danh sách đó (và chỉ nhận mã thuộc đúng người này).
POST /api/nguoi-cung-cap/file-tam
- Nhận multipart: file, loai ('Video', 'Tài liệu' hoặc 'Ảnh bìa'), thoi_luong (giây, chỉ với video), id_bai_hoc_dang_thay (không bắt buộc, dùng ở Phần 8 khi thay file của một bài đã có).
- Kiểm tra lần lượt: loại file thật theo byte đầu; dung lượng; thời lượng video 1 đến 21600 giây; hạn mức 5GB (không áp cho ảnh bìa); số bài (trang gửi kèm số bài hiện có, không vượt 50); dấu vân tay (với video và tài liệu): trùng chính file đang dùng của id_bai_hoc_dang_thay thì báo "File giống hệt file hiện tại", trùng bài khác hoặc file tạm khác trong danh sách trang gửi kèm thì báo "File này đã có trên AVA".
- Hợp lệ: lưu vào luu_tru/tam/<id người cung cấp>/<uuid>.<đuôi> kèm một file mô tả <uuid>.json (tên file gốc, dung lượng, mã băm, loại, thời lượng, thời điểm tải). Trả { ma_file_tam, ten_file, dung_luong, thoi_luong }.
DELETE /api/nguoi-cung-cap/file-tam
- Xóa mọi file tạm của chính người đó (gọi khi mở trang tạo khóa hoặc trang quản lý khóa).
DELETE /api/nguoi-cung-cap/file-tam/:ma_file_tam
- Xóa file tạm của chính người đó (khi "Hủy tải lên", "Hủy" ở trang thêm bài, "Xóa" một bài chưa đăng, hoặc "Hủy" cả lần tạo khóa).
POST /api/nguoi-cung-cap/khoa-hoc
- Nhận: thong_tin { ten_khoa_hoc, mo_ta, id_danh_muc hoặc ten_danh_muc_moi, gia_ban, hoc_duoc_gi, yeu_cau, danh_cho_ai, ma_file_tam_anh_bia }, bai_hoc [ { ten_bai_hoc, so_thu_tu, loai, ma_file_tam (video, tài liệu), thoi_gian_lam_bai và cau_hoi [ { noi_dung, lua_chon_a, lua_chon_b, lua_chon_c, lua_chon_d, dap_an_dung } ] (trắc nghiệm) } ], cam_ket = true.
- Kiểm tra: người cung cấp đủ họ tên và số điện thoại; mọi quy tắc 7.4; số thứ tự liền nhau từ 1; mọi ma_file_tam thuộc đúng người này và còn tồn tại.
- Trùng mã băm lúc đăng trả 409 { ma: "TRUNG_FILE", vi_tri_bai: <số thứ tự> }.
- Đường này nhận dữ liệu gửi lên (JSON) tới 20MB, vì có thể chứa nhiều câu hỏi trắc nghiệm; quá thì trả 413.
- Hợp lệ: một giao dịch ghi danh_muc (nếu mới), khoa_hoc, bai_hoc, cau_hoi_bai_tap, lich_su_khoa_hoc; chuyển file tạm sang luu_tru/video, luu_tru/tai_lieu, luu_tru/anh_bia (đổi tên ngẫu nhiên mới, xóa file mô tả). Nếu giao dịch lỗi thì trả file về chỗ tạm. Trả id khóa mới.

## 7.6 Bảng dữ liệu dùng
- khoa_hoc: id_nguoi_cung_cap, id_danh_muc, ten_khoa_hoc, mo_ta, anh_bia (đường dẫn tương đối tính từ luu_tru, ví dụ anh_bia/<uuid>.jpg; trang lấy ảnh qua GET /api/anh/anh_bia/<tên file>), gia_ban, hoc_duoc_gi, yeu_cau, danh_cho_ai (ba cột này lưu nhiều dòng trong một ô, mỗi dòng một ý), trang_thai = 'Đang bán', bi_an_boi, ly_do_an để trống, da_xoa = 0, ngay_tao.
- bai_hoc: id_khoa_hoc, ten_bai_hoc, so_thu_tu, loai, duong_dan_file, ten_file (tên file gốc), dung_luong (byte), thoi_luong (giây, chỉ video), ma_bam_file, thoi_gian_lam_bai (phút, chỉ trắc nghiệm), da_xoa, khong_chan_ma_bam (ý nghĩa hai cột da_xoa và khong_chan_ma_bam xem Phần chung C3). Ràng buộc ck_bai_hoc_loai trong SQL quy định cột nào phải có theo từng loại.
- cau_hoi_bai_tap: id_bai_hoc, so_thu_tu (1 đến 50), noi_dung, lua_chon_a, lua_chon_b, lua_chon_c, lua_chon_d, dap_an_dung ('A' đến 'D').
- danh_muc, lich_su_khoa_hoc, nguoi_dung (ho_ten, so_dien_thoai).

## 7.7 Câu thông báo
- "Vui lòng nhập tên khóa học", "Vui lòng nhập mô tả khóa học", "Vui lòng chọn danh mục", "Vui lòng nhập tên danh mục mới", "Danh mục này đã có, vui lòng chọn trong danh sách", "Giá bán phải từ 10.000đ đến 50.000.000đ", "Ảnh phải là jpg hoặc png, tối đa 2MB", "Nội dung quá dài." (dưới ô Mô tả, Bạn sẽ học được gì, Yêu cầu trước khi học, Dành cho ai khi quá 10.000 ký tự).
- "Vui lòng nhập tên bài", "File phải là video .mp4 và không quá 300MB", "File phải là .pdf và không quá 20MB", "Video này không phát được trên trình duyệt. Hãy xuất lại video ở kiểu nén H.264. Với iPhone: vào Cài đặt, chọn Camera, chọn Định dạng, chọn Tương thích nhất.", "File này đã có trên AVA", "Video phải dài từ 1 giây đến 6 giờ.", "Bạn đã dùng hết 5GB dung lượng.", "Khóa học đã có đủ 50 bài.".
- Trắc nghiệm: "Vui lòng nhập nội dung câu hỏi", "Vui lòng nhập đủ 4 lựa chọn", "Vui lòng chọn đáp án đúng", "Bài trắc nghiệm cần ít nhất 5 câu.", "Thời gian làm bài từ 1 đến 180 phút.", "Bài số 1 phải là bài video hoặc tài liệu.".
- "Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học."
- "Đã đăng khóa học"
- "File của bài này không còn trên máy chủ, vui lòng sửa bài và chọn lại file." (lúc bấm "Đăng" mà file tạm của một bài không còn, ví dụ đã mở trang tạo khóa ở tab khác hoặc để trang quá 24 giờ: bài đó viền đỏ kèm câu này; nếu là ảnh bìa thì quay về bước 1, báo câu này dưới ô Ảnh bìa)
- "Thông tin chưa hợp lệ, vui lòng kiểm tra lại." (câu chung của máy chủ cho các lỗi trang đã chặn trước, ví dụ dưới 3 bài, số thứ tự không liền nhau, quá 50 câu, chưa tích cam kết)

## 7.8 Kiểm tra khi làm xong
- Người cung cấp chưa có số điện thoại: nút tạo khóa mờ; gọi thẳng API đăng khóa bị từ chối.
- Đổi đuôi một file .zip thành .mp4 rồi chọn: bị từ chối. Video 0 giây hoặc trên 6 giờ: bị từ chối.
- Thêm bài trắc nghiệm vào số 1: bị báo lỗi. Thêm bài vào số 2 khi đã có 3 bài: các bài sau dời đúng.
- Tải cùng một video vào hai bài: bài thứ hai bị báo "File này đã có trên AVA".
- Đăng xong: khóa "Đang bán", có đúng một dòng lịch sử 'Đăng khóa học', file nằm ở thư mục chính thức, thư mục tạm không còn file đó.
- Chọn "Khác" với tên "lập trình" trong khi đã có "Lập Trình": trang báo trùng ngay.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_07_tao_khoa_hoc.md
