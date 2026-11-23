# PHẦN 11. CHI TIẾT KHÓA HỌC VÀ LINK GIỚI THIỆU

Làm sau Phần 10. Phần đánh giá và báo cáo trên trang này làm ở Phần 16; khung mua hàng nối với giỏ hàng ở Phần 12.

## 11.1 Mục đích và ai dùng
- Mọi người xem trang chi tiết một khóa. Khung mua hàng, danh sách bài và khối chia sẻ thay đổi theo người xem.

## 11.2 Màn thiết kế
- thiet_ke/chi_tiet_khoa_hoc/chua_dang_nhap.html (màn "Chi tiết khóa học (chưa đăng nhập)"): khách chưa đăng nhập.
- thiet_ke/chi_tiet_khoa_hoc/da_dang_nhap_chua_mua.html (màn "Chi tiết khóa học (đã đăng nhập)"): học viên chưa mua (có dòng nhắc "Bạn cần mua khóa học này để xem bài học" khi bấm bài không phải bài học thử).
- thiet_ke/chi_tiet_khoa_hoc/da_co_trong_gio.html (màn "Chi tiết khóa học (đã có trong giỏ)"): học viên chưa mua, khóa đã có trong giỏ.
- thiet_ke/chi_tiet_khoa_hoc/da_mua.html (màn "Chi tiết khóa học (đã mua)"): học viên đã mua (thẻ "Đã sở hữu", tiến độ, nút "Vào học", nhãn "Đã học" cạnh bài).
- thiet_ke/chi_tiet_khoa_hoc/da_mua_chua_hoc_xong_bai_nao.html (màn "Chi tiết khóa học - Đã mua (chưa học xong bài nào)"): học viên đã mua nhưng chưa học xong bài nào.
- thiet_ke/chi_tiet_khoa_hoc/nguoi_cung_cap_khac_xem.html (màn "Chi tiết khóa - Người cung cấp khác xem"): người cung cấp khác xem.
- thiet_ke/chi_tiet_khoa_hoc/chu_khoa_hoac_admin_xem.html (màn "Chi tiết khóa - Chủ khóa / Quản trị viên xem"): chủ khóa hoặc admin xem.
- thiet_ke/chi_tiet_khoa_hoc/chu_khoa_xem_bai_trac_nghiem.html (màn "Chi tiết khóa - Chủ khóa xem bài trắc nghiệm"): chủ khóa (hoặc admin) bấm bài trắc nghiệm thì mở hộp xem câu hỏi và đáp án đúng.

## 11.3 Giao diện và hành vi
- Phần thông tin: đường dẫn "Trang chủ / Danh mục / Tên khóa", tên danh mục, tên khóa, mô tả ngắn (đoạn đầu của mô tả), "N bài học", "Người cung cấp: họ tên", "N học viên", điểm trung bình và số lượt đánh giá; "Bạn sẽ học được gì", "Mô tả khóa học", "Nội dung khóa học" (danh sách mọi bài chưa xóa, đủ cả, không rút gọn), "Yêu cầu trước khi học", "Khóa học dành cho ai" (ba khối này mỗi dòng của ô dữ liệu là một ý; ô trống thì ẩn cả khối).
- Mỗi dòng bài: số thứ tự hai chữ số, tên bài, loại (Video kèm thời lượng, Tài liệu, hoặc nhãn trắc nghiệm "Trắc nghiệm, N câu, M phút"; học viên đã làm thì thêm điểm cao nhất ở đầu "8,00/10, trắc nghiệm, N câu, M phút"). Bài số 1 có nhãn "Học thử miễn phí"; nút "Xem thử" chỉ hiện với người chưa có quyền học. Chủ khóa và admin không có nhãn và nút này. Học viên đã mua thấy nhãn "Đã học" ở bài đã học xong.
- Bấm một bài:
  - Bài học thử: mọi người mở được (trang học, Phần 14), kể cả khách.
  - Học viên có quyền học, chủ khóa, admin: mở đúng bài đó (chủ khóa và admin bấm bài trắc nghiệm thì mở hộp xem câu hỏi kèm nhãn "Đáp án đúng" và nút "Đóng", không làm bài được, không thấy điểm học viên).
  - Khách: bài không mở, hiện dòng nhắc "Vui lòng đăng nhập và mua khóa học để xem bài học này" ngay dưới dòng bài, kèm nút "Đăng nhập" (mở /dang-nhap?quay_lai=<trang này>) và nút ✕ để đóng.
  - Học viên chưa có quyền học: dòng nhắc "Bạn cần mua khóa học này để xem bài học" kèm nút ✕. Người cung cấp khác bấm bài thì dòng nhắc là "Bạn không thể xem nội dung khóa học của người cung cấp khác". Việc chặn thật nằm ở máy chủ (Phần 14).
- Khung mua hàng bên phải:
  - Khách và học viên chưa mua: giá, nút "Mua ngay", nút "Thêm vào giỏ hàng" (khóa đã có trong giỏ thì nút đổi thành "Đã có trong giỏ - Xem giỏ hàng" mở /gio-hang), các dòng "Học thử miễn phí bài đầu tiên", "Học mãi mãi sau khi mua", "N bài học", "Tiến độ học tự động cập nhật". Hành vi hai nút ở Phần 12.
  - Học viên có quyền học: thẻ "Đã sở hữu", "Đã học x/y bài", thanh tiến độ và phần trăm, nút "Vào học" (Phần 14).
  - Người cung cấp và admin: giá và dòng "Tài khoản người cung cấp và quản trị viên không thể mua khóa học.", không có nút mua.
- Khối "Chia sẻ khóa học" (chỉ khi khóa 'Đang bán'): ô chứa link và nút "Sao chép link" (bấm thì đổi thành "Đã sao chép" một lúc). Khách: link thường <địa chỉ website>/khoa-hoc/<id>. Học viên và người cung cấp khác: link kèm mã giới thiệu của chính người đang xem <địa chỉ website>/khoa-hoc/<id>?ref=<mã>. Chủ khóa và admin không có khối này (chủ khóa lấy link ở hồ sơ, Phần 8).
- Khối "Khóa học cùng danh mục": 4 khóa 'Đang bán' cùng danh mục, trừ khóa đang xem, nhiều học viên nhất. Không có khóa nào thì ẩn khối.
- Tên trang trình duyệt là tên khóa.

## 11.4 Ai xem được trang chi tiết (máy chủ kiểm tra)
- Khóa 'Đang bán' (người cung cấp không bị khóa): mọi người.
- Khóa 'Bị ẩn': chủ khóa, admin, học viên có quyền học. Người khác: 404.
- Khóa 'Bị gỡ vĩnh viễn': admin và chủ khóa (chỉ xem); học viên đã mua thấy trang "Khóa học không khả dụng" (màn thiet_ke/trang_hoc/khoa_hoc_khong_kha_dung.html); người khác 404.
- Khóa của người cung cấp đang bị khóa tài khoản: học viên đã mua thấy trang "Khóa học không khả dụng"; admin xem được; người khác 404.
- Khóa đã bị người cung cấp xóa: không ai xem được (404), kể cả admin ở trang công khai.

## 11.5 Ghi nhớ link giới thiệu
- Khi có người mở trang khóa bằng link có ?ref=<mã> và lần mở đó là tải trang mới từ ngoài vào (không phải bấm chuyển trang bên trong website; document.referrer không thuộc địa chỉ website), trang gọi POST /api/gioi-thieu với id khóa và mã.
- Máy chủ kiểm tra mã có thuộc một tài khoản không (không có thì bỏ qua) rồi ghi vào một cookie có chữ ký tên ava_gioi_thieu (httpOnly, hạn 24 giờ tính từ lần ghi gần nhất). Cookie lưu riêng cho từng khóa: id khóa, mã giới thiệu, thời điểm bấm. Ghi nhớ còn nguyên khi người đó đăng ký hay đăng nhập giữa chừng trong cùng trình duyệt.
- Luật ghi đè cho cùng một khóa: link của chính chủ khóa luôn ghi đè; link của người khác chỉ ghi đè khi chưa có ghi nhớ hoặc ghi nhớ đang có không phải của chủ khóa hoặc đã quá 24 giờ.
- Bấm link từ chính trong AVA (ví dụ link dán trong mô tả khóa) thì không tính giới thiệu. Người chia sẻ không phải chủ khóa không nhận khoản tiền nào.
- Việc dùng ghi nhớ này để chốt nguồn bán và mức chia ở Phần 13 mục 13.4.

## 11.6 Đường xử lý ở máy chủ
- GET /api/khoa-hoc/:id: kiểm tra quyền xem theo 11.4 (trả 404, hoặc trả { khong_kha_dung: true } cho học viên đã mua khóa bị gỡ hay khóa của người cung cấp bị khóa). Trả thông tin khóa, danh sách bài chưa xóa (không có đường dẫn file), vai trò người xem đối với khóa (khách, học viên chưa mua, học viên có quyền học, chủ khóa, người cung cấp khác, admin), khóa có trong giỏ chưa, tiến độ (nếu có quyền học: bài đã học xong, điểm cao nhất bài trắc nghiệm, số bài xong, phần trăm), link chia sẻ theo 11.3, điểm trung bình, phân bố sao, 3 đánh giá đầu, 4 khóa cùng danh mục.
- POST /api/gioi-thieu: nhận id_khoa_hoc, ma. Ghi cookie theo 11.5. Không cần đăng nhập. Luôn trả 200.
- GET /api/khoa-hoc/:id/bai/:idBai/trac-nghiem-xem (chỉ chủ khóa và admin): câu hỏi kèm đáp án đúng cho hộp xem bài trắc nghiệm.

## 11.7 Bảng dữ liệu dùng
- khoa_hoc, bai_hoc, cau_hoi_bai_tap, danh_muc, nguoi_dung, nguoi_cung_cap, gio_hang, don_hang, chi_tiet_don_hang, tien_do_hoc, danh_gia.

## 11.8 Câu thông báo
- "Vui lòng đăng nhập và mua khóa học để xem bài học này" (khách)
- "Bạn cần mua khóa học này để xem bài học"
- "Bạn không thể xem nội dung khóa học của người cung cấp khác"
- "Tài khoản người cung cấp và quản trị viên không thể mua khóa học."
- "Đã sao chép"

## 11.9 Kiểm tra khi làm xong
- Mở cùng một khóa bằng tài khoản khách, học viên chưa mua, học viên đã mua, người cung cấp khác, chủ khóa, admin: khung mua, khối chia sẻ, hành vi bấm bài đúng như 11.3.
- Khóa bị ẩn: học viên chưa mua mở link thì 404, học viên đã mua vẫn xem.
- Mở /khoa-hoc/12?ref=<mã của chủ khóa> từ một thẻ trình duyệt mới: cookie ava_gioi_thieu có mục cho khóa 12. Sau đó mở link của một học viên khác cho cùng khóa trong 24 giờ: ghi nhớ vẫn là mã chủ khóa.
- Học viên gọi thẳng API xem câu hỏi trắc nghiệm của khóa người khác: bị từ chối.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_11_chi_tiet_khoa_hoc.md
