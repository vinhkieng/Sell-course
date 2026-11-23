# PHẦN 20. QUẢN TRỊ - BÁO CÁO KHÓA HỌC VÀ BÁO CÁO ĐÁNH GIÁ

Làm sau Phần 19.

## 20.1 Mục đích và ai dùng
- Chỉ admin. Xem các mục bị báo cáo; mở xem là coi như đã xử lý "Không vi phạm"; thấy vi phạm thì ẩn hoặc gỡ khóa (ở trang chi tiết khóa) hoặc ẩn đánh giá (trong hộp chi tiết). Không có nút "Bỏ qua".

## 20.2 Màn thiết kế
- thiet_ke/quan_tri_bao_cao/bao_cao_khoa_hoc.html (màn "Quản trị - Báo cáo khóa học"): trang "Báo cáo khóa học".
- thiet_ke/quan_tri_bao_cao/bao_cao_danh_gia.html (màn "Quản trị - Báo cáo đánh giá"): trang "Báo cáo đánh giá", kèm hộp "Ẩn đánh giá này?".
- thiet_ke/quan_tri_bao_cao/bao_cao_danh_gia_hop_chi_tiet.html (màn "Quản trị - Báo cáo đánh giá (hộp chi tiết)"): hộp "Chi tiết đánh giá bị báo cáo".

## 20.3 Cách gom phiếu thành dòng (dùng cho cả hai trang)
- Trang "Báo cáo khóa học" gom phiếu theo từng mục bị báo cáo: một bài (id_bai_hoc), hoặc phần giới thiệu của một khóa (id_khoa_hoc). Trang "Báo cáo đánh giá" gom theo từng đánh giá (id_danh_gia).
- Trong một mục, các phiếu đang chờ (bien_phap_xu_ly NULL) gom thành một dòng "Chưa xử lý"; các phiếu đã xử lý gom thành dòng riêng theo từng kết quả. Vì vậy một mục có thể có một dòng chờ và một hoặc nhiều dòng đã xử lý (mỗi kết quả một dòng) cùng lúc.
- Mỗi dòng hiện lý do, ghi chú, ngày gửi của phiếu mới nhất trong dòng, và dòng nhỏ "N báo cáo" khi dòng có từ 2 phiếu trở lên. Dòng xếp theo ngày gửi của phiếu mới nhất, mới nhất ở trên (dòng chữ "Mới nhất ở trên").
- Ba lựa chọn lọc kèm số dòng: "Tất cả", "Chưa xử lý", "Đã xử lý". 20 dòng mỗi trang, dòng "Hiển thị 1-9 trên 9 mục bị báo cáo (20 dòng mỗi trang)" (đổi chữ theo bộ lọc như thiết kế).
- Số tròn ở menu: "Báo cáo khóa học" = số dòng "Chưa xử lý"; "Báo cáo đánh giá" = số đánh giá đang có phiếu chờ.

## 20.4 Trang "Báo cáo khóa học" (/quan-tri/bao-cao-khoa-hoc)
- Cột: Khóa học (tên hiện tại), Nội dung bị báo cáo ("Bài 05 - Tên bài" theo số thứ tự và tên hiện tại, bài đã bị người cung cấp xóa thì thêm "(đã xóa)"; hoặc "Phần giới thiệu khóa học"; kèm "N báo cáo"), Lý do, Ghi chú, Ngày gửi, Trạng thái ("Chưa xử lý", "Không vi phạm", "Đã ẩn khóa", "Đã gỡ vĩnh viễn"), Hành động.
- Hành động là liên kết "Mở khóa học". Khóa đã bị người cung cấp xóa thì thay bằng chữ "Khóa đã bị xóa", không bấm được.
- Bấm "Mở khóa học" ở dòng "Chưa xử lý": ngay lúc bấm, mọi phiếu đang chờ của mục đó chuyển 'Không vi phạm', id_quan_tri_vien = admin. Rồi mở /quan-tri/khoa-hoc/:id?muc=… (Phần 19). Không vi phạm thì admin không phải làm gì thêm.
- Bấm "Mở khóa học" ở dòng đã xử lý: chỉ mở trang chi tiết khóa kèm ?muc=…, không đổi phiếu. Admin đổi ý thì ẩn hoặc gỡ ở đó, phiếu của mục đổi theo (Phần 19 mục 19.6).
- Phiếu về một bài mà người cung cấp đã xóa vẫn xử lý như thường; admin xem file của bài đó qua "File cũ" ở tab lịch sử.

## 20.5 Trang "Báo cáo đánh giá" (/quan-tri/bao-cao-danh-gia)
- Cột: Khóa học, Người viết (tên đăng nhập), Nội dung đánh giá (nhận xét lúc bị báo cáo của phiếu mới nhất trong dòng; nhận xét trống thì hiện "N sao"; nội dung hiện tại khác bản lúc báo cáo thì thêm nhãn "Đã sửa sau khi bị báo cáo"), Lý do (lý do "Lý do khác" có ghi chú thì thêm dòng "Ghi chú: [ghi chú]"), Ngày gửi, Trạng thái ("Chưa xử lý", "Không vi phạm", "Đã ẩn đánh giá"), Hành động "Xem chi tiết".
- Bấm "Xem chi tiết" mở hộp "Chi tiết đánh giá bị báo cáo". Ngay lúc mở hộp, mọi phiếu đang chờ của đánh giá đó chuyển 'Không vi phạm', id_quan_tri_vien = admin; đánh giá vẫn hiện bình thường.
- Hộp chi tiết: Khóa học, Người viết, "Đánh giá hiện tại" (số sao, ngày viết, nhãn "Đã sửa sau khi bị báo cáo" nếu khác bản lúc báo cáo, nhận xét hiện tại), "Các báo cáo (N)" là bảng mọi phiếu của đánh giá (Người báo cáo là tên đăng nhập, Lý do, Ghi chú hoặc "-", Ngày gửi; phiếu nào có nội dung lúc báo cáo khác nội dung hiện tại thì thêm dòng "Nội dung lúc báo cáo: 1 sao - [nhận xét lúc báo cáo]"). Nút "Đóng" và "Ẩn đánh giá". Đánh giá đã bị ẩn thì không có nút "Ẩn đánh giá", thay bằng dòng "Đánh giá này đã bị ẩn.".
- Bấm "Ẩn đánh giá" mở hộp "Ẩn đánh giá này?": dòng "Đánh giá sẽ bị ẩn khỏi trang khóa học. Các báo cáo của đánh giá này sẽ chuyển sang kết quả Ẩn đánh giá.", ô "Lý do ẩn *" (bắt buộc, tối đa 255 ký tự, bỏ trống báo "Vui lòng nhập lý do"), dòng "Lý do chỉ để quản trị viên tra cứu lại, không hiển thị cho người dùng.", nút "Hủy" và "Ẩn đánh giá".
- Xác nhận ẩn, trong một giao dịch: danh_gia.bi_an = 1, ly_do_an, id_quan_tri_vien = admin; mọi phiếu của đánh giá đó (dù chờ hay đã 'Không vi phạm') đổi 'Ẩn đánh giá', id_quan_tri_vien = admin. Ô thông báo nhỏ "Đã ẩn đánh giá". Không có cách hiện lại.
- Đánh giá đã 'Không vi phạm' mà sau đó admin thấy vi phạm: vào lựa chọn "Đã xử lý", bấm "Xem chi tiết" rồi "Ẩn đánh giá".
- Admin không sửa nội dung đánh giá. Người viết không được thông báo.

## 20.6 Đường xử lý ở máy chủ (chỉ admin)
- GET /api/quan-tri/bao-cao-khoa-hoc?loc=tat-ca|chua-xu-ly|da-xu-ly&trang=: các dòng đã gom và số đếm.
- POST /api/quan-tri/bao-cao-khoa-hoc/mo: nhận { muc: { loai: "bai" | "gioi_thieu", id } }. Đổi phiếu chờ của mục thành 'Không vi phạm' (nếu có), trả id khóa.
- GET /api/quan-tri/bao-cao-danh-gia?loc=&trang=: các dòng đã gom và số đếm.
- POST /api/quan-tri/danh-gia/:id/xem-chi-tiet: đổi phiếu chờ thành 'Không vi phạm' rồi trả dữ liệu hộp chi tiết.
- POST /api/quan-tri/danh-gia/:id/an: nhận { ly_do }.
- Số tròn ở menu lấy từ GET /api/quan-tri/so-cho-xu-ly (Phần 1).

## 20.7 Bảng dữ liệu dùng
- bao_cao_khoa_hoc, bao_cao_danh_gia, danh_gia, khoa_hoc, bai_hoc, nguoi_dung, hoc_vien.

## 20.8 Câu thông báo
- "Mới nhất ở trên", "N báo cáo", "Khóa đã bị xóa", "Đã sửa sau khi bị báo cáo", "Nội dung lúc báo cáo: [nội dung lúc báo cáo]"
- "Ẩn đánh giá này?", "Đánh giá sẽ bị ẩn khỏi trang khóa học. Các báo cáo của đánh giá này sẽ chuyển sang kết quả Ẩn đánh giá.", "Lý do chỉ để quản trị viên tra cứu lại, không hiển thị cho người dùng.", "Vui lòng nhập lý do"
- "Đánh giá này đã bị ẩn.", "Đã ẩn đánh giá"

## 20.9 Kiểm tra khi làm xong
- Ba học viên báo cáo bài 05: trang có một dòng "3 báo cáo", menu hiện 1. Bấm "Mở khóa học": cả 3 phiếu thành "Không vi phạm", menu về 0.
- Từ dòng đó ẩn khóa: 3 phiếu thành "Đã ẩn khóa", các phiếu chờ khác của khóa cũng đổi theo.
- Mở khóa từ menu "Khóa học" rồi gỡ: phiếu đã "Không vi phạm" giữ nguyên, phiếu chờ thành "Đã gỡ vĩnh viễn".
- Người viết sửa đánh giá sau khi bị báo cáo: dòng có nhãn "Đã sửa sau khi bị báo cáo", hộp chi tiết có "Nội dung lúc báo cáo".
- Ẩn đánh giá: đánh giá biến khỏi trang khóa học, điểm trung bình tính lại, người viết thấy "Đánh giá này đã bị ẩn khỏi trang khóa học.".
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_20_quan_tri_bao_cao.md
