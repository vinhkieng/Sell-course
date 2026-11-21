# Danh sách kiểm thử Phần 7. Tạo và đăng khóa học

- Đặc tả: docs/dac_ta/phan_07_tao_khoa_hoc.md
- Code kiểm thử tự động: backend/tests/phan_07_tao_khoa_hoc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: người cung cấp "ncc01" có họ tên và số điện thoại; người cung cấp "ncc02" chưa có số điện thoại; danh mục "Lập Trình". File mẫu tạo ngay trong code kiểm thử: video giả (vài byte có chữ "ftyp" ở byte thứ 4, gửi kèm thoi_luong), PDF giả (bắt đầu bằng "%PDF-"), JPG giả (FF D8 FF), file .zip đổi đuôi .mp4. Mỗi file mẫu khác nội dung để có mã băm khác nhau, trừ khi trường hợp cần trùng.
- Khóa hợp lệ mẫu (gọi là "khóa mẫu"): bước 1 đủ ô, giá 349000, 3 bài: bài 1 video, bài 2 tài liệu, bài 3 trắc nghiệm 5 câu, thời gian 15 phút; cam_ket true.

## P07-01 Tải file tạm hợp lệ
- Mục tiêu: lưu file vào chỗ tạm kèm file mô tả.
- Dữ liệu: ncc01 gửi video giả với thoi_luong 125.
- Các bước: gọi POST /api/nguoi-cung-cap/file-tam (loai 'Video').
- Kết quả mong đợi: trả { ma_file_tam, ten_file, dung_luong, thoi_luong }; có file luu_tru/tam/<id người cung cấp>/<uuid>.mp4 và <uuid>.json ghi tên gốc, dung lượng, mã băm SHA-256 viết thường 64 ký tự, loại, thời lượng, thời điểm tải; database chưa có dòng nào mới.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5; Phần chung C12

## P07-02 File sai loại theo byte đầu
- Mục tiêu: không tin đuôi tên file.
- Dữ liệu: file .zip đổi đuôi thành .mp4 gửi loai 'Video'; file .docx gửi loai 'Tài liệu'; file PNG giả gửi loai 'Ảnh bìa' (đúng) và file PDF gửi loai 'Ảnh bìa' (sai).
- Các bước: gọi POST /api/nguoi-cung-cap/file-tam.
- Kết quả mong đợi: các file sai bị từ chối với "File phải là video .mp4 và không quá 300MB", "File phải là .pdf và không quá 20MB", "Ảnh phải là jpg hoặc png, tối đa 2MB"; ảnh PNG đúng được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5, 7.7, 7.8; Phần chung C12

## P07-03 Thời lượng video ngoài khoảng
- Mục tiêu: chỉ nhận 1 đến 21600 giây.
- Dữ liệu: video giả với thoi_luong 0, 21601; biên đúng 1 và 21600.
- Các bước: gọi POST /api/nguoi-cung-cap/file-tam.
- Kết quả mong đợi: 0 và 21601 báo "Video phải dài từ 1 giây đến 6 giờ."; 1 và 21600 được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5, 7.7, 7.8; Phần chung C12

## P07-04 Dung lượng tối đa
- Mục tiêu: video tối đa 314.572.800 byte, PDF tối đa 20.971.520 byte, ảnh bìa tối đa 2MB.
- Dữ liệu: PDF giả 20.971.521 byte; ảnh 2MB cộng 1 byte. (Video quá 300MB thử bằng tay ở P07-26 vì file quá nặng cho kiểm thử tự động.)
- Các bước: gọi POST /api/nguoi-cung-cap/file-tam.
- Kết quả mong đợi: bị từ chối (400 hoặc 413) kèm câu đúng loại file.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.7

## P07-05 Trùng file với bài đang có trên AVA
- Mục tiêu: dấu vân tay không được trùng ma_bam_dang_dung.
- Dữ liệu: một khóa đã đăng có bài video với file X.
- Các bước: tải lại đúng file X làm file tạm.
- Kết quả mong đợi: bị từ chối với "File này đã có trên AVA", không nói trùng khóa nào.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5

## P07-06 Trùng file tạm khác trên cùng trang
- Mục tiêu: hai bài trên trang không dùng chung một file.
- Dữ liệu: file Y đã tải được ma_file_tam M1.
- Các bước: tải lại file Y, gửi kèm danh sách ma_file_tam [M1]; tải lại file Y nhưng không gửi kèm M1.
- Kết quả mong đợi: lần một báo "File này đã có trên AVA"; lần hai được nhận (chỉ so với file tạm trong danh sách trang gửi kèm).
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5, 7.8

## P07-07 Bài đã xóa và khóa bị gỡ không còn chặn
- Mục tiêu: da_xoa = 1 hoặc khong_chan_ma_bam = 1 thì không chặn.
- Dữ liệu: bài có file Z đã xóa (da_xoa = 1); bài có file W thuộc khóa bị gỡ (khong_chan_ma_bam = 1).
- Các bước: tải file Z và file W làm file tạm.
- Kết quả mong đợi: cả hai được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4; Phần chung C3

## P07-08 Hạn mức 5GB
- Mục tiêu: tổng dung lượng video và PDF vượt 5GB thì từ chối; ảnh bìa không tính.
- Dữ liệu: sửa dung_luong của các bài sẵn có của ncc01 sao cho tổng gần chạm 5GB, còn thiếu 10 byte.
- Các bước: tải PDF giả 11 byte; tải ảnh bìa.
- Kết quả mong đợi: PDF bị từ chối với "Bạn đã dùng hết 5GB dung lượng."; ảnh bìa vẫn được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5, 7.7

## P07-09 Đã đủ 50 bài
- Mục tiêu: trang gửi kèm số bài hiện có, không vượt 50.
- Dữ liệu: số bài hiện có 50.
- Các bước: tải thêm một file tạm.
- Kết quả mong đợi: bị từ chối với "Khóa học đã có đủ 50 bài.".
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.5, 7.7

## P07-10 Xóa file tạm
- Mục tiêu: xóa một file, xóa tất cả, chỉ xóa của chính mình.
- Dữ liệu: ncc01 có 2 file tạm; ncc02 (đã điền đủ hồ sơ) có 1 file tạm.
- Các bước: ncc01 gọi DELETE /api/nguoi-cung-cap/file-tam/<mã của ncc02>; ncc01 xóa một mã của mình; ncc01 gọi DELETE /api/nguoi-cung-cap/file-tam.
- Kết quả mong đợi: file của ncc02 còn nguyên; file của ncc01 bị xóa đúng (cả file mô tả).
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.5

## P07-11 Đăng khóa hợp lệ
- Mục tiêu: ghi đủ dữ liệu trong một lần, khóa bán ngay.
- Dữ liệu: khóa mẫu, có ảnh bìa.
- Các bước: tải các file tạm, gọi POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: trả id khóa mới; khoa_hoc trang_thai 'Đang bán', bi_an_boi và ly_do_an trống, da_xoa 0; 3 dòng bai_hoc đúng số thứ tự 1, 2, 3, bài video có thoi_luong, ten_file là tên gốc, ma_bam_file đúng; bài trắc nghiệm có thoi_gian_lam_bai 15 và 5 dòng cau_hoi_bai_tap; đúng một dòng lich_su_khoa_hoc 'Đăng khóa học'; file nằm ở luu_tru/video, tai_lieu, anh_bia với tên ngẫu nhiên mới; luu_tru/tam không còn các file đó và file mô tả.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5, 7.6, 7.8

## P07-12 Người cung cấp thiếu họ tên hoặc số điện thoại
- Mục tiêu: máy chủ chặn đăng khóa.
- Dữ liệu: ncc02 chưa có số điện thoại; khóa mẫu.
- Các bước: gọi thẳng POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: bị từ chối với "Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học."; không ghi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.3, 7.5, 7.8

## P07-13 Lỗi bước 1
- Mục tiêu: kiểm lại toàn bộ bước 1 ở máy chủ.
- Dữ liệu: tên trống; tên 201 ký tự; mô tả trống; không chọn danh mục; giá 9999, 50000001, 10000.5; mô tả 10.001 ký tự; ô "Dành cho ai" 10.001 ký tự.
- Các bước: gọi POST /api/nguoi-cung-cap/khoa-hoc với từng lỗi.
- Kết quả mong đợi: "Vui lòng nhập tên khóa học"; tên quá 200 ký tự bị từ chối; "Vui lòng nhập mô tả khóa học"; "Vui lòng chọn danh mục"; "Giá bán phải từ 10.000đ đến 50.000.000đ"; "Nội dung quá dài." dưới đúng ô; không ghi gì. Biên đúng: giá 10.000 và 50.000.000, mỗi ô đúng 10.000 ký tự được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.7

## P07-14 Số bài và bài số 1
- Mục tiêu: 3 đến 50 bài; bài 1 không phải trắc nghiệm; số thứ tự liền nhau từ 1.
- Dữ liệu: khóa 2 bài; khóa 3 bài mà bài 1 là trắc nghiệm; khóa có số thứ tự 1, 2, 4.
- Các bước: gọi POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: đều bị từ chối; bài 1 trắc nghiệm báo "Bài số 1 phải là bài video hoặc tài liệu."; không ghi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5

## P07-15 Bài trắc nghiệm sai
- Mục tiêu: luật trắc nghiệm.
- Dữ liệu: 4 câu; 51 câu; thời gian 0 và 181 phút; câu thiếu nội dung; câu thiếu một lựa chọn; câu không có đáp án đúng; nội dung câu 1001 ký tự; lựa chọn 256 ký tự.
- Các bước: gọi POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: "Bài trắc nghiệm cần ít nhất 5 câu."; quá 50 câu bị từ chối; "Thời gian làm bài từ 1 đến 180 phút."; "Vui lòng nhập nội dung câu hỏi"; "Vui lòng nhập đủ 4 lựa chọn"; "Vui lòng chọn đáp án đúng"; độ dài quá giới hạn bị từ chối. Biên đúng: 5 câu, 50 câu, 1 và 180 phút được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.7

## P07-16 Chưa tích cam kết
- Mục tiêu: phải có cam_ket = true.
- Dữ liệu: khóa mẫu với cam_ket false.
- Các bước: gọi POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: bị từ chối, không ghi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.3, 7.5

## P07-17 ma_file_tam không hợp lệ
- Mục tiêu: chỉ nhận mã thuộc đúng người này và còn tồn tại.
- Dữ liệu: dùng mã file tạm của ncc02; dùng mã đã bị xóa.
- Các bước: ncc01 gọi POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: bị từ chối, không ghi gì, file của ncc02 còn nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.5

## P07-18 Trùng file lúc đăng
- Mục tiêu: kiểm lại mã băm lúc đăng, báo đúng vị trí bài.
- Dữ liệu: tải file tạm V cho bài 2; trước khi đăng, một khóa khác được đăng với cùng file V.
- Các bước: đăng khóa mẫu.
- Kết quả mong đợi: 409 { ma: "TRUNG_FILE", vi_tri_bai: 2 }; không ghi khóa, bài, lịch sử nào.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4, 7.5

## P07-19 Danh mục "Khác"
- Mục tiêu: tạo danh mục mới khi đăng; tên đã có thì dùng danh mục có sẵn.
- Dữ liệu: ten_danh_muc_moi "lập trình game"; sau đó ten_danh_muc_moi "lập trình" (trùng "Lập Trình" có sẵn, giả như admin vừa thêm).
- Các bước: đăng hai khóa mẫu.
- Kết quả mong đợi: khóa một tạo danh mục "Lập Trình Game" và thuộc danh mục đó; khóa hai không báo lỗi, thuộc danh mục "Lập Trình" có sẵn, không thêm danh mục.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4; Phần 6 mục 6.4

## P07-20 Dữ liệu gửi lên tới 20MB
- Mục tiêu: đường đăng nhận JSON tới 20MB, quá thì 413.
- Dữ liệu: nội dung JSON khoảng 2MB (lớn hơn giới hạn chung 1MB) hợp lệ; nội dung lớn hơn 20MB.
- Các bước: gọi POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: lần một không bị lỗi 413 (đi tới bước kiểm tra); lần hai 413.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.5

## P07-21 Phân quyền
- Mục tiêu: chỉ người cung cấp dùng các đường của phần này.
- Dữ liệu: học viên, admin, khách.
- Các bước: gọi POST /api/nguoi-cung-cap/file-tam và POST /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: học viên và admin 403, khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần chung C5

## P07-22 Họ tên bị khóa sau khi đăng khóa đầu tiên
- Mục tiêu: liên kết với Phần 5.
- Dữ liệu: sau P07-11.
- Các bước: ncc01 gọi PUT /api/ho-so đổi họ tên.
- Kết quả mong đợi: 400, họ tên không đổi.
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.4; Phần 5 mục 5.5

## P07-23 Lối vào khi hồ sơ thiếu thông tin
- Mục tiêu: nút mờ và dòng nhắc.
- Dữ liệu: ncc02.
- Các bước: mở /ho-so#quan-ly-khoa-hoc; mở thẳng /nguoi-cung-cap/tao-khoa-hoc.
- Kết quả mong đợi: nút "+ Tạo khóa học mới" mờ kèm "Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học."; trang tạo khóa chỉ thấy dòng này và liên kết về hồ sơ.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.8

## P07-24 Bước 1 trên trang
- Mục tiêu: giao diện và kiểm tra trước ở bước 1.
- Dữ liệu: ncc01.
- Các bước: mở trang tạo khóa; bấm "Tiếp tục" khi trống; gõ tên xem bộ đếm; chọn "Khác" gõ "lập trình"; chọn ảnh bìa rồi "Đổi ảnh", "Xóa ảnh"; điền đúng rồi "Tiếp tục"; ở bước 2 bấm "← Quay lại".
- Kết quả mong đợi: thanh hai bước; lỗi dưới ô như thiet_ke/tao_khoa_hoc/buoc_1_bao_loi.html; bộ đếm "N/200 ký tự"; chọn "Khác" hiện ô "Tên danh mục mới" và báo ngay "Danh mục này đã có, vui lòng chọn trong danh sách"; có dòng "Bạn nhận 60% giá bán, hoặc 90% khi học viên mua qua link giới thiệu của bạn."; quay lại bước 1 không mất dữ liệu.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.7, 7.8

## P07-25 Bước 2 và số thứ tự tự dời
- Mục tiêu: danh sách bài và luật số thứ tự.
- Dữ liệu: đang có bài 1 video, 2 tài liệu, 3 video.
- Các bước: thêm bài mới vào số 2; thêm bài với số 99; xóa bài 2; thêm bài trắc nghiệm vào số 1; khi bài 2 là trắc nghiệm, bấm "Xóa" ở bài 1.
- Kết quả mong đợi: bài 2 cũ thành 3, bài 3 cũ thành 4; số 99 xếp vào cuối; xóa thì các bài sau dồn lên; trắc nghiệm vào số 1 báo "Bài số 1 phải là bài video hoặc tài liệu."; bấm "Xóa" bài 1 hiện ngay dải báo đỏ, không mở hộp xóa; bài 1 có nhãn "Bài học thử"; video hiện thời lượng mm:ss; nút "Đăng" mờ khi chưa đủ 3 bài.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.4, 7.8

## P07-26 Thêm bài video
- Mục tiêu: phát thử trước khi gửi, có thanh tiến độ.
- Dữ liệu: một video .mp4 H.264 thật; một video H.265 (iPhone, định dạng hiệu quả cao) hoặc file không có hình; một video trên 300MB.
- Các bước: chọn từng file ở trang "Thêm bài học"; bấm "Hủy tải lên" giữa chừng.
- Kết quả mong đợi: file tốt hiện "Đang tải lên… N%" rồi xong, "Lưu bài học" chỉ sáng khi xong; file không phát được báo "Video này không phát được trên trình duyệt. Hãy xuất lại video ở kiểu nén H.264. Với iPhone: Cài đặt → Camera → Định dạng → Tương thích nhất." và không gửi; file quá 300MB báo "File phải là video .mp4 và không quá 300MB" như thiet_ke/tao_khoa_hoc/them_bai_video_qua_300mb.html; hủy tải lên thì file tạm bị xóa.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.7

## P07-27 Thêm bài tài liệu và trắc nghiệm
- Mục tiêu: giao diện hai loại bài.
- Dữ liệu: một PDF thật; một file .zip.
- Các bước: thêm bài tài liệu với .zip rồi với PDF; thêm bài trắc nghiệm: thêm câu tới 50, xóa một câu bằng thùng rác, bỏ trống ô, không chọn đáp án.
- Kết quả mong đợi: .zip báo "File phải là .pdf và không quá 20MB" như thiet_ke/tao_khoa_hoc/them_bai_tai_lieu_sai_loai_file.html; trắc nghiệm có ô "Thời gian làm bài (phút)", câu tự đánh số, "+ Thêm câu hỏi" dừng ở 50 câu, lỗi như thiet_ke/tao_khoa_hoc/them_bai_trac_nghiem_bao_loi.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.7

## P07-28 Đăng và trùng file trên trang
- Mục tiêu: hộp cam kết, đăng thành công, trùng file giữ trang.
- Dữ liệu: khóa đủ 3 bài; một lần dùng lại video đã có trên AVA.
- Các bước: bấm "Đăng", xem hộp; tích ô rồi "Đăng"; làm lại với một bài trùng file.
- Kết quả mong đợi: hộp có ô "Tôi cam kết có quyền sử dụng toàn bộ video, tài liệu và hình ảnh trong khóa học này, và chịu trách nhiệm nếu vi phạm bản quyền.", nút "Đăng" chỉ sáng khi đã tích; thành công về /ho-so#quan-ly-khoa-hoc với ô thông báo "Đã đăng khóa học"; trùng file thì vẫn ở bước 2, bài đó đánh dấu đỏ "File này đã có trên AVA", các bài khác còn nguyên.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.7

## P07-29 Rời trang khi đang tạo khóa
- Mục tiêu: dữ liệu chỉ nằm trong trang, rời trang thì hỏi lại; mở lại trang thì file tạm cũ bị xóa.
- Dữ liệu: đang tạo khóa có 2 bài đã tải file.
- Các bước: bấm sang trang khác hoặc đóng tab; mở lại trang tạo khóa; xem thư mục backend/luu_tru/tam/<id>.
- Kết quả mong đợi: trình duyệt hỏi lại trước khi rời; mở lại thì trang trống, các file tạm cũ đã bị xóa; database không có khóa nào được ghi.
- Cách kiểm: Bấm tay
- Nguồn: Phần 7 mục 7.3, 7.5

## P07-30 Xóa file tạm quá 24 giờ
- Mục tiêu: việc chạy mỗi giờ xóa file tạm (và file mô tả) quá 24 giờ.
- Dữ liệu: hai file tạm, một file có thời điểm tải 25 giờ trước, một file mới.
- Các bước: gọi hàm dọn file tạm của việc chạy mỗi giờ.
- Kết quả mong đợi: file 25 giờ và file mô tả của nó bị xóa; file mới còn nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần chung C13
