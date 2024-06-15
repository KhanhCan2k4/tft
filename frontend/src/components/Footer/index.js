

export default function Footer() {
    return (
        <footer className=" text-white p-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 offset-1 mb-2">
                            <h4>KHOA CÔNG NGHỆ THÔNG TIN<br />
                                Trường Cao Đẳng Công Nghệ Thủ Đức</h4>
                    </div>
                    <div className="col-md-6 offset-1">
                        <div className="footerinfo">
                            <p>53 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. HCM - Phòng B115</p>
                            <p>Điện thoại: (028) 22 158 642; Nội bộ: 309</p>
                            <p>Email: fit@tdc.edu.vn</p>
                            <p>Facebook: <a href="https://www.facebook.com/tdc.fit/">facebook.com/tdc.fit</a></p>
                            <p>Youtube: <a href="https://www.youtube.com/fit-tdc">youtube.com/fit-tdc</a></p>
                            <p>LinkedIn: <a href="https://www.linkedin.com/school/fit-tdc/">linkedin.com/school/fit-tdc</a></p>

                        </div>
                    </div>
                    <div className="col-md-4">
                        <ul className="bottom-link">
                            <li className=""><a href="gioi-thieu">Giới thiệu</a></li>
                            <hr />
                            <li className=""><a href="http://tdc.edu.vn/">Trường Cao Đẳng Công Nghệ Thủ Đức</a></li>
                            <hr />
                        </ul>
                        <ul className="bottom-link">
                            <li className=""><a href="lien-he">Liên hệ</a></li>
                            <hr />
                            <li className="">2024 <a href="http://fit.tdc.edu.vn/">Khoa Công nghệ thông tin | Cao đẳng Công nghệ Thủ Đức | FIT - TDC</a> All Rights Reserved.</li>
                            <hr />
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}