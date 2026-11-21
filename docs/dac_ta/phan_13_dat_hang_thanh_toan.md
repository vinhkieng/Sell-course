# PHẦN 13. ĐẶT HÀNG, THANH TOÁN QUA CỔNG THANH TOÁN, LỊCH SỬ VÀ CHI TIẾT ĐƠN HÀNG

Làm sau Phần 12. Phần này gồm: trang Thông tin đơn hàng, tạo đơn, chuyển sang VNPay, nhận và kiểm tra kết quả, ba trang kết quả, mục "Lịch sử đơn hàng" trong hồ sơ học viên, trang chi tiết đơn của học viên và nút "Kiểm tra lại thanh toán". Trang chi tiết đơn của admin và nút "Hoàn tiền" ở Phần 22.

## 13.1 Mục đích và ai dùng
- Học viên đã đăng nhập. Khách bấm "Mua" hoặc "Mua ngay" thì phải đăng nhập trước (Phần 12). Người cung cấp và admin mở các trang này thì gặp trang 403.
- Việc kiểm tra kết quả thanh toán và hoàn tất đơn do máy chủ tự làm khi nhận kết quả.

## 13.2 Màn thiết kế
- thiet_ke/dat_hang_thanh_toan/thong_tin_don_hang.html (màn "Thông tin đơn hàng"): trang Thông tin đơn hàng.
- thiet_ke/dat_hang_thanh_toan/thong_tin_don_hang_thieu_ho_so.html (màn "Thông tin đơn hàng (hồ sơ thiếu thông tin)"): hồ sơ còn thiếu họ tên hoặc số điện thoại (dải báo, nút "Cập nhật hồ sơ", nút "Thanh toán" mờ).
- thiet_ke/dat_hang_thanh_toan/trang_vnpay_minh_hoa_khong_lam.html (màn "Trang thanh toán VNPay (minh họa)"): trang của VNPay, chỉ để biết học viên sẽ thấy gì. AVA không làm trang này.
- thiet_ke/dat_hang_thanh_toan/thanh_toan_thanh_cong.html (màn "Kết quả thanh toán - Thành công"): trang "Thanh toán thành công".
- thiet_ke/dat_hang_thanh_toan/thanh_toan_that_bai.html (màn "Kết quả thanh toán - Thất bại"): trang "Thanh toán không thành công".
- thiet_ke/dat_hang_thanh_toan/don_hang_het_han.html (màn "Đơn hàng đã hết hạn"): trang "Đơn hàng đã hết hạn".
- thiet_ke/dat_hang_thanh_toan/chi_tiet_don_hang.html (màn "Chi tiết đơn hàng (học viên)"): chi tiết đơn đã thanh toán (có khóa đã hoàn tiền).
- thiet_ke/dat_hang_thanh_toan/chi_tiet_don_hang_chua_thanh_toan.html (màn "Chi tiết đơn hàng (học viên - chưa thanh toán)"): chi tiết đơn chưa thanh toán.
- thiet_ke/ho_so/ho_so_hoc_vien.html (màn "Hồ sơ - Học viên"): mục "Lịch sử đơn hàng" ở cuối hồ sơ học viên.
- thiet_ke/dat_hang_thanh_toan/kiem_tra_lai_dang_kiem_tra.html (màn "Hồ sơ - Học viên (đang kiểm tra lại thanh toán)"): đang kiểm tra lại với VNPay.
- thiet_ke/dat_hang_thanh_toan/kiem_tra_lai_chua_ghi_nhan.html (màn "Hồ sơ - Học viên (VNPay chưa ghi nhận thanh toán)"): VNPay chưa ghi nhận thanh toán.
- thiet_ke/dat_hang_thanh_toan/kiem_tra_lai_loi_ket_noi.html (màn "Hồ sơ - Học viên (lỗi kết nối VNPay)"): không kết nối được với VNPay.

## 13.3 Trang Thông tin đơn hàng
- Đường dẫn: /thong-tin-don-hang?khoa=3,8 (đi từ nút "Mua" ở giỏ, danh sách id các khóa đã tích) hoặc /thong-tin-don-hang?mua_ngay=12 (đi từ "Mua ngay"). Trang này không ghi gì vào cơ sở dữ liệu, đơn chưa được tạo.
- Đường dẫn trên cùng: "Trang chủ / Giỏ hàng / Thông tin đơn hàng" (đi từ "Mua ngay" thì thay "Giỏ hàng" bằng tên khóa).
- Khung "Thông tin người đặt": dòng "Lấy từ hồ sơ của bạn." và liên kết "Cập nhật hồ sơ" (mở /ho-so#thong-tin-ca-nhan); họ và tên, Gmail, số điện thoại lấy từ hồ sơ, chỉ để xem; dòng "Gmail và số điện thoại dùng để quản trị viên liên hệ khi đơn hàng có sự cố."; ô "Ghi chú (không bắt buộc)" nhiều dòng, đếm "0/500 ký tự", không cho gõ quá 500 ký tự.
- Hồ sơ thiếu họ tên hoặc số điện thoại: dải "Hồ sơ của bạn còn thiếu họ tên hoặc số điện thoại. Vui lòng cập nhật hồ sơ để thanh toán.", nút "Cập nhật hồ sơ", nút "Thanh toán" mờ. Máy chủ cũng chặn.
- Khung "Đơn hàng của bạn": tên và giá bán hiện tại của từng khóa, "Tổng tiền", nút "Thanh toán", dòng "Thanh toán an toàn qua VNPay" và "Bạn có 30 phút để hoàn tất thanh toán sau khi bấm nút này" (chữ "VNPay" lấy từ cong_thanh_toan.ten).
- Lúc mở trang, khóa nào không mua được (không còn bán, đã xóa, đã sở hữu) thì bị bỏ ra ngay và hiện câu báo như ở 13.4. Không còn khóa nào mua được thì quay về /gio-hang (đi từ giỏ) hoặc /khoa-hoc/:id (đi từ "Mua ngay") kèm ô thông báo nhỏ "Các khóa bạn chọn không còn mua được.".

## 13.4 Bấm "Thanh toán": kiểm tra lại và tạo đơn
- Trang gửi lên: danh sách id khóa, giá mỗi khóa mà học viên đang thấy, ghi chú, và nơi đi tới (giỏ hay mua ngay).
- Máy chủ kiểm tra lại từng khóa: khóa 'Đang bán', chưa xóa, người cung cấp không bị khóa, học viên chưa có quyền học khóa đó, giá bán hiện tại bằng giá học viên đang thấy. Kiểm tra lại hồ sơ có đủ họ tên và số điện thoại.
- Có khóa thay đổi thì chưa tạo đơn, trả 409 kèm danh sách mới. Trang ở lại, hiện:
  - Dải vàng đầu khung "Đơn hàng của bạn": "Đơn hàng có thay đổi, vui lòng xem lại trước khi thanh toán."
  - Dưới khóa đổi giá: "Giá đã đổi từ 299.000đ thành 349.000đ." (giá mới thay vào, tổng tiền tính lại).
  - Khóa bị bỏ: "Khóa “Tên khóa” không còn bán nên đã được bỏ khỏi đơn." hoặc "Bạn đã sở hữu khóa “Tên khóa” nên khóa này đã được bỏ khỏi đơn.".
  - Học viên xem lại rồi bấm "Thanh toán" lần nữa. Không còn khóa nào thì quay về như 13.3.
- Hợp lệ thì làm trong một giao dịch cơ sở dữ liệu:
  - Đơn 'Chờ thanh toán' cũ của học viên (nếu có) chuyển 'Hết hạn' (mỗi học viên chỉ có một đơn đang chờ, cột hoc_vien_dang_cho_thanh_toan có ràng buộc không trùng sẽ chặn nếu quên bước này).
  - Thêm don_hang: id_hoc_vien, id_cong_thanh_toan = 1, tong_tien = tổng giá bán hiện tại, trang_thai 'Chờ thanh toán', ghi_chu (bỏ trắng thì để NULL), ngay_gui_cong_thanh_toan = NOW().
  - Mỗi khóa một dòng chi_tiet_don_hang: ten_khoa_hoc và gia chụp lại lúc này, nguon_ban và ti_le_chia chốt theo link giới thiệu (bên dưới).
- Chốt nguồn bán và mức chia cho từng khóa (đọc cookie ava_gioi_thieu ở Phần 11 mục 11.5):
  - Có ghi nhớ cho khóa đó, còn trong 24 giờ, mã là của chủ khóa: 'Giới thiệu', ti_le_chia 90.
  - Có ghi nhớ còn trong 24 giờ, mã là của người khác (không phải chủ khóa, không phải chính người mua): 'Học viên giới thiệu', 60.
  - Không có ghi nhớ, đã quá 24 giờ, hoặc mã là của chính người mua: 'Tự nhiên', 60.
  - Mốc thời gian trong cookie ghi bằng giờ của MySQL (lấy NOW() lúc ghi) để so cùng một nguồn giờ. Nguồn và mức chia chốt ngay lúc tạo đơn, không đổi sau đó. Mỗi khóa trong đơn xét riêng.
- Tạo xong đơn thì máy chủ dựng đường dẫn thanh toán VNPay (13.5) và trả về; trang chuyển trình duyệt sang đường dẫn đó.
- Không gửi sang VNPay họ tên, Gmail, số điện thoại, ghi chú.

## 13.5 Kết nối VNPay (môi trường thử sandbox, phiên bản 2.1.0)
- Claude Code đối chiếu tài liệu chính thức của VNPay khi viết phần này. Các biến trong backend/.env: VNP_TMN_CODE, VNP_HASH_SECRET, VNP_URL (trang thanh toán sandbox), VNP_API_URL (đường tra cứu giao dịch). Không có biến riêng cho đường quay về: máy chủ tự ghép CLIENT_ORIGIN + "/thanh-toan/ket-qua" để làm vnp_ReturnUrl, nên khi thử bằng điện thoại chỉ cần đổi CLIENT_ORIGIN.
- Trong backend/.env còn thiếu dòng cấu hình VNPay nào mà học viên bấm tới chức năng dùng VNPay ("Thanh toán" hoặc "Kiểm tra lại thanh toán") thì máy chủ báo lỗi nói rõ đang thiếu dòng nào. Khi chạy kiểm thử thì dùng VNPay giả, không gọi tới VNPay thật.
- Tham số gửi đi: vnp_Version 2.1.0; vnp_Command pay; vnp_TmnCode; vnp_Amount = tong_tien nhân 100; vnp_CurrCode VND; vnp_TxnRef = mã đơn dạng AVA-yymmdd-nnnn (Phần chung C10); vnp_OrderInfo = "Thanh toan don hang " + mã đơn (không dấu); vnp_OrderType other; vnp_Locale vn; vnp_ReturnUrl = CLIENT_ORIGIN + "/thanh-toan/ket-qua"; vnp_IpAddr = địa chỉ IP của học viên đã chuẩn hóa; vnp_CreateDate = ngay_gui_cong_thanh_toan dạng yyyyMMddHHmmss; vnp_ExpireDate = ngay_tao cộng 30 phút, cùng dạng.
- Chữ ký: xếp các tham số theo tên tăng dần, nối thành chuỗi tên=giá_trị&… (giá trị mã hóa như hướng dẫn của VNPay, dấu cách thành +), tính HMAC SHA512 bằng VNP_HASH_SECRET, gửi kèm vnp_SecureHash. Khi nhận kết quả thì bỏ vnp_SecureHash và vnp_SecureHashType ra, tính lại theo cùng cách rồi so.
- Thanh toán thành công khi vnp_ResponseCode = '00' và vnp_TransactionStatus = '00'.
- Khi chạy trên máy cá nhân, máy chủ VNPay không gọi tới được đường IPN (localhost không nhận được kết nối từ ngoài vào). Luồng trình duyệt quay về và nút "Kiểm tra lại thanh toán" vẫn đủ để chạy thử. Muốn thử IPN thì dùng một công cụ mở đường từ ngoài vào máy (ví dụ ngrok) và khai đường IPN trong trang quản lý sandbox của VNPay.

## 13.6 Nhận kết quả và kiểm tra (dùng chung cho cả ba đường)
- Ba đường kết quả về AVA: trình duyệt quay về (nguon_den 'Trình duyệt'), máy chủ VNPay gọi IPN ('Máy chủ cổng thanh toán'), máy chủ AVA tự hỏi khi bấm "Kiểm tra lại thanh toán" ('Kiểm tra lại').
- Mọi kết quả, dù đúng hay sai, đều ghi một dòng vào giao_dich_thanh_toan (sổ kết quả thanh toán, chỉ thêm, không sửa, không xóa): id_cong_thanh_toan = 1; ma_don_cong_gui_ve = vnp_TxnRef; nguon_den; ma_ket_qua = vnp_ResponseCode; so_tien = vnp_Amount chia 100; ma_giao_dich_cong = vnp_TransactionNo; chu_ky_hop_le; du_lieu_goc = toàn bộ tham số nhận được dạng JSON (trong đó có vnp_TransactionStatus và vnp_BankCode); id_don_hang = đơn tìm được (để NULL khi chữ ký sai hoặc không tìm thấy đơn). Chữ ký sai vẫn chép nguyên văn các giá trị nhận được, chu_ky_hop_le = 0.
- Trước khi ghi sổ, làm sạch để lệnh ghi không bị MySQL từ chối: thiếu vnp_TxnRef thì ghi chuỗi rỗng; vnp_Amount không phải số nguyên thì so_tien = NULL; giá trị dài quá độ dài cột thì cắt bớt (bản đầy đủ vẫn nằm trong du_lieu_goc). Với nguon_den 'Kiểm tra lại', id_don_hang luôn là đơn đang được kiểm tra, kể cả khi chữ ký câu trả lời sai.
- Kiểm tra theo thứ tự, sai ở bước nào thì dừng ở bước đó:
  - Bước 1, chữ ký. Sai thì không tin gì trong kết quả.
  - Bước 2, tìm đơn theo mã đơn (tách phần số để tìm theo id, so lại phần ngày với ngay_tao). Không thấy thì dòng sổ không gắn đơn.
  - Bước 3, số tiền bằng tong_tien của đơn. Lệch thì đơn giữ nguyên.
  - Bước 4, thành công hay không theo hai mã ở 13.5.
- Xử lý đơn trong một giao dịch, khóa dòng đơn bằng SELECT … FOR UPDATE. Trước khi xét, đơn đang 'Chờ thanh toán' mà đã quá 30 phút từ ngay_tao thì chuyển 'Hết hạn' trước.
  - Thành công: đơn chưa 'Đã thanh toán' (dù đang 'Chờ thanh toán', 'Hết hạn' hay 'Thất bại', dù khóa vừa bị ẩn hay gỡ) thì chuyển 'Đã thanh toán', id_giao_dich_thanh_toan = id dòng sổ vừa ghi, xóa các khóa của đơn khỏi gio_hang của học viên đó. Đơn đã 'Đã thanh toán' rồi thì không đổi gì (dòng sổ đến sau chỉ được ghi lại).
  - Không thành công: đơn 'Chờ thanh toán' chuyển 'Thất bại', giỏ hàng giữ nguyên. Đơn 'Hết hạn', 'Thất bại' hay 'Đã thanh toán' thì giữ nguyên.
  - Lỗi ở bất kỳ bước nào trong giao dịch thì hoàn tác tất cả, đơn giữ trạng thái cũ.
- Thời điểm thanh toán của đơn là thoi_diem_nhan_ket_qua của dòng sổ mà id_giao_dich_thanh_toan trỏ tới. Mốc này dùng cho trang kết quả, chi tiết đơn, hạn 7 ngày hoàn tiền và 7 ngày tạm giữ tiền của người cung cấp.
- Học viên lỡ thanh toán hai đơn cùng chứa một khóa: cả hai đơn đều hoàn tất, không tự phát hiện.

## 13.7 Đường trình duyệt quay về và đường IPN
- VNPay đưa trình duyệt về /thanh-toan/ket-qua?vnp_… Trang này gửi nguyên chuỗi tham số tới GET /api/thanh-toan/vnpay-tra-ve. Máy chủ xử lý như 13.6 trước, rồi mới xét người xem: chỉ học viên chủ đơn mới nhận được thông tin đơn; người khác nhận trang 404 (đơn vẫn đã được xử lý).
- Trang hiện theo kết quả:
| Trường hợp | Trang hiện |
| --- | --- |
| Chữ ký sai, không tìm thấy đơn, hoặc lệch số tiền | Bố cục trang "Thanh toán không thành công" nhưng câu giải thích đổi thành "Không xác nhận được kết quả thanh toán. Nếu bạn đã bị trừ tiền, vui lòng bấm Kiểm tra lại thanh toán ở Lịch sử đơn hàng hoặc liên hệ hỗ trợ." (không hiện khối đơn hàng nếu không tìm thấy đơn) |
| Sau xử lý đơn là 'Đã thanh toán' | "Thanh toán thành công" |
| Sau xử lý đơn là 'Thất bại' | "Thanh toán không thành công" |
| Sau xử lý đơn là 'Hết hạn' | "Đơn hàng đã hết hạn" |

- IPN: VNPay gọi GET /api/thanh-toan/vnpay-ipn. Máy chủ xử lý như 13.6 và trả JSON { "RspCode": "…", "Message": "…" }:
| Trường hợp | RspCode | Message |
| --- | --- | --- |
| Chữ ký sai | 97 | Invalid signature |
| Không tìm thấy đơn | 01 | Order not found |
| Lệch số tiền | 04 | Invalid amount |
| Đơn đã 'Đã thanh toán' từ trước khi kết quả này tới | 02 | Order already confirmed |
| Đã ghi nhận xong (thành công hay không thành công) | 00 | Confirm Success |
| Lỗi máy chủ | 99 | Unknown error |

- Hai đường này là GET, không có cookie của AVA (IPN) và được bảo vệ bằng chữ ký, nên được miễn kiểm tra tiêu đề Origin (Phần chung C6).
- Trang "Thanh toán thành công": "Cảm ơn bạn. Các khóa học đã được mở, bạn có thể học ngay.", Mã đơn, Ngày thanh toán (dd/mm/yyyy HH:mm), Phương thức (tên cổng), Họ và tên, Gmail, Số điện thoại (lấy từ hồ sơ hiện tại), Ghi chú (nếu có), "Khóa học trong đơn (N)" kèm giá, "Tổng tiền", nút "Về trang chủ".
- Trang "Thanh toán không thành công": "Giao dịch bị hủy hoặc gặp lỗi. Bạn chưa bị trừ tiền cho đơn này, và giỏ hàng của bạn vẫn được giữ lại.", Mã đơn, Trạng thái "Thất bại", các khóa, "Tổng tiền", nút "Quay lại giỏ hàng" và "Về trang chủ".
- Trang "Đơn hàng đã hết hạn": câu "Bạn chưa hoàn tất thanh toán trong 30 phút nên đơn đã hết hạn. Nếu bạn đã bị trừ tiền, hãy bấm 'Kiểm tra lại thanh toán' hoặc liên hệ hỗ trợ ở cuối trang. Nếu muốn mua, vui lòng đặt lại từ đầu.", Mã đơn, Trạng thái "Hết hạn", các khóa, "Tổng tiền", nút "Về trang chủ" và "Kiểm tra lại thanh toán" (nút này chỉ hiện khi đơn tạo chưa quá 24 giờ, bấm thì làm như 13.8 và hiện câu kết quả ngay dưới nút).
- Đường /thanh-toan/ket-qua?don=<id> (không có tham số vnp_) chỉ hiện trang theo trạng thái hiện tại của đơn, không xử lý gì; dùng sau khi "Kiểm tra lại thanh toán" hoàn tất đơn.

## 13.8 Kiểm tra lại thanh toán
- Nút "Kiểm tra lại thanh toán" chỉ có ở đơn 'Chờ thanh toán' còn hạn và đơn 'Hết hạn' trong vòng 24 giờ kể từ ngay_tao. Đơn 'Thất bại' không có nút. Nút nằm ở cột "Hành động" của Lịch sử đơn hàng và ở trang "Đơn hàng đã hết hạn".
- Bấm thì hiện dải "Đang kiểm tra với VNPay…" ở đầu mục Lịch sử đơn hàng, gọi POST /api/don-hang/:id/kiem-tra-lai. Máy chủ kiểm lại đơn của chính học viên và điều kiện nút, rồi gửi yêu cầu tra cứu giao dịch (vnp_Command querydr) tới VNP_API_URL với vnp_TxnRef = mã đơn và vnp_TransactionDate = ngay_gui_cong_thanh_toan dạng yyyyMMddHHmmss, chữ ký theo đúng thứ tự trường của tài liệu VNPay cho querydr. Chờ tối đa 10 giây.
- Kết quả trả về được kiểm chữ ký, ghi một dòng sổ với nguon_den 'Kiểm tra lại' (ma_ket_qua = vnp_ResponseCode của câu trả lời tra cứu, trạng thái giao dịch đọc ở vnp_TransactionStatus trong du_lieu_goc), rồi xét:
| Câu trả lời của VNPay | Xử lý | Học viên thấy |
| --- | --- | --- |
| vnp_ResponseCode 00, vnp_TransactionStatus 00, đúng số tiền | Hoàn tất đơn như 13.6 | Chuyển sang trang "Thanh toán thành công" (/thanh-toan/ket-qua?don=<id>) |
| Không tìm thấy giao dịch (mã 91) hoặc giao dịch chưa hoàn tất (trạng thái 01) | Không đổi trạng thái đơn | "VNPay chưa ghi nhận thanh toán cho đơn này. Nếu bạn đã bị trừ tiền, vui lòng liên hệ hỗ trợ ở cuối trang." |
| Giao dịch lỗi (trạng thái khác 00 và 01) | Như kết quả không thành công ở 13.6 (đơn đang chờ thì thành 'Thất bại') | Câu "chưa ghi nhận" như trên |
| Chữ ký câu trả lời sai | Ghi sổ chu_ky_hop_le = 0, không đổi đơn | Câu "chưa ghi nhận" như trên |
| Quá 10 giây không trả lời hoặc lỗi kết nối | Không ghi sổ, không đổi đơn | "Không kết nối được với VNPay. Vui lòng thử lại sau ít phút." |

- Chữ "VNPay" trong các câu trên lấy từ cong_thanh_toan.ten.

## 13.9 Đơn hết hạn
- Việc chạy mỗi phút (Phần chung C13) chuyển mọi đơn 'Chờ thanh toán' quá 30 phút sang 'Hết hạn'.
- Mọi chỗ đọc đơn (lịch sử, chi tiết, kết quả, kiểm tra lại, trang admin) đều chạy lại câu chuyển hết hạn cho đơn liên quan trước khi trả dữ liệu, để không phụ thuộc việc chạy định kỳ.

## 13.10 Lịch sử đơn hàng và chi tiết đơn của học viên
- Mục "Lịch sử đơn hàng" (/ho-so#lich-su-don-hang, có ở menu ảnh đại diện): bảng cột Mã đơn, Ngày đặt (dd/mm/yyyy), Khóa học (tên đã chụp lúc mua, mỗi khóa một dòng), Số tiền (tong_tien), Trạng thái, Hành động ("Xem chi tiết"; thêm "Kiểm tra lại thanh toán" theo 13.8). Đơn mới nhất ở trên, 10 đơn mỗi trang. Chưa có đơn nào thì hiện "Bạn chưa có đơn hàng nào.".
- Trang /don-hang/:id ("Xem chi tiết"): "Chi tiết đơn hàng", Mã đơn, Trạng thái, Ngày đặt (dd/mm/yyyy HH:mm), Ngày thanh toán (thời điểm thanh toán, đơn chưa thanh toán ghi "Chưa thanh toán"), Phương thức (tên cổng), "Mã giao dịch VNPay" (ma_giao_dich_cong của dòng sổ thành công, chưa có ghi "Chưa có"), khối "Thông tin người đặt" (họ tên, Gmail, số điện thoại lấy từ hồ sơ hiện tại, ghi chú nếu có), "Khóa học trong đơn (N)" kèm giá lúc mua, khóa đã hoàn tiền có nhãn "Đã hoàn tiền", "Tổng tiền", liên kết "Quay lại lịch sử đơn hàng".
- Học viên không thấy nguồn bán và mức chia. Đơn của người khác: 404.

## 13.11 Đường xử lý ở máy chủ (chỉ học viên, trừ hai đường của VNPay)
- Thành công thì trả thẳng dữ liệu, không bọc trong { data }. Lỗi thì trả theo mẫu { loi, ma, cac_o } của Phần chung C6, được thêm trường cùng cấp khi cần. Riêng đường IPN trả đúng { "RspCode", "Message" } như VNPay yêu cầu (13.7).
- GET /api/dat-hang/xem-truoc?khoa=3,8 hoặc ?mua_ngay=12: thông tin người đặt từ hồ sơ, hồ sơ đủ chưa, các khóa mua được kèm giá hiện tại, các khóa bị bỏ kèm lý do, tên cổng.
- POST /api/don-hang: nhận { khoa: [{ id, gia }], ghi_chu, tu: "gio" | "mua_ngay" }. Thành công trả { duong_dan_thanh_toan }. Có khóa thay đổi thì trả 409 theo mẫu lỗi với ma "DON_THAY_DOI", danh sách mới đi kèm ở trường cùng cấp (13.4). Hồ sơ thiếu họ tên hoặc số điện thoại thì trả 400 theo mẫu lỗi.
- GET /api/thanh-toan/vnpay-tra-ve, GET /api/thanh-toan/vnpay-ipn: như 13.7.
- POST /api/don-hang/:id/kiem-tra-lai: như 13.8.
- GET /api/don-hang?trang=: lịch sử đơn. GET /api/don-hang/:id: chi tiết đơn.

## 13.12 Bảng dữ liệu dùng
- don_hang, chi_tiet_don_hang, giao_dich_thanh_toan, cong_thanh_toan, gio_hang, khoa_hoc, nguoi_dung, hoc_vien.

## 13.13 Câu thông báo
- "Hồ sơ của bạn còn thiếu họ tên hoặc số điện thoại. Vui lòng cập nhật hồ sơ để thanh toán."
- "Đơn hàng có thay đổi, vui lòng xem lại trước khi thanh toán.", "Giá đã đổi từ … thành ….", "Khóa “…” không còn bán nên đã được bỏ khỏi đơn.", "Bạn đã sở hữu khóa “…” nên khóa này đã được bỏ khỏi đơn.", "Các khóa bạn chọn không còn mua được."
- "Không xác nhận được kết quả thanh toán. Nếu bạn đã bị trừ tiền, vui lòng bấm Kiểm tra lại thanh toán ở Lịch sử đơn hàng hoặc liên hệ hỗ trợ."
- "Đang kiểm tra với VNPay…", "VNPay chưa ghi nhận thanh toán cho đơn này. Nếu bạn đã bị trừ tiền, vui lòng liên hệ hỗ trợ ở cuối trang.", "Không kết nối được với VNPay. Vui lòng thử lại sau ít phút."
- "Bạn chưa có đơn hàng nào."

## 13.14 Kiểm tra khi làm xong
- Thanh toán bằng thẻ thử của sandbox: đơn thành 'Đã thanh toán', id_giao_dich_thanh_toan trỏ đúng dòng sổ, các khóa biến khỏi giỏ, trang chi tiết khóa hiện "Đã sở hữu".
- Bấm hủy trên trang VNPay: đơn 'Thất bại', giỏ còn nguyên, trang "Thanh toán không thành công".
- Tạo đơn rồi chờ quá 30 phút: đơn 'Hết hạn'. Tạo đơn mới khi đang có đơn chờ: đơn cũ thành 'Hết hạn'.
- Sửa tay một tham số trên đường dẫn quay về (ví dụ vnp_Amount): sổ có dòng chu_ky_hop_le = 0, đơn không đổi, trang báo "Không xác nhận được kết quả thanh toán…".
- Gửi lại đúng đường dẫn quay về thành công lần hai: sổ thêm một dòng, đơn không đổi.
- Người cung cấp đổi giá khi học viên đang ở trang Thông tin đơn hàng: bấm "Thanh toán" thì thấy dải vàng và giá mới, chưa có đơn nào được tạo.
- Mua qua link của chủ khóa: chi_tiet_don_hang có 'Giới thiệu' và 90. Mua qua link của chính mình: 'Tự nhiên' và 60.
- Học viên mở /don-hang/<id đơn của người khác>: 404.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_13_dat_hang_thanh_toan.md
