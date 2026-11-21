# Danh sách kiểm thử Phần 15. Bài trắc nghiệm

- Đặc tả: docs/dac_ta/phan_15_trac_nghiem.md
- Code kiểm thử tự động: backend/tests/phan_15_trac_nghiem.test.js; hàm tính điểm và hàm hiện điểm (nếu là hàm thuần ở frontend) kiểm bằng vitest.
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: bài T (trắc nghiệm, 5 câu, 10 phút, đáp án đúng câu 1 đến 5 là A, B, C, D, A) của khóa K1; học viên "hvmua" đã mua K1; "hvchua" chưa mua; chủ khóa "ncc01"; admin. Muốn giả hết giờ thì lùi luot_lam_bai.thoi_diem_bat_dau trong database.

## P15-01 Trang giới thiệu khi chưa làm
- Mục tiêu: không có lượt, không có điểm.
- Dữ liệu: hvmua chưa làm T.
- Các bước: gọi GET /api/bai-hoc/<T>/trac-nghiem.
- Kết quả mong đợi: tên bài, 5 câu, 10 phút, không có điểm cao nhất, trạng thái không có lượt.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.3, 15.5

## P15-02 Bắt đầu làm bài
- Mục tiêu: tạo lượt, không lộ đáp án.
- Dữ liệu: hvmua.
- Các bước: gọi POST /api/bai-hoc/<T>/lam-bai.
- Kết quả mong đợi: có một dòng luot_lam_bai; trả 5 câu theo so_thu_tu, mỗi câu 4 lựa chọn, không có trường đáp án đúng ở bất kỳ đâu; số giây còn lại khoảng 600.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4, 15.5, 15.8

## P15-03 Bắt đầu lại khi đang có lượt còn giờ
- Mục tiêu: trả lại đúng lượt đó.
- Dữ liệu: lượt đang làm đã chọn câu 1 A, câu 3 C.
- Các bước: gọi POST /api/bai-hoc/<T>/lam-bai lần nữa; gọi GET /api/bai-hoc/<T>/trac-nghiem.
- Kết quả mong đợi: vẫn một dòng luot_lam_bai, câu đã chọn { "1": "A", "3": "C" }, số giây còn lại giảm dần (không đặt lại về 600).
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.3, 15.4, 15.8

## P15-04 Lưu câu trả lời
- Mục tiêu: lưu ngay, chọn lại thì ghi đè.
- Dữ liệu: lượt đang làm.
- Các bước: PUT /api/bai-hoc/<T>/lam-bai/cau-tra-loi với { so_thu_tu 2, lua_chon "A" }, rồi { 2, "B" }; gửi lua_chon "E"; gửi so_thu_tu 9.
- Kết quả mong đợi: cau_tra_loi có "2": "B"; "E" và câu 9 bị từ chối.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.3, 15.5

## P15-05 Nộp bài và chấm điểm
- Mục tiêu: chấm theo câu đã lưu, câu chưa làm tính sai, lưu điểm cao nhất, xóa lượt.
- Dữ liệu: lượt đã lưu câu 1 A, 2 B, 3 C, 4 A (sai), câu 5 bỏ trống.
- Các bước: gọi POST /api/bai-hoc/<T>/lam-bai/nop.
- Kết quả mong đợi: diem 6, so_cau_dung 3, tong_so_cau 5, diem_cao_nhat 6, thoi_gian_lam_giay đúng, het_gio false, dap_an đủ 5 câu với dap_an_dung và lua_chon_cua_ban (câu 5 trống); tien_do_hoc da_hoc_xong 1, diem_cao_nhat 6; luot_lam_bai bị xóa.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4, 15.5, 15.8

## P15-06 Làm lại điểm thấp hơn
- Mục tiêu: giữ điểm cao nhất.
- Dữ liệu: sau P15-05, làm lại đúng 2 câu.
- Các bước: bắt đầu, lưu, nộp.
- Kết quả mong đợi: diem 4, diem_cao_nhat vẫn 6.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4, 15.8

## P15-07 Cách làm tròn điểm
- Mục tiêu: làm tròn 2 chữ số bằng số nguyên.
- Dữ liệu: bài 6 câu đúng 1; bài 6 câu đúng 5; bài 7 câu đúng 5.
- Các bước: chấm từng bài (hoặc gọi hàm tính điểm).
- Kết quả mong đợi: 1,67; 8,33; 7,14 (hiện dạng "1,67/10").
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4; Phần chung C10

## P15-08 Hết giờ
- Mục tiêu: máy chủ chấm lượt hết giờ khi mở lại; lưu khi đã hết giờ bị từ chối.
- Dữ liệu: lượt đã chọn câu 1 A, 2 B; lùi thoi_diem_bat_dau 11 phút.
- Các bước: gọi PUT lưu câu 3; gọi GET /api/bai-hoc/<T>/trac-nghiem.
- Kết quả mong đợi: lưu bị 409; GET trả lượt vừa được chấm: diem 4, het_gio true, thoi_gian_lam_giay 600; tien_do_hoc cập nhật; lượt bị xóa.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.3, 15.4, 15.8

## P15-09 Bắt đầu khi có lượt đã hết giờ
- Mục tiêu: chấm lượt cũ trước rồi tạo lượt mới.
- Dữ liệu: lượt hết giờ đã đúng 4 câu; điểm cao nhất cũ 6.
- Các bước: gọi POST /api/bai-hoc/<T>/lam-bai.
- Kết quả mong đợi: diem_cao_nhat thành 8; có một lượt mới với khoảng 600 giây.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4

## P15-10 Lượt bị hủy do người cung cấp sửa bài
- Mục tiêu: trả 409 mã LUOT_DA_HUY.
- Dữ liệu: lượt còn giờ; người cung cấp đăng bản sửa bài T (Phần 8) làm lượt bị xóa.
- Các bước: lưu một câu; nộp bài.
- Kết quả mong đợi: cả hai 409, ma "LUOT_DA_HUY".
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4, 15.8; Phần 8 mục 8.4

## P15-11 Mất quyền học giữa chừng
- Mục tiêu: lưu và nộp bị từ chối.
- Dữ liệu: lượt còn giờ; sau đó khóa K1 bị gỡ (hoặc lượt mua được hoàn tiền).
- Các bước: lưu một câu; nộp bài.
- Kết quả mong đợi: bị từ chối, không cập nhật điểm.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.4

## P15-12 Người không có quyền học
- Mục tiêu: chỉ học viên có quyền học làm bài.
- Dữ liệu: hvchua, ncc01, admin.
- Các bước: gọi POST /api/bai-hoc/<T>/lam-bai.
- Kết quả mong đợi: bị từ chối; không có dòng luot_lam_bai nào.
- Cách kiểm: Tự động
- Nguồn: Phần 15 mục 15.1, 15.5, 15.8

## P15-13 Làm bài trên trang
- Mục tiêu: giao diện trang giới thiệu, làm bài, hộp kết quả, xem đáp án.
- Dữ liệu: hvmua, bài T.
- Các bước: mở bài T; bấm "Bắt đầu làm bài"; chọn 3 câu; bấm "Nộp bài"; bấm "Làm tiếp" rồi "Nộp bài"; bấm "Xem đáp án"; bấm "Làm lại".
- Kết quả mong đợi: trang giới thiệu có "06. <tên bài>" (theo số thứ tự thật), "5 câu · 10 phút", dòng "Đồng hồ bắt đầu chạy khi bạn bấm nút bên dưới. Tắt trang thì thời gian vẫn chạy."; trang làm bài có "Còn lại mm:ss", "Đã làm x/5 câu", "Câu 1." với 4 nút tròn; hộp "Bạn còn 2 câu chưa làm. Câu chưa làm sẽ tính là sai. Nộp bài?" với "Làm tiếp" và "Nộp bài"; hộp "Hoàn thành bài tập" có "Điểm lần này", "Đúng x/5 câu", "Điểm cao nhất", "Thời gian làm", "Xem đáp án", "Làm lại", nút ✕; trang đáp án tô xanh đáp án đúng kèm "Đáp án đúng", tô đỏ câu chọn sai, câu bỏ trống có "Bạn chưa chọn"; "Làm lại" vào thẳng trang làm bài; giống các màn thiet_ke/trac_nghiem/; không có chân trang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 15 mục 15.3, 15.7

## P15-14 Đóng trang khi đang làm
- Mục tiêu: đồng hồ vẫn chạy, câu đã chọn còn nguyên; hết giờ thì tự nộp.
- Dữ liệu: bài 1 phút (tạo riêng để thử nhanh).
- Các bước: bắt đầu, chọn 2 câu, đóng trang, mở lại khi còn giờ; làm lại, đóng trang, đợi quá 1 phút rồi mở lại; mở tab Network xem dữ liệu nhận về khi đang làm.
- Kết quả mong đợi: mở lại khi còn giờ thấy 2 câu đã chọn, đồng hồ chạy tiếp; quá giờ thì hộp kết quả có "Đã hết giờ, bài được tự nộp.", thời gian làm 01:00; dữ liệu nhận về khi đang làm không có đáp án đúng.
- Cách kiểm: Bấm tay
- Nguồn: Phần 15 mục 15.3, 15.8

## P15-15 Chủ khóa và admin mở bài trắc nghiệm
- Mục tiêu: xem đáp án, không làm bài.
- Dữ liệu: ncc01, admin.
- Các bước: mở bài T trên trang học.
- Kết quả mong đợi: thấy câu hỏi kèm nhãn "Đáp án đúng", không có nút làm bài, không thấy điểm học viên; không có dòng luot_lam_bai.
- Cách kiểm: Bấm tay
- Nguồn: Phần 15 mục 15.1, 15.8

## P15-16 Lượt bị hủy trên trang
- Mục tiêu: câu báo và quay về trang giới thiệu.
- Dữ liệu: hvmua đang làm còn giờ; ncc01 đăng bản sửa bài T ở thẻ khác.
- Các bước: hvmua chọn tiếp một câu.
- Kết quả mong đợi: câu "Bài trắc nghiệm vừa được người cung cấp cập nhật, lượt làm này đã bị hủy. Vui lòng làm lại." rồi về trang giới thiệu.
- Cách kiểm: Bấm tay
- Nguồn: Phần 15 mục 15.4, 15.7, 15.8
