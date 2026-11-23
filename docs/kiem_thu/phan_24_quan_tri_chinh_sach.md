# Danh sách kiểm thử Phần 24. Quản trị trang Chính sách (chức năng thêm)

- Đặc tả: docs/dac_ta/phan_24_quan_tri_chinh_sach.md
- Code kiểm thử tự động: backend/tests/phan_24_quan_tri_chinh_sach.test.js; hàm dựng nội dung theo luật gõ ở frontend kiểm bằng vitest.
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: file chinh_sach.json của kiểm thử (DUONG_DAN_CHINH_SACH) chép lại từ file mặc định trước mỗi trường hợp: 12 điều, phien_ban 1, cap_nhat_luc null. Admin; học viên; người cung cấp.

## P24-01 Đọc chính sách ở khu quản trị
- Mục tiêu: trả danh sách, phiên bản, ngày cập nhật.
- Dữ liệu: file ban đầu.
- Các bước: admin gọi GET /api/quan-tri/chinh-sach.
- Kết quả mong đợi: 12 điều (số thứ tự, tên, nội dung), phien_ban 1, ngày cập nhật null.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.5

## P24-02 Sửa một điều
- Mục tiêu: lưu, tăng phiên bản, cập nhật ngày, ghi file.
- Dữ liệu: sửa điều 2 với tên "Tài khoản người dùng", nội dung mới, phien_ban 1.
- Các bước: gọi PUT /api/quan-tri/chinh-sach/dieu/2; gọi GET /api/chinh-sach.
- Kết quả mong đợi: trả toàn bộ chính sách mới, phien_ban 2, ngày cập nhật là hôm nay theo giờ Việt Nam; file có nội dung mới; trang công khai đọc ra nội dung mới và ngày cập nhật.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.4, 24.5, 24.8

## P24-03 Thêm điều
- Mục tiêu: thêm vào cuối; tối đa 50 điều.
- Dữ liệu: file 12 điều; file 50 điều.
- Các bước: gọi POST /api/quan-tri/chinh-sach/dieu với tên và nội dung.
- Kết quả mong đợi: lần một có 13 điều, điều mới là điều 13; file 50 điều trả 400 mã QUA_SO_DIEU, không ghi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.4, 24.5

## P24-04 Xóa điều
- Mục tiêu: các điều sau tự đánh lại số; không xóa điều cuối cùng còn lại.
- Dữ liệu: file 12 điều; file 1 điều.
- Các bước: gọi DELETE /api/quan-tri/chinh-sach/dieu/3; xóa ở file 1 điều; xóa điều số 99.
- Kết quả mong đợi: còn 11 điều, điều 4 cũ thành điều 3; file 1 điều trả 400 mã CON_MOT_DIEU; điều 99 trả 404.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.3, 24.4, 24.5, 24.8

## P24-05 Đổi thứ tự
- Mục tiêu: đổi chỗ với điều kề; điều đầu không lên, điều cuối không xuống.
- Dữ liệu: file 12 điều.
- Các bước: gọi POST .../dieu/1/doi-thu-tu với huong "xuong"; điều 1 với "len"; điều 12 với "xuong".
- Kết quả mong đợi: lần một điều 1 và 2 đổi chỗ, phiên bản tăng; hai lần sau 400.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.3, 24.5, 24.8

## P24-06 Kiểm tra ô tên và nội dung
- Mục tiêu: luật độ dài, bỏ dấu cách và dòng trống ở đầu cuối.
- Dữ liệu: tên "   "; tên 201 ký tự; nội dung "\n\n  \n"; nội dung 20.001 ký tự; biên đúng tên 200 ký tự và nội dung 20.000 ký tự; tên "  Bảo mật  ".
- Các bước: gọi PUT .../dieu/1.
- Kết quả mong đợi: 400 kèm cac_o.ten "Vui lòng nhập tên điều"; tên quá dài bị từ chối; cac_o.noi_dung "Vui lòng nhập nội dung"; "Nội dung quá dài."; biên đúng được nhận; tên lưu "Bảo mật".
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.4, 24.5, 24.7

## P24-07 Hai admin cùng sửa
- Mục tiêu: phiên bản lệch thì 409, không ghi đè.
- Dữ liệu: hai yêu cầu cùng gửi phien_ban 1.
- Các bước: gửi yêu cầu thứ nhất (sửa điều 2); gửi yêu cầu thứ hai (sửa điều 5) với phien_ban 1.
- Kết quả mong đợi: thứ nhất thành công (phien_ban 2); thứ hai 409 "Chính sách vừa được quản trị viên khác thay đổi. Vui lòng tải lại trang.", file giữ nội dung của yêu cầu thứ nhất.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.5, 24.8

## P24-08 Ghi lần lượt và ghi an toàn
- Mục tiêu: nhiều yêu cầu ghi được xếp hàng, file không hỏng.
- Dữ liệu: 5 yêu cầu đổi thứ tự cùng gửi phien_ban 1.
- Các bước: gửi đồng thời cả 5 yêu cầu; đọc file.
- Kết quả mong đợi: đúng một yêu cầu thành công, 4 yêu cầu còn lại 409; file là JSON hợp lệ với phien_ban 2; không còn file tạm sót trong thư mục.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.5

## P24-09 File hỏng thì dùng file mặc định
- Mục tiêu: không lỗi, ghi nhật ký.
- Dữ liệu: ghi chữ "khong phai json" vào file kiểm thử.
- Các bước: gọi GET /api/chinh-sach và GET /api/quan-tri/chinh-sach.
- Kết quả mong đợi: trả 12 điều của file mặc định; nhật ký có dòng lỗi.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.5

## P24-10 Phân quyền và Origin
- Mục tiêu: chỉ admin; thay đổi phải có Origin đúng.
- Dữ liệu: học viên, người cung cấp, khách; admin gửi PUT không có Origin.
- Các bước: gọi các đường /api/quan-tri/chinh-sach.
- Kết quả mong đợi: học viên và người cung cấp 403; khách 401; admin thiếu Origin 403; không ghi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.1, 24.5, 24.8; Phần chung C6

## P24-11 Không đụng database
- Mục tiêu: không ghi lịch sử khóa học, không thông báo.
- Dữ liệu: đếm số dòng lich_su_khoa_hoc và thong_bao trước và sau.
- Các bước: sửa, thêm, xóa, đổi thứ tự.
- Kết quả mong đợi: hai bảng không thêm dòng.
- Cách kiểm: Tự động
- Nguồn: Phần 24 mục 24.1

## P24-12 Hàm dựng nội dung theo luật gõ
- Mục tiêu: dựng đúng khoản, gạch, gạch con, đoạn trong khoản, tiêu đề nhỏ, đoạn mới; không chạy thẻ HTML.
- Dữ liệu: nội dung có "1. Khoản một", "  - gạch con", "  Đoạn thụt", "- Gạch", "## 7.1. Tiêu đề", "1.000 học viên", dòng trống, "<script>alert(1)</script>".
- Các bước: gọi hàm dựng (vitest), xem cấu trúc kết quả.
- Kết quả mong đợi: "1. " thành khoản số 1 (số đúng như gõ); "  - " là gạch con trong khoản trên; dòng thụt 2 dấu cách là đoạn trong khoản trên; "- " là gạch đầu dòng; "## " là tiêu đề nhỏ giữ nguyên "7.1."; "1.000 học viên" là chữ thường; dòng trống sang đoạn mới; thẻ script hiện thành chữ.
- Cách kiểm: Tự động (vitest)
- Nguồn: Phần 24 mục 24.4, 24.8

## P24-13 Trang quản trị Chính sách
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: file ban đầu.
- Các bước: mở /quan-tri/chinh-sach; bấm "Xuống" ở Điều 1; bấm "Sửa" Điều 7; gõ nội dung có các luật gõ; bấm "Lưu" khi trống; lưu đúng; bấm "+ Thêm điều"; bấm "Xóa"; thử rời trang khi đang sửa chưa lưu.
- Kết quả mong đợi: tiêu đề "Chính sách và điều khoản", chưa có dòng "Cập nhật lần cuối"; mỗi dòng "Điều N. <tên>" với "Lên", "Xuống", "Sửa", "Xóa", "Lên" của điều đầu và "Xuống" của điều cuối mờ; "Đã đổi thứ tự"; hộp "Sửa Điều 7" điền nội dung đang lưu (không phải chữ mẫu trên màn thiết kế), dòng "Chỉ gõ tên. Chữ "Điều 7." do hệ thống tự thêm.", bảng nhắc luật gõ, dòng "Đổi thứ tự hoặc xóa điều có thể làm sai các chỗ ghi số điều (ví dụ "Điều 3") trong nội dung, hãy kiểm tra lại."; khung "Xem trước" cập nhật khi gõ, ở điện thoại nằm dưới ô; lỗi như thiet_ke/quan_tri_chinh_sach/chinh_sach_them_dieu_bao_loi.html; "Đã lưu điều", "Đã thêm điều"; hộp "Xóa Điều N. <tên>?", "Đã xóa điều"; còn 1 điều thì nút "Xóa" mờ; đủ 50 điều thì "+ Thêm điều" mờ; trình duyệt hỏi lại khi rời trang; không có chân trang; giống các màn thiet_ke/quan_tri_chinh_sach/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 24 mục 24.2, 24.3, 24.7

## P24-14 Hai thẻ cùng sửa và trang công khai
- Mục tiêu: câu báo 409 và nội dung công khai.
- Dữ liệu: hai thẻ cùng mở /quan-tri/chinh-sach.
- Các bước: thẻ một sửa Điều 2 rồi lưu; thẻ hai sửa Điều 2 rồi lưu; mở /chinh-sach; mở /chinh-sach#dieu-3 sau khi xóa Điều 3.
- Kết quả mong đợi: thẻ hai thấy "Chính sách vừa được quản trị viên khác thay đổi. Vui lòng tải lại trang." và không lưu; trang công khai hiện nội dung của thẻ một và dòng "Cập nhật lần cuối: <ngày hôm nay>"; neo #dieu-3 cuộn tới điều đang đứng thứ 3.
- Cách kiểm: Bấm tay
- Nguồn: Phần 24 mục 24.3, 24.8
