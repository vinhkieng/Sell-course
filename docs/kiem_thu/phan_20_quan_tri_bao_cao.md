# Danh sách kiểm thử Phần 20. Quản trị báo cáo khóa học và báo cáo đánh giá

- Đặc tả: docs/dac_ta/phan_20_quan_tri_bao_cao.md
- Code kiểm thử tự động: backend/tests/phan_20_quan_tri_bao_cao.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: admin; khóa K1 của "ncc01" có bài 05; học viên "hv1", "hv2", "hv3" đã mua K1; đánh giá D của "hvviet" ở K1.

## P20-01 Gom phiếu báo cáo khóa học thành dòng
- Mục tiêu: các phiếu chờ của một mục gom một dòng; đã xử lý tách dòng theo kết quả.
- Dữ liệu: hv1, hv2, hv3 báo cáo bài 05 (chờ); một phiếu cũ của bài 05 đã 'Không vi phạm'; hv1 báo cáo phần giới thiệu K1 (chờ).
- Các bước: gọi GET /api/quan-tri/bao-cao-khoa-hoc?loc=tat-ca.
- Kết quả mong đợi: bài 05 có một dòng "Chưa xử lý" với 3 báo cáo (lý do, ghi chú, ngày của phiếu mới nhất) và một dòng "Không vi phạm"; phần giới thiệu một dòng "Chưa xử lý"; dòng xếp theo ngày phiếu mới nhất; số đếm Tất cả 3, Chưa xử lý 2, Đã xử lý 1; 20 dòng mỗi trang.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.3, 20.6, 20.9

## P20-02 Số tròn ở menu
- Mục tiêu: đếm đúng.
- Dữ liệu: như P20-01; thêm 2 phiếu chờ cho đánh giá D và 1 phiếu chờ cho đánh giá E.
- Các bước: gọi GET /api/quan-tri/so-cho-xu-ly.
- Kết quả mong đợi: "Báo cáo khóa học" 2 (số dòng chưa xử lý); "Báo cáo đánh giá" 2 (số đánh giá có phiếu chờ).
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.3; Phần 1 mục 1.4

## P20-03 Mở khóa học từ dòng chưa xử lý
- Mục tiêu: phiếu chờ của mục đó thành 'Không vi phạm'.
- Dữ liệu: dòng bài 05 có 3 phiếu chờ.
- Các bước: gọi POST /api/quan-tri/bao-cao-khoa-hoc/mo với { muc: { loai "bai", id bài 05 } }.
- Kết quả mong đợi: trả id K1; 3 phiếu thành 'Không vi phạm', id_quan_tri_vien là admin; phiếu phần giới thiệu vẫn chờ; số tròn giảm 1.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.4, 20.6, 20.9

## P20-04 Mở từ dòng đã xử lý
- Mục tiêu: không đổi phiếu.
- Dữ liệu: dòng bài 05 đã 'Không vi phạm', không còn phiếu chờ.
- Các bước: gọi POST .../mo lần nữa.
- Kết quả mong đợi: trả id K1; không phiếu nào đổi.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.4

## P20-05 Đổi ý và ẩn khóa sau khi đã "Không vi phạm"
- Mục tiêu: ẩn kèm ?muc= thì phiếu của mục đổi theo; phiếu chờ khác của khóa cũng đổi.
- Dữ liệu: sau P20-03; phiếu phần giới thiệu vẫn chờ.
- Các bước: admin ẩn K1 với muc "bai-<bài 05>" (Phần 19).
- Kết quả mong đợi: 3 phiếu bài 05 thành 'Ẩn khóa'; phiếu phần giới thiệu thành 'Ẩn khóa'.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.4, 20.9; Phần 19 mục 19.6

## P20-06 Phiếu của bài đã xóa và khóa đã xóa
- Mục tiêu: hiện đúng chữ.
- Dữ liệu: phiếu chờ cho bài 07 đã bị người cung cấp xóa; phiếu của khóa K9 đã bị xóa.
- Các bước: gọi GET /api/quan-tri/bao-cao-khoa-hoc.
- Kết quả mong đợi: dòng bài 07 có cờ đã xóa (trang hiện "Bài 07 - <tên> (đã xóa)"); dòng K9 có cờ khóa đã bị xóa (trang hiện "Khóa đã bị xóa", không bấm được).
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.4

## P20-07 Gom phiếu báo cáo đánh giá và nhãn đã sửa
- Mục tiêu: gom theo đánh giá, phát hiện sửa sau khi báo cáo.
- Dữ liệu: hv1, hv2 báo cáo D lúc D là "1 sao - Tệ"; sau đó hvviet sửa D thành 3 sao.
- Các bước: gọi GET /api/quan-tri/bao-cao-danh-gia?loc=chua-xu-ly.
- Kết quả mong đợi: một dòng của D, 2 báo cáo, nội dung lúc bị báo cáo của phiếu mới nhất, cờ "Đã sửa sau khi bị báo cáo", người viết là tên đăng nhập.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.3, 20.5, 20.9

## P20-08 Xem chi tiết đánh giá
- Mục tiêu: mở hộp thì phiếu chờ thành 'Không vi phạm'; trả đủ dữ liệu.
- Dữ liệu: D có 2 phiếu chờ, 1 phiếu cũ 'Không vi phạm'.
- Các bước: gọi POST /api/quan-tri/danh-gia/<D>/xem-chi-tiet.
- Kết quả mong đợi: 2 phiếu chờ thành 'Không vi phạm', id_quan_tri_vien là admin; dữ liệu có khóa học, người viết, đánh giá hiện tại, danh sách 3 phiếu (người báo cáo là tên đăng nhập, lý do, ghi chú, ngày, nội dung lúc báo cáo khi khác hiện tại); D vẫn hiện công khai.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.5, 20.6

## P20-09 Ẩn đánh giá
- Mục tiêu: ẩn và đổi mọi phiếu của đánh giá.
- Dữ liệu: D có phiếu 'Không vi phạm' và phiếu chờ.
- Các bước: gọi POST /api/quan-tri/danh-gia/<D>/an với ly_do rỗng; với ly_do 256 ký tự; với ly_do "Ngôn từ xúc phạm".
- Kết quả mong đợi: rỗng báo "Vui lòng nhập lý do"; quá dài bị từ chối; lần đúng: danh_gia bi_an 1, ly_do_an, id_quan_tri_vien là admin; mọi phiếu của D thành 'Ẩn đánh giá'; D biến khỏi danh sách công khai, điểm trung bình tính lại.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.5, 20.9

## P20-10 Phân quyền
- Mục tiêu: chỉ admin.
- Dữ liệu: học viên, người cung cấp, khách.
- Các bước: gọi các đường của phần này.
- Kết quả mong đợi: học viên và người cung cấp 403; khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần 20 mục 20.6

## P20-11 Trang "Báo cáo khóa học"
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: như P20-01 và P20-06.
- Các bước: mở /quan-tri/bao-cao-khoa-hoc; đổi bộ lọc; bấm "Mở khóa học" ở dòng chưa xử lý.
- Kết quả mong đợi: cột Khóa học, Nội dung bị báo cáo ("Bài 05 - <tên>" kèm "3 báo cáo", hoặc "Phần giới thiệu khóa học"), Lý do, Ghi chú, Ngày gửi, Trạng thái, Hành động; dòng "Mới nhất ở trên"; "Hiển thị 1-N trên M mục bị báo cáo (20 dòng mỗi trang)"; bấm thì mở /quan-tri/khoa-hoc/<id>?muc=bai-<id>, dòng đổi "Không vi phạm", số tròn giảm; giống thiet_ke/quan_tri_bao_cao/bao_cao_khoa_hoc.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 20 mục 20.3, 20.4, 20.8

## P20-12 Trang "Báo cáo đánh giá" và hộp chi tiết
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: như P20-07.
- Các bước: mở /quan-tri/bao-cao-danh-gia; bấm "Xem chi tiết"; bấm "Ẩn đánh giá", gửi trống rồi gửi có lý do; mở lại chi tiết; học viên hvviet mở trang khóa.
- Kết quả mong đợi: cột Khóa học, Người viết, Nội dung đánh giá (nhận xét trống thì "N sao"), nhãn "Đã sửa sau khi bị báo cáo", Lý do (kèm "Ghi chú: …" khi "Lý do khác"), Ngày gửi, Trạng thái, "Xem chi tiết"; hộp "Chi tiết đánh giá bị báo cáo" có "Đánh giá hiện tại", "Các báo cáo (N)", "Nội dung lúc báo cáo: …", nút "Đóng" và "Ẩn đánh giá"; hộp "Ẩn đánh giá này?" đúng hai dòng chữ, trống báo "Vui lòng nhập lý do"; xong có "Đã ẩn đánh giá"; mở lại thì thấy "Đánh giá này đã bị ẩn." thay nút ẩn; hvviet thấy "Đánh giá này đã bị ẩn khỏi trang khóa học."; giống thiet_ke/quan_tri_bao_cao/bao_cao_danh_gia.html và bao_cao_danh_gia_hop_chi_tiet.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 20 mục 20.5, 20.8, 20.9
