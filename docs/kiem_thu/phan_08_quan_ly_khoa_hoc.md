# Danh sách kiểm thử Phần 8. Quản lý khóa học của người cung cấp

- Đặc tả: docs/dac_ta/phan_08_quan_ly_khoa_hoc.md
- Code kiểm thử tự động: backend/tests/phan_08_quan_ly_khoa_hoc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: người cung cấp "ncc01" có khóa K1 'Đang bán' (bài 1 video, 2 tài liệu, 3 video, 4 trắc nghiệm 5 câu), giá 349000; người cung cấp "ncc02"; học viên "hv01" đã mua K1 (đơn 'Đã thanh toán', da_hoan_tien 0). Khóa K2 của ncc01 chưa có người mua. File mẫu như Phần 7.

## P08-01 Danh sách khóa của mình
- Mục tiêu: chỉ khóa chưa xóa của chính mình, đủ trường.
- Dữ liệu: ncc01 có K1, K2 và một khóa đã xóa; ncc02 có một khóa.
- Các bước: ncc01 gọi GET /api/nguoi-cung-cap/khoa-hoc.
- Kết quả mong đợi: chỉ K1, K2 (mới tạo ở trên); mỗi khóa có tên, trạng thái, bi_an_boi, ly_do_an, số bài chưa xóa, giá; khóa đang bán có link giới thiệu dạng <địa chỉ website>/khoa-hoc/<id>?ref=<mã giới thiệu của ncc01>; có co_du_ho_so.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.3, 8.5

## P08-02 Không xem hay sửa khóa của người khác
- Mục tiêu: khóa của người khác hoặc đã xóa trả 404.
- Dữ liệu: khóa của ncc02; khóa đã xóa của ncc01.
- Các bước: ncc01 gọi GET, PUT, DELETE /api/nguoi-cung-cap/khoa-hoc/:id và POST .../an.
- Kết quả mong đợi: đều 404, không thay đổi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.5; Phần chung C5

## P08-03 Chi tiết khóa để sửa
- Mục tiêu: trả đủ thông tin và các cờ.
- Dữ liệu: K1.
- Các bước: gọi GET /api/nguoi-cung-cap/khoa-hoc/:id.
- Kết quả mong đợi: thông tin khóa; các bài chưa xóa theo số thứ tự, bài trắc nghiệm kèm câu hỏi và đáp án; co_nguoi_mua true; co_don_chua_thanh_toan_24h; co_bao_cao_chua_xu_ly; co_the_doi_gia (kèm thời điểm được đổi lại nếu chưa); trạng thái lúc này.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.5

## P08-04 Sửa thông tin khóa, mỗi ô một dòng lịch sử
- Mục tiêu: ghi đúng lịch sử 'Sửa thông tin khóa'.
- Dữ liệu: K1, đổi Mô tả và "Dành cho ai".
- Các bước: gọi PUT /api/nguoi-cung-cap/khoa-hoc/:id với thay đổi đó, cam_ket true.
- Kết quả mong đợi: thành công; hai dòng lich_su_khoa_hoc 'Sửa thông tin khóa', noi_dung_thay_doi "Sửa thông tin khóa - Mô tả" và "Sửa thông tin khóa - Dành cho ai", có gia_tri_cu và gia_tri_moi; khóa vẫn 'Đang bán'.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.5

## P08-05 Đổi giá một lần mỗi 24 giờ
- Mục tiêu: tính từ dòng 'Đổi giá' gần nhất.
- Dữ liệu: K1 chưa đổi giá lần nào.
- Các bước: đổi giá 349000 thành 399000; đổi tiếp thành 299000; lùi ngay_tao của dòng 'Đổi giá' 25 giờ rồi đổi lại.
- Kết quả mong đợi: lần một thành công, có dòng 'Đổi giá' với giá cũ và mới; lần hai bị từ chối với "Giá chỉ được đổi 1 lần mỗi 24 giờ.", giá không đổi, không ghi gì; lần ba thành công.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.7, 8.8

## P08-06 Đơn đã tạo giữ giá cũ
- Mục tiêu: giá mới chỉ áp dụng cho đơn tạo sau.
- Dữ liệu: một đơn 'Chờ thanh toán' chứa K1 giá 349000 tạo trước khi đổi giá.
- Các bước: đổi giá K1 thành 399000.
- Kết quả mong đợi: dòng chi_tiet_don_hang của đơn cũ vẫn 349000.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4

## P08-07 Đổi ảnh bìa và đổi danh mục
- Mục tiêu: ảnh cũ vào kho lưu trữ, ghi lịch sử.
- Dữ liệu: K1 có ảnh bìa; ảnh mới tải làm file tạm; chọn danh mục "Khác" tên mới.
- Các bước: đăng thay đổi.
- Kết quả mong đợi: ảnh cũ nằm ở luu_tru/kho_luu_tru (tên ngẫu nhiên mới); dòng 'Đổi ảnh bìa' có duong_dan_file_cu; dòng 'Đổi danh mục'; danh mục mới được tạo.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4

## P08-08 Thêm bài, đổi tên bài, đổi thứ tự
- Mục tiêu: lịch sử đúng dạng; chỉ ghi 'Đổi thứ tự bài' cho bài chủ động đổi.
- Dữ liệu: K1 (4 bài); thêm một bài video mới vào số 5; đổi tên bài 3; chủ động đổi bài 3 sang số 2 (bài 2 cũ tự dời thành số 3).
- Các bước: đăng thay đổi.
- Kết quả mong đợi: dòng 'Thêm bài' với noi_dung_thay_doi "Thêm bài - Bài 05 <tên>" và gia_tri_moi là tên bài; dòng 'Sửa bài' đổi tên có tên cũ và tên mới; đúng một dòng 'Đổi thứ tự bài' cho bài chủ động đổi, gia_tri_cu 3 và gia_tri_moi 2; bài 2 cũ tự dời không có dòng; số thứ tự liền nhau từ 1.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4

## P08-09 Thay file video
- Mục tiêu: cùng bài, file cũ vào kho, tiến độ xử lý đúng.
- Dữ liệu: bài 3 video của K1; hv01 đã học xong bài 3; học viên "hv02" đã mua K1 đang xem dở bài 3 (moc_luu_video 120, vi_tri_xem_cu 120).
- Các bước: tải file tạm mới với id_bai_hoc_dang_thay là bài 3; đăng thay đổi.
- Kết quả mong đợi: bài 3 giữ id, tên, số thứ tự; file, ten_file, dung_luong, thoi_luong, ma_bam_file mới; file cũ ở luu_tru/kho_luu_tru; dòng 'Thay file' noi_dung_thay_doi "Thay file - Bài 03 <tên>", gia_tri_cu và gia_tri_moi là tên file cũ và mới, có duong_dan_file_cu; tien_do_hoc của hv01 vẫn da_hoc_xong 1; của hv02 moc_luu_video 0, vi_tri_xem_cu 0.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.8

## P08-10 Thay file giống hệt file hiện tại
- Mục tiêu: báo riêng khi chọn lại đúng file đang dùng.
- Dữ liệu: file đang dùng của bài 3.
- Các bước: tải làm file tạm với id_bai_hoc_dang_thay là bài 3.
- Kết quả mong đợi: bị từ chối với "File giống hệt file hiện tại".
- Cách kiểm: Tự động
- Nguồn: Phần 7 mục 7.5; Phần 8 mục 8.7

## P08-11 Xóa bài khi khóa đã có người mua
- Mục tiêu: bắt buộc lý do, file vào kho, các bài sau dồn lên.
- Dữ liệu: K1 có 4 bài; xóa bài 2.
- Các bước: đăng thay đổi với bai_xoa [{ id bài 2 }] không có lý do; rồi với ly_do_xoa "Tài liệu sai" ; rồi thử lý do 256 ký tự.
- Kết quả mong đợi: không lý do bị từ chối với "Vui lòng nhập lý do"; lý do 256 ký tự bị từ chối; có lý do thì bài 2 da_xoa 1, file vào kho, dòng 'Xóa bài' noi_dung_thay_doi "Xóa bài - Bài 02 <tên>", ghi_chu "Tài liệu sai", có duong_dan_file_cu; các bài sau dồn số; bài 2 không còn trong GET của học viên.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.3, 8.4, 8.7, 8.8

## P08-12 Xóa bài khi chưa có người mua
- Mục tiêu: không cần lý do.
- Dữ liệu: K2 có 4 bài.
- Các bước: xóa một bài không gửi lý do.
- Kết quả mong đợi: thành công.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.3

## P08-13 Giữ 3 đến 50 bài và bài 1 không phải trắc nghiệm
- Mục tiêu: kiểm cả khi xóa và đổi thứ tự.
- Dữ liệu: khóa còn đúng 3 bài; khóa có bài 2 trắc nghiệm.
- Các bước: xóa một bài của khóa 3 bài; xóa bài 1 khi bài 2 là trắc nghiệm; đổi bài trắc nghiệm lên số 1.
- Kết quả mong đợi: đều bị từ chối; hai trường hợp sau báo "Bài số 1 phải là bài video hoặc tài liệu."; không thay đổi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.7

## P08-14 Sửa bài trắc nghiệm
- Mục tiêu: thay toàn bộ câu hỏi; giữ điểm cao nhất; xử lý lượt làm dở.
- Dữ liệu: bài 4 trắc nghiệm của K1; hv01 có diem_cao_nhat 8; hv02 có một lượt đã hết giờ (đã chọn vài đáp án); học viên "hv03" có một lượt còn giờ.
- Các bước: đăng thay đổi với 6 câu mới và thời gian mới.
- Kết quả mong đợi: cau_hoi_bai_tap của bài 4 là 6 câu mới; hv01 vẫn điểm 8; lượt của hv02 được chấm theo đề cũ (cập nhật điểm cao nhất, da_hoc_xong 1) rồi bị xóa; lượt của hv03 bị xóa, không có điểm; lịch sử chỉ một dòng 'Sửa bài'.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4; Phần 15

## P08-15 Đăng khi khóa vừa bị admin ẩn hoặc gỡ
- Mục tiêu: không lưu gì, trả 409.
- Dữ liệu: mở trang lúc K1 'Đang bán' (trang_thai_luc_mo 'Đang bán'); sau đó admin ẩn K1.
- Các bước: gọi PUT /api/nguoi-cung-cap/khoa-hoc/:id với trang_thai_luc_mo cũ.
- Kết quả mong đợi: 409, câu "Khóa học vừa bị quản trị viên ẩn hoặc gỡ nên thay đổi chưa được lưu. Vui lòng xem lý do ở mục Quản lý khóa học."; không có thay đổi, không có dòng lịch sử mới.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.7, 8.8

## P08-16 Đăng thay đổi khi khóa đang admin ẩn
- Mục tiêu: đăng là đưa khóa về bán.
- Dữ liệu: K1 'Bị ẩn', bi_an_boi 'Admin ẩn', ly_do_an có; mở trang ở trạng thái này.
- Các bước: sửa mô tả rồi đăng với trang_thai_luc_mo đúng.
- Kết quả mong đợi: K1 'Đang bán', bi_an_boi và ly_do_an trống; có dòng 'Sửa thông tin khóa' và dòng 'Người cung cấp đăng lại'.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4

## P08-17 Tự ẩn và đăng lại
- Mục tiêu: tự ẩn không tính vào luật hai lần, không tạo thông báo.
- Dữ liệu: K2 'Đang bán'.
- Các bước: gọi POST .../an; gọi lại POST .../an; gọi POST .../dang-lai không có cam_ket; gọi POST .../dang-lai với cam_ket true.
- Kết quả mong đợi: lần một K2 'Bị ẩn', bi_an_boi 'Tự ẩn', ly_do_an trống, dòng 'Người cung cấp ẩn', không có thong_bao mới; lần hai bị từ chối (chỉ khi 'Đang bán'); đăng lại thiếu cam kết bị từ chối; đăng lại đúng về 'Đang bán', dòng 'Người cung cấp đăng lại'; số dòng 'Quản trị viên ẩn khóa' và 'Hệ thống ẩn do khóa tài khoản' của K2 vẫn là 0.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.5, 8.8

## P08-18 Đăng lại chỉ cho khóa tự ẩn
- Mục tiêu: khóa admin ẩn không dùng nút đăng lại riêng.
- Dữ liệu: khóa 'Admin ẩn'.
- Các bước: gọi POST .../dang-lai với cam_ket true.
- Kết quả mong đợi: bị từ chối, khóa vẫn bị ẩn.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.5

## P08-19 Xóa khóa bị chặn
- Mục tiêu: ba điều kiện xóa, trả 409 đúng câu.
- Dữ liệu: K1 có người mua; K3 chưa có người mua nhưng có đơn 'Hết hạn' tạo 2 giờ trước chứa K3; K4 có phiếu báo cáo chưa xử lý về một bài.
- Các bước: gọi DELETE /api/nguoi-cung-cap/khoa-hoc/:id cho từng khóa.
- Kết quả mong đợi: 409 với "Khóa đã có người mua chỉ được ẩn."; "Khóa đang có đơn chờ thanh toán, vui lòng thử lại sau."; "Khóa đang có báo cáo vi phạm chưa được xử lý, chưa xóa được."; không xóa gì.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4, 8.5, 8.7, 8.8

## P08-20 Mọi lượt mua đã hoàn tiền thì xóa được
- Mục tiêu: "có người mua" không tính lượt đã hoàn tiền; đơn quá 24 giờ không chặn.
- Dữ liệu: K5 có một lượt mua da_hoan_tien 1 và một đơn 'Thất bại' tạo 25 giờ trước; K5 đang bị tự ẩn.
- Các bước: gọi DELETE.
- Kết quả mong đợi: xóa được.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.3, 8.4

## P08-21 Xóa khóa thành công
- Mục tiêu: xóa mềm, gỡ khỏi giỏ, xóa file, giữ kho lưu trữ.
- Dữ liệu: K2 có 3 bài và ảnh bìa, nằm trong giỏ của 2 học viên, có một file cũ trong kho lưu trữ.
- Các bước: gọi DELETE; mở GET /api/khoa-hoc/<id> (Phần 11).
- Kết quả mong đợi: khoa_hoc.da_xoa 1, mọi bài da_xoa 1; gio_hang không còn K2; dòng 'Người cung cấp xóa khóa học'; file video, PDF đang dùng và ảnh bìa hiện tại bị xóa khỏi luu_tru; file trong kho lưu trữ còn nguyên; trang chi tiết trả 404.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4

## P08-22 Khóa bị gỡ vĩnh viễn không thao tác được
- Mục tiêu: máy chủ từ chối mọi thao tác.
- Dữ liệu: khóa 'Bị gỡ vĩnh viễn' của ncc01.
- Các bước: gọi PUT, POST .../an, POST .../dang-lai, DELETE.
- Kết quả mong đợi: đều bị từ chối, không thay đổi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 8 mục 8.4

## P08-23 Mục "Quản lý khóa học" ở hồ sơ
- Mục tiêu: thẻ khóa và nút sao chép link.
- Dữ liệu: ncc01 có khóa đang bán, khóa tự ẩn, khóa admin ẩn có lý do, khóa bị gỡ.
- Các bước: mở /ho-so#quan-ly-khoa-hoc; bấm "Sao chép link giới thiệu" ở khóa đang bán; dán vào thanh địa chỉ.
- Kết quả mong đợi: mỗi thẻ có tên, trạng thái đúng chữ C11, "N bài · giá", "Lý do: …" ở khóa admin ẩn và bị gỡ; nút sao chép đổi thành "Đã sao chép" một lúc, link đúng dạng /khoa-hoc/<id>?ref=<mã>; khóa khác thì nút mờ kèm "Chỉ khóa đang bán mới có link giới thiệu".
- Cách kiểm: Bấm tay
- Nguồn: Phần 8 mục 8.3, 8.7

## P08-24 Trang quản lý khóa và sửa bài
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: K1.
- Các bước: mở /nguoi-cung-cap/khoa-hoc/<id>; xem khối "Ẩn khóa học" và "Xóa khóa học"; sang bước 2; mở "Sửa bài học"; đổi số thứ tự làm thay đổi bài học thử; bấm xóa bài khi còn 3 bài; bấm "Hủy" rồi mở lại.
- Kết quả mong đợi: bước 1 điền sẵn; khối ẩn có dòng "Khóa sẽ không hiện trên trang bán. Học viên đã mua vẫn học bình thường. Bạn có thể đăng lại bất cứ lúc nào."; ô "Loại bài" mờ; cảnh báo "Đổi số thứ tự này sẽ làm bài học thử đổi từ “…” sang “…”."; nút xóa bài mờ kèm "Khóa học cần ít nhất 3 bài. Hãy thêm bài mới trước khi xóa."; hộp xóa bài có ô "Lý do xóa" khi khóa đã có người mua; "Hủy" thì khóa giữ nguyên; giống các màn trong thiet_ke/quan_ly_khoa_hoc/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 8 mục 8.3, 8.7

## P08-25 Ẩn, đăng lại, xóa khóa trên trang
- Mục tiêu: nút và hộp đúng theo trạng thái.
- Dữ liệu: khóa đang bán chưa có người mua; khóa đang tự ẩn; khóa admin ẩn; khóa có người mua; khóa bị gỡ.
- Các bước: bấm "Ẩn khóa học"; bấm "Đăng" ở khóa tự ẩn; xem khóa admin ẩn; bấm "Xóa khóa học"; mở khóa bị gỡ.
- Kết quả mong đợi: ẩn ngay không hỏi, thông báo "Đã ẩn khóa học"; đăng lại qua hộp cam kết, "Đã đăng lại khóa học"; khóa admin ẩn có nút ẩn mờ và thấy lý do; khóa có người mua thì nút xóa mờ kèm "Khóa đã có người mua chỉ được ẩn."; hộp xóa "Xóa khóa học này?" với "Khóa học và toàn bộ bài học sẽ bị xóa vĩnh viễn, không thể hoàn tác.", xóa xong về /ho-so#quan-ly-khoa-hoc với "Đã xóa khóa học"; khóa bị gỡ chỉ xem, mọi nút mờ.
- Cách kiểm: Bấm tay
- Nguồn: Phần 8 mục 8.3, 8.7
