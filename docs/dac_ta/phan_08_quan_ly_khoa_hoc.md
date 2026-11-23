# PHẦN 8. QUẢN LÝ KHÓA HỌC (NGƯỜI CUNG CẤP): SỬA, ẨN, ĐĂNG LẠI, XÓA

Làm sau Phần 7. Trang quản lý dùng lại các thành phần của trang tạo khóa (hai bước, trang thêm bài).

## 8.1 Mục đích và ai dùng
- Người cung cấp chủ khóa xem danh sách khóa của mình, sửa thông tin và bài học rồi đăng thay đổi, tự ẩn khóa, đăng lại khóa đang tự ẩn, xóa khóa chưa có người mua, sao chép link giới thiệu.

## 8.2 Màn thiết kế
- thiet_ke/ho_so/ho_so_nguoi_cung_cap.html (màn "Hồ sơ người cung cấp"): mục "Quản lý khóa học" trong hồ sơ (danh sách khóa, nút "Quản lý khóa học", "Sao chép link giới thiệu", "+ Tạo khóa học mới").
- thiet_ke/quan_ly_khoa_hoc/buoc_1_dang_ban.html (màn "Quản lý khóa - Bước 1 (đang bán)"): bước 1 khi khóa đang bán (có khối "Ẩn khóa học" và khối "Xóa khóa học").
- thiet_ke/quan_ly_khoa_hoc/buoc_1_admin_an.html (màn "Quản lý khóa - Bước 1 (admin ẩn)"): bước 1 khi khóa bị admin ẩn (hiện lý do, nút trong khối "Ẩn khóa học" mờ).
- thiet_ke/quan_ly_khoa_hoc/buoc_1_tu_an.html (màn "Quản lý khóa - Bước 1 (tự ẩn)"): bước 1 khi khóa đang tự ẩn (nút trong khối "Ẩn khóa học" đổi thành "Đăng").
- thiet_ke/quan_ly_khoa_hoc/buoc_1_hop_xoa_khoa.html (màn "Quản lý khóa - Bước 1 (hộp Xóa khóa)"): hộp "Xóa khóa học này?".
- thiet_ke/quan_ly_khoa_hoc/buoc_1_bi_go_chi_xem.html (màn "Quản lý khóa - Bước 1 (bị gỡ, chỉ xem)"): bước 1 khi khóa bị gỡ vĩnh viễn (chỉ xem, mọi nút mờ).
- thiet_ke/quan_ly_khoa_hoc/buoc_2_dang_ban.html (màn "Quản lý khóa - Bước 2 (đang bán)"): bước 2 khi khóa đang bán.
- thiet_ke/quan_ly_khoa_hoc/buoc_2_con_3_bai.html (màn "Quản lý khóa - Bước 2 (còn 3 bài)"): bước 2 khi còn đúng 3 bài (nút xóa bài mờ).
- thiet_ke/quan_ly_khoa_hoc/buoc_2_loi_bai_so_1.html (màn "Quản lý khóa - Bước 2 (lỗi bài số 1)"): bước 2 báo lỗi bài số 1, kèm hộp "Xóa bài học này?" có ô "Lý do xóa".
- thiet_ke/quan_ly_khoa_hoc/buoc_2_bi_go_chi_xem.html (màn "Quản lý khóa - Bước 2 (bị gỡ, chỉ xem)"): bước 2 khi khóa bị gỡ vĩnh viễn (chỉ xem).
- thiet_ke/quan_ly_khoa_hoc/sua_bai_doi_bai_hoc_thu.html (màn "Sửa bài (đổi bài học thử)"): trang "Sửa bài học" kèm cảnh báo đổi bài học thử.
- Trang thêm bài và các lỗi file dùng lại các màn ở thiet_ke/tao_khoa_hoc/.

## 8.3 Giao diện và hành vi
- Mục "Quản lý khóa học" ở hồ sơ: mỗi khóa chưa xóa của người cung cấp một thẻ (mới tạo ở trên) gồm tên, trạng thái theo chữ ở Phần chung C11, "N bài, giá", lý do nếu khóa bị admin ẩn, bị hệ thống ẩn hoặc bị gỡ ("Lý do: [lý do]"), nút "Quản lý khóa học", nút "Sao chép link giới thiệu". Chỉ khóa "Đang bán" mới sao chép được: bấm thì chép link <địa chỉ website>/khoa-hoc/<id>?ref=<mã giới thiệu của người cung cấp> và nút đổi thành "Đã sao chép" một lúc; khóa khác thì nút mờ kèm dòng "Chỉ khóa đang bán mới có link giới thiệu". Đầu mục có nút "+ Tạo khóa học mới" (Phần 7).
- Bấm "Quản lý khóa học" mở /nguoi-cung-cap/khoa-hoc/:id: hai bước như lúc tạo khóa, bước 1 điền sẵn thông tin hiện tại; dưới bước 1 có khối "Ẩn khóa học" và khối "Xóa khóa học".
- Sửa thông tin rồi bấm "Tiếp tục" sang bước 2. Ở bước 2: thêm bài, sửa bài (đổi tên, số thứ tự, thay file, hoặc sửa câu hỏi và thời gian của bài trắc nghiệm), xóa bài. "Lưu bài học" chỉ giữ tạm trong trang. Mọi thay đổi chỉ có hiệu lực khi bấm "Đăng" (kèm hộp cam kết như lúc tạo khóa). Thoát trang hoặc bấm "Hủy" trước khi "Đăng" thì khóa giữ nguyên, file tạm vừa tải bị xóa.
- Trang "Sửa bài học": như trang thêm bài, tiêu đề "Sửa bài học", điền sẵn nội dung hiện tại. Ô "Loại bài" bị mờ, chỉ hiện đúng phần của loại hiện tại (không đổi được loại bài; muốn đổi loại thì xóa bài rồi thêm bài mới). Bài video, tài liệu có nút thay file. Đổi số thứ tự làm thay đổi bài học thử thì hiện cảnh báo "Đổi số thứ tự này sẽ làm bài học thử đổi từ "[tên bài cũ]" sang "[tên bài mới]"."
- Xóa bài: hộp "Xóa bài học này?"; khóa đã có người mua thì có ô "Lý do xóa" bắt buộc; chưa có thì chỉ có "Xóa" và "Hủy". Còn đúng 3 bài thì nút xóa bài mờ kèm dòng "Khóa học cần ít nhất 3 bài. Hãy thêm bài mới trước khi xóa.".
- Khối "Ẩn khóa học" (dòng "Khóa sẽ không hiện trên trang bán. Học viên đã mua vẫn học bình thường. Bạn có thể đăng lại bất cứ lúc nào."):
  - Khóa đang bán: nút "Ẩn khóa học", bấm là ẩn ngay, không có hộp xác nhận.
  - Khóa đang tự ẩn: nút đổi thành "Đăng"; bấm thì mở hộp cam kết, tích rồi "Đăng" thì khóa về "Đang bán".
  - Khóa bị admin ẩn hoặc bị hệ thống ẩn: nút mờ; người cung cấp thấy lý do và sửa nội dung vi phạm rồi bấm "Đăng" ở bước 2 (khóa bị hệ thống ẩn do khóa tài khoản thì người cung cấp không đăng nhập được nên không gặp trường hợp này).
- Khối "Xóa khóa học" (dòng "Xóa vĩnh viễn khóa học và các bài học."): nút "Xóa khóa học" mở hộp "Xóa khóa học này?" ghi "Khóa học và toàn bộ bài học sẽ bị xóa vĩnh viễn, không thể hoàn tác." (không có ô lý do). Không đủ điều kiện thì nút mờ kèm một dòng: "Khóa đã có người mua chỉ được ẩn." hoặc "Khóa đang có đơn chờ thanh toán, vui lòng thử lại sau." hoặc "Khóa đang có báo cáo vi phạm chưa được xử lý, chưa xóa được.". Khối này vẫn hiện khi khóa đang bị ẩn. Xóa xong về /ho-so#quan-ly-khoa-hoc kèm ô thông báo nhỏ "Đã xóa khóa học".
- Khóa bị gỡ vĩnh viễn: chỉ xem thông tin và danh sách bài; không sửa, không đăng, không ẩn, không xóa (mọi nút mờ).

## 8.4 Quy tắc
- Khóa chỉ có ba trạng thái: "Đang bán", "Bị ẩn" (kèm bi_an_boi: 'Tự ẩn', 'Admin ẩn', 'Hệ thống - khóa tài khoản'), "Bị gỡ vĩnh viễn". Không có nháp, không có chờ duyệt.
- Kiểm tra bước 1 và các bài như Phần 7. Thêm: giá chỉ đổi được một lần mỗi 24 giờ, tính từ dòng lịch sử 'Đổi giá' gần nhất của khóa (chưa có thì đổi được). Giá mới áp dụng ngay khi đăng; đơn đã tạo trước đó giữ giá cũ. Trang kiểm tra trước để báo sớm, máy chủ kiểm tra lại lúc "Đăng".
- "Khóa đã có người mua" nghĩa là còn ít nhất một dòng chi_tiet_don_hang của khóa thuộc đơn 'Đã thanh toán' và da_hoan_tien = 0. Mọi lượt mua đều đã hoàn tiền thì coi như chưa có người mua.
- Lý do xóa bài (khi khóa đã có người mua) bắt buộc, tối đa 255 ký tự, ghi vào cột ghi_chu của dòng lịch sử 'Xóa bài'.
- Khóa luôn có từ 3 đến 50 bài; bài số 1 không phải trắc nghiệm (kiểm tra cả khi xóa bài và đổi số thứ tự).
- Đăng thay đổi, máy chủ áp dụng mọi thay đổi trong một giao dịch; học viên đã mua thấy ngay nội dung mới:
  - Khóa đang tự ẩn hoặc admin ẩn: "Đăng" vừa lưu thay đổi vừa đưa khóa về "Đang bán" (bi_an_boi, ly_do_an về trống), ghi thêm dòng lịch sử 'Người cung cấp đăng lại'. Không ai duyệt. Hệ thống không kiểm tra người cung cấp đã sửa gì.
  - Nếu trong lúc người cung cấp đang sửa mà khóa vừa bị admin ẩn hoặc gỡ vĩnh viễn: trang gửi kèm trạng thái khóa lúc mở trang (trang_thai và bi_an_boi); nếu lúc đăng khóa đang 'Admin ẩn' hoặc 'Bị gỡ vĩnh viễn' mà khác trạng thái lúc mở thì không lưu gì, trả 409 và trang báo "Khóa học vừa bị quản trị viên ẩn hoặc gỡ nên thay đổi chưa được lưu. Vui lòng xem lý do ở mục Quản lý khóa học."
  - Kiểm tra lại mã băm của các file mới như Phần 7.
- Thay file một bài: vẫn là bài đó (cùng id, tên, số thứ tự), chỉ file và thông tin file đổi. File mới qua đủ kiểm tra như lúc thêm. File cũ chuyển vào kho lưu trữ (luu_tru/kho_luu_tru, tên ngẫu nhiên mới), dòng lịch sử 'Thay file' có duong_dan_file_cu. Với bài video: học viên đã học xong bài đó vẫn tính là xong; học viên chưa xong thì đặt moc_luu_video = 0 và vi_tri_xem_cu = 0 trong tien_do_hoc.
- Xóa bài: bai_hoc.da_xoa = 1 (dữ liệu giữ lại), file chuyển vào kho lưu trữ, dòng lịch sử 'Xóa bài' có duong_dan_file_cu (bài trắc nghiệm không có file). Các bài sau dồn số thứ tự lên. Bài biến mất với mọi người kể cả học viên đã mua; tiến độ cả khóa tự tính lại theo số bài còn lại.
- Đổi ảnh bìa: ảnh cũ chuyển vào kho lưu trữ, dòng 'Đổi ảnh bìa' có duong_dan_file_cu.
- Sửa bài trắc nghiệm (câu hỏi, đáp án, thời gian): thay toàn bộ câu hỏi cũ bằng câu mới (không lưu đề cũ). Điểm cao nhất học viên đã có được giữ. Các lượt làm dở của bài đó: lượt đã hết giờ thì chấm theo đề cũ (cập nhật điểm cao nhất, đánh dấu học xong như Phần 15) rồi mới xóa lượt; lượt còn giờ thì xóa luôn (bị hủy). Việc chấm và xóa làm trước khi thay câu hỏi, trong cùng giao dịch. Lịch sử chỉ ghi một dòng 'Sửa bài'.
- Kho lưu trữ giữ mãi, không tính vào hạn mức 5GB, chỉ admin mở được (Phần 19).
- Tự ẩn: trang_thai = 'Bị ẩn', bi_an_boi = 'Tự ẩn', ly_do_an trống; lịch sử 'Người cung cấp ẩn'; không tính vào luật hai lần; không tạo thông báo. Đăng lại khóa tự ẩn: về 'Đang bán', lịch sử 'Người cung cấp đăng lại'.
- Điều kiện xóa khóa (máy chủ kiểm tra lại lúc xóa): khóa chưa có người mua; không có đơn nào đang 'Chờ thanh toán', 'Hết hạn' hoặc 'Thất bại' chứa khóa mà được tạo trong 24 giờ qua (vì các đơn này vẫn có thể được hoàn tất khi kết quả thanh toán thành công đến muộn hoặc khi học viên bấm "Kiểm tra lại thanh toán"); khóa không còn phiếu báo cáo khóa học chưa xử lý (phiếu về phần giới thiệu khóa hoặc về bất kỳ bài nào của khóa, bien_phap_xu_ly trống).
- Xóa khóa, trong một giao dịch: khoa_hoc.da_xoa = 1, mọi bài da_xoa = 1, xóa khóa khỏi giỏ hàng của mọi học viên (bảng gio_hang), ghi lịch sử 'Người cung cấp xóa khóa học'. Sau khi giao dịch xong thì xóa hẳn file video, PDF đang dùng và ảnh bìa hiện tại của khóa khỏi máy chủ; kho lưu trữ giữ nguyên. Khóa biến mất khỏi mọi nơi, mở link thì 404; đơn cũ vẫn hiện đúng tên khóa vì tên đã chụp trong chi_tiet_don_hang.
- Lịch sử ghi mọi thay đổi, mỗi thay đổi một dòng (Phần chung C15): 'Sửa thông tin khóa' (mỗi ô đổi một dòng, noi_dung_thay_doi dạng "Sửa thông tin khóa - Mô tả", gia_tri_cu, gia_tri_moi), 'Đổi giá', 'Đổi ảnh bìa', 'Đổi danh mục' (gồm cả khi chọn "Khác" tạo danh mục mới), 'Thêm bài', 'Sửa bài' (đổi tên bài, sửa trắc nghiệm), 'Thay file', 'Đổi thứ tự bài' (gia_tri_cu và gia_tri_moi là số thứ tự; chỉ ghi cho bài người cung cấp chủ động đổi số, không ghi cho các bài tự dời theo), 'Xóa bài' (noi_dung_thay_doi dạng "Xóa bài - Bài 07 Bảng màu cơ bản"). Các dòng 'Thêm bài', 'Sửa bài', 'Thay file', 'Đổi thứ tự bài' cũng ghi noi_dung_thay_doi dạng "<hành động> - Bài <số 2 chữ số> <tên bài>" (ví dụ "Thay file - Bài 05 CSS: màu sắc và bố cục"); 'Thay file' thì gia_tri_cu và gia_tri_moi là tên file cũ và mới; 'Thêm bài' thì gia_tri_moi là tên bài; 'Sửa bài' đổi tên thì là tên cũ và tên mới. Người cung cấp không xem được lịch sử.
- Khóa bị gỡ vĩnh viễn: máy chủ từ chối mọi thao tác sửa, đăng, ẩn, xóa.

## 8.5 Đường xử lý ở máy chủ (chỉ người cung cấp chủ khóa; khóa của người khác hoặc đã xóa trả 404)
- GET /api/nguoi-cung-cap/khoa-hoc: danh sách khóa chưa xóa của mình cho mục "Quản lý khóa học" (tên, trạng thái, bi_an_boi, ly_do_an, số bài chưa xóa, giá, link giới thiệu nếu đang bán), kèm co_du_ho_so (đủ họ tên và số điện thoại chưa).
- GET /api/nguoi-cung-cap/khoa-hoc/:id: toàn bộ thông tin khóa, các bài chưa xóa theo số thứ tự (bài trắc nghiệm kèm câu hỏi và đáp án), co_nguoi_mua, co_don_chua_thanh_toan_24h, co_bao_cao_chua_xu_ly, co_the_doi_gia (và thời điểm được đổi giá lại nếu chưa), trạng thái lúc này.
- PUT /api/nguoi-cung-cap/khoa-hoc/:id (Đăng thay đổi): nhận thong_tin như Phần 7; bai_hoc là danh sách mong muốn sau khi sửa, mỗi bài có id (bài cũ) hoặc không có id (bài mới), ten_bai_hoc, so_thu_tu, loai, ma_file_tam (bài mới hoặc bài thay file), thoi_gian_lam_bai, cau_hoi; danh sách bai_xoa [ { id, ly_do_xoa } ]; trang_thai_luc_mo { trang_thai, bi_an_boi }; cam_ket = true. Máy chủ so với dữ liệu hiện tại để biết đổi gì, áp dụng và ghi lịch sử theo 8.4. Giống đường đăng khóa ở Phần 7, đường này nhận dữ liệu gửi lên tới 20MB và kiểm giới hạn 10.000 ký tự của bốn ô Mô tả, Bạn sẽ học được gì, Yêu cầu trước khi học, Dành cho ai.
- POST /api/nguoi-cung-cap/khoa-hoc/:id/an: chỉ khi 'Đang bán'.
- POST /api/nguoi-cung-cap/khoa-hoc/:id/dang-lai: nhận cam_ket = true; chỉ khi 'Tự ẩn'.
- DELETE /api/nguoi-cung-cap/khoa-hoc/:id: kiểm tra điều kiện xóa; không đủ trả 409 kèm câu tương ứng.
- File tạm dùng lại POST và DELETE /api/nguoi-cung-cap/file-tam của Phần 7 (gửi id_bai_hoc_dang_thay khi thay file).

## 8.6 Bảng dữ liệu dùng
- khoa_hoc, bai_hoc, cau_hoi_bai_tap, danh_muc như Phần 7.
- lich_su_khoa_hoc: mọi dòng thay đổi (mục 8.4).
- chi_tiet_don_hang (id_khoa_hoc, da_hoan_tien) và don_hang (trang_thai, ngay_tao): xét có người mua, có đơn chưa thanh toán trong 24 giờ.
- bao_cao_khoa_hoc (id_khoa_hoc, id_bai_hoc, bien_phap_xu_ly): xét còn phiếu chưa xử lý.
- gio_hang: xóa khóa khỏi giỏ khi xóa khóa.
- tien_do_hoc (moc_luu_video, vi_tri_xem_cu, da_hoc_xong, diem_cao_nhat) và luot_lam_bai: khi thay video và khi sửa bài trắc nghiệm.

## 8.7 Câu thông báo
- Mọi câu của Phần 7 mục 7.7.
- "Giá chỉ được đổi 1 lần mỗi 24 giờ."
- "Khóa học cần ít nhất 3 bài. Hãy thêm bài mới trước khi xóa."
- "Bài số 1 phải là bài video hoặc tài liệu."
- "Vui lòng nhập lý do"
- "File giống hệt file hiện tại"
- "Đổi số thứ tự này sẽ làm bài học thử đổi từ "[tên bài cũ]" sang "[tên bài mới]"."
- "Khóa đã có người mua chỉ được ẩn.", "Khóa đang có đơn chờ thanh toán, vui lòng thử lại sau.", "Khóa đang có báo cáo vi phạm chưa được xử lý, chưa xóa được."
- "Khóa học vừa bị quản trị viên ẩn hoặc gỡ nên thay đổi chưa được lưu. Vui lòng xem lý do ở mục Quản lý khóa học."
- "Chỉ khóa đang bán mới có link giới thiệu", "Đã sao chép"
- Thành công: "Đã đăng thay đổi", "Đã ẩn khóa học", "Đã đăng lại khóa học", "Đã xóa khóa học".

## 8.8 Kiểm tra khi làm xong
- Đổi giá hai lần trong 24 giờ: lần hai bị báo lỗi kể cả khi gọi thẳng API.
- Thay video của bài 3: học viên đã xem xong bài 3 vẫn tính xong; học viên đang xem dở thì vị trí về 0; kho lưu trữ có file cũ và lịch sử có dòng 'Thay file'.
- Khóa có người mua: xóa bài bắt buộc lý do; xóa khóa bị chặn với câu "Khóa đã có người mua chỉ được ẩn.".
- Khóa có một phiếu báo cáo chưa xử lý: nút xóa khóa mờ.
- Mở trang sửa, trong lúc đó dùng tài khoản admin ẩn khóa, quay lại bấm "Đăng": bị báo và không có gì thay đổi.
- Tự ẩn rồi đăng lại: lịch sử có hai dòng, số lần ẩn dùng cho luật hai lần vẫn bằng 0.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_08_quan_ly_khoa_hoc.md
