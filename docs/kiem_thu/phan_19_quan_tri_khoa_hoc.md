# Danh sách kiểm thử Phần 19. Quản trị khóa học

- Đặc tả: docs/dac_ta/phan_19_quan_tri_khoa_hoc.md
- Code kiểm thử tự động: backend/tests/phan_19_quan_tri_khoa_hoc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: admin; người cung cấp "ncc01" có K1 'Đang bán' (4 bài, có học viên "hvmua" đã mua, có phiếu báo cáo chờ ở bài 2 và phần giới thiệu), K2 'Bị ẩn' 'Tự ẩn', K3 'Bị ẩn' 'Admin ẩn', K4 'Bị gỡ vĩnh viễn', K5 đã xóa.

## P19-01 Danh sách và bộ lọc
- Mục tiêu: bốn lựa chọn kèm số, không có khóa đã xóa.
- Dữ liệu: dữ liệu chung.
- Các bước: gọi GET /api/quan-tri/khoa-hoc với trang_thai tat-ca, dang-ban, bi-an, bi-go.
- Kết quả mong đợi: số đếm 4, 1, 2, 1; không có K5; mỗi dòng có tên, người cung cấp (họ tên, trống thì tên đăng nhập), danh mục, ngày đăng, trạng thái; mới nhất ở trên; 20 dòng mỗi trang.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.3, 19.8

## P19-02 Chi tiết khóa cho admin
- Mục tiêu: đủ thông tin, học viên đã mua còn học được không.
- Dữ liệu: K1, K3, K4; K5.
- Các bước: gọi GET /api/quan-tri/khoa-hoc/:id.
- Kết quả mong đợi: thông tin, bài chưa xóa, trạng thái, lý do, số dòng lịch sử; K1 và K3 "vẫn học được", K4 "không học được"; K5 trả 404.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.4, 19.8

## P19-03 Admin xem bài ở mọi trạng thái
- Mục tiêu: xem video theo từng đoạn, PDF, trắc nghiệm kèm đáp án, kể cả khóa bị gỡ.
- Dữ liệu: bài video, tài liệu, trắc nghiệm của K4.
- Các bước: gọi GET /api/quan-tri/bai-hoc/:id/video (có Range), /tai-lieu, /trac-nghiem.
- Kết quả mong đợi: video 206; PDF trả về; trắc nghiệm có câu hỏi và đáp án đúng.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.4, 19.8

## P19-04 Ẩn lần đầu
- Mục tiêu: ẩn đúng, ghi lịch sử, thông báo, đổi phiếu đang chờ.
- Dữ liệu: K1 chưa từng bị ẩn được tính.
- Các bước: gọi POST /api/quan-tri/khoa-hoc/<K1>/an với { ly_do "Vi phạm bản quyền", muc null }.
- Kết quả mong đợi: K1 'Bị ẩn', 'Admin ẩn', ly_do_an đúng; một dòng lịch sử 'Quản trị viên ẩn khóa' với ghi_chu là lý do, gia_tri_cu "Đang bán", gia_tri_moi "Bị ẩn (admin ẩn)", id_nguoi_dung là admin; một thông báo 'Khóa học bị ẩn' cho ncc01; mọi phiếu chờ của K1 thành 'Ẩn khóa' với id_quan_tri_vien là admin; hvmua vẫn học được.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.5, 19.6, 19.11

## P19-05 Ẩn lần thứ hai thành gỡ vĩnh viễn
- Mục tiêu: đếm lần ẩn từ lịch sử.
- Dữ liệu: K1 sau P19-04, người cung cấp đăng lại về 'Đang bán'.
- Các bước: admin ẩn K1 lần nữa với lý do "Tái phạm".
- Kết quả mong đợi: K1 'Bị gỡ vĩnh viễn', bi_an_boi NULL, ly_do_an "Tái phạm"; lịch sử thêm 'Quản trị viên ẩn khóa' và 'Hệ thống gỡ vĩnh viễn'; mọi bài (kể cả đã xóa) khong_chan_ma_bam 1; chỉ một thông báo 'Khóa học bị gỡ vĩnh viễn' với lý do "Tái phạm"; phiếu chờ thành 'Gỡ vĩnh viễn'; người khác tải lên đúng file của K1 được (Phần 7); hvmua thấy "không khả dụng".
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.5, 19.11; Phần 18 mục 18.4

## P19-06 Ẩn đè khóa tự ẩn
- Mục tiêu: được ẩn và tính một lần.
- Dữ liệu: K2 'Tự ẩn'.
- Các bước: admin ẩn K2.
- Kết quả mong đợi: K2 'Admin ẩn'; số lần ẩn được tính là 1.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.4, 19.11

## P19-07 Trạng thái không cho phép
- Mục tiêu: chặn đúng bảng 19.4.
- Dữ liệu: K3 'Admin ẩn'; K4 'Bị gỡ vĩnh viễn'.
- Các bước: ẩn K3; ẩn K4; gỡ K4.
- Kết quả mong đợi: đều 409 "Trạng thái khóa học vừa thay đổi, vui lòng tải lại trang."; không ghi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.4, 19.8, 19.11

## P19-08 Gỡ vĩnh viễn
- Mục tiêu: gỡ khóa đang bán hoặc bị ẩn.
- Dữ liệu: K3 'Admin ẩn'.
- Các bước: gọi POST /api/quan-tri/khoa-hoc/<K3>/go-vinh-vien với lý do.
- Kết quả mong đợi: 'Bị gỡ vĩnh viễn'; lịch sử 'Quản trị viên gỡ vĩnh viễn', không có file cũ; mọi bài khong_chan_ma_bam 1; thông báo gỡ; phiếu chờ thành 'Gỡ vĩnh viễn'; file vẫn ở chỗ cũ.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.5

## P19-09 Lý do bắt buộc
- Mục tiêu: không có lý do hoặc quá 255 ký tự thì từ chối.
- Dữ liệu: ly_do rỗng; ly_do 256 ký tự.
- Các bước: gọi ẩn và gỡ.
- Kết quả mong đợi: rỗng báo "Vui lòng nhập lý do"; quá dài bị từ chối; không đổi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.5, 19.10

## P19-10 Đổi kết quả phiếu theo mục được mở
- Mục tiêu: có ?muc= thì đổi thêm mọi phiếu của đúng mục đó; không có thì chỉ đổi phiếu đang chờ.
- Dữ liệu: K6 có phiếu bài 2 đã 'Không vi phạm', phiếu bài 2 đang chờ, phiếu bài 3 đã 'Không vi phạm'.
- Các bước: ẩn K6 với muc "bai-<bài 2>"; làm lại dữ liệu rồi ẩn K6 không có muc.
- Kết quả mong đợi: lần một mọi phiếu bài 2 thành 'Ẩn khóa', phiếu bài 3 giữ 'Không vi phạm'; lần hai chỉ phiếu đang chờ đổi, các phiếu 'Không vi phạm' giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.6

## P19-11 Lịch sử thay đổi và file cũ
- Mục tiêu: xem lịch sử, phát file cũ đúng dòng.
- Dữ liệu: K1 có 25 dòng lịch sử, trong đó một dòng 'Thay file' video có duong_dan_file_cu.
- Các bước: gọi GET /api/quan-tri/khoa-hoc/<K1>/lich-su?trang=1 và 2; gọi GET /api/quan-tri/lich-su/<id dòng>/file-cu (có Range); gọi file cũ của một dòng không có file.
- Kết quả mong đợi: 20 dòng rồi 5 dòng, mới nhất trên, có tên đăng nhập người thực hiện; file cũ trả 206; dòng không có file trả 404.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.7, 19.8, 19.11

## P19-12 Phân quyền
- Mục tiêu: chỉ admin.
- Dữ liệu: ncc01, học viên, khách.
- Các bước: gọi GET /api/quan-tri/khoa-hoc, POST .../an, GET /api/quan-tri/lich-su/:id/file-cu.
- Kết quả mong đợi: ncc01 và học viên 403; khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần 19 mục 19.8, 19.11

## P19-13 Trang danh sách và chi tiết
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: dữ liệu chung.
- Các bước: mở /quan-tri/khoa-hoc; đổi bộ lọc; bấm "Xem"; xem tab "Nội dung", bấm "Xem" từng loại bài; xem tab "Lịch sử thay đổi", rê chuột vào giá trị dài, bấm "File cũ".
- Kết quả mong đợi: dòng "Hiển thị 1-20 trên N khóa học (20 dòng mỗi trang)"; trang chi tiết có đường dẫn "Khóa học / Chi tiết khóa học (quản trị)", hai tab (tab lịch sử có số dòng); hộp video "Bài 05 - <tên>" với "Độ dài mm:ss · N MB"; hộp trắc nghiệm có "Trắc nghiệm · N câu · M phút" và nhãn "Đáp án đúng"; khối "Lý do ẩn:" hoặc "Lý do gỡ:", "Học viên đã mua: vẫn học được" hoặc "không học được"; tab lịch sử có dòng "Mọi thay đổi của khóa học đều được ghi lại. Mới nhất ở trên.", ô trống "-", giá trị dài cắt kèm "…", "Hiển thị N trên M thay đổi"; giống các màn thiet_ke/quan_tri_khoa_hoc/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 19 mục 19.3, 19.4, 19.7, 19.10

## P19-14 Nút và hộp ẩn, gỡ
- Mục tiêu: nút theo trạng thái, hộp đúng chữ.
- Dữ liệu: khóa đang bán, tự ẩn, admin ẩn, bị gỡ.
- Các bước: mở từng khóa; bấm "Ẩn khóa học" và "Gỡ vĩnh viễn"; gửi khi trống lý do; gửi có lý do.
- Kết quả mong đợi: nút đúng bảng 19.4 (admin ẩn thì nút ẩn mờ; bị gỡ thì không có nút); hộp "Ẩn khóa học này?" với ô "Lý do ẩn *" và dòng "Người cung cấp sẽ nhìn thấy lý do này."; hộp "Gỡ vĩnh viễn khóa học này?" với ô "Lý do gỡ *"; trống báo "Vui lòng nhập lý do"; xong có "Đã ẩn khóa học" hoặc "Đã gỡ vĩnh viễn khóa học" và trang tải lại.
- Cách kiểm: Bấm tay
- Nguồn: Phần 19 mục 19.4, 19.5, 19.10
