import { Button, Form } from "react-bootstrap";
import "./styles.css";
import emailjs from "emailjs-com";
import { useRef } from "react";
import { Toast } from "primereact/toast";

export default function ContactForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const contentRef = useRef();
  const submitRef = useRef();
  const toast = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: nameRef.current.value?.trim(),
      email: emailRef.current.value?.trim(),
      phone: phoneRef.current.value?.trim(),
      content: contentRef.current.value?.trim(),
    };

    if (!formData.name) {
      toast.current.show({
        severity: "error",
        summary: "Tên",
        detail: "Tên không thể để trống",
        life: 30000,
      });
      return;
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        formData.email
      )
    ) {
      toast.current.show({
        severity: "error",
        summary: "Email",
        detail: "Email không hợp lệ",
        life: 3000,
      });
      return;
    }

    if (
      formData.phone &&
      !/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/g.test(formData.phone)
    ) {
      toast.current.show({
        severity: "error",
        summary: "Số điện thoại",
        detail: "Số điện thoại không hợp lệ",
        life: 3000,
      });
      return;
    }

    if (!formData.content) {
      toast.current.show({
        severity: "error",
        summary: "Nội dung liên hệ",
        detail: "Nội dung liên hệ không thể để trống",
        life: 3000,
      });
      return;
    }

    fetch("http://localhost:8000/api/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.current.show({
          severity: "success",
          summary: "Gửi liên hệ",
          detail: "Gửi liên hệ thành công",
          life: 3000,
        });
        handleSendContact();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.current.show({
          severity: "error",
          summary: "Gửi liên hệ ",
          detail: "Gửi liên hệ không thành công",
          life: 3000,
        });
      });
  };

  const handleSendContact = () => {
    submitRef.current.textContent = "Đang tải...";
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: nameRef.current.value ?? emailRef.current.value,
          message:
            "Cảm ơn bạn đã quan tâm đến TDC. TDC sẽ phản hồi lại sớm nhất có thể <3",
          reply_to: emailRef.current.value,
        },
        "nbxhmGhQt4JpgZSUa"
      )
      .then(() => {
        toast.current.show({
          severity: "info",
          summary: "Gửi liên hệ",
          detail: "Kiểm tra thông tin gmail",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log("Send contact failed: ", err);
        toast.current.show({
          severity: "error",
          summary: "Gửi liên hệ ",
          detail: "Gửi gmail không thành công",
          life: 3000,
        });
      })
      .finally(() => {
        submitRef.current.textContent = "Gửi liên hệ";
      });
  };

  return (
    <div className="contact-form">
      <Toast ref={toast} />
      <div className="row">
        <div className="col-md-4 position-relative">
          <img
            style={{ width: "100%", height: "auto", borderRadius: "30px", position: "absolute", top: "30%" }}
            src="./src/contacts/contact.jpg"
            alt="Gửi thông tin liên hệ"
          />
        </div>
        <div className="col-md-8">
          <Form>
            <h4>Gửi thông tin liên hệ đến TFT</h4>
            <i>TFT luôn sẵn lòng phản hồi</i>

            <Form.Group className="my-1" controlId="exampleForm.ControlInput1">
              <Form.Control ref={nameRef} placeholder="Tên..." type="text" />
            </Form.Group>

            <Form.Group className="my-2" controlId="exampleForm.ControlInput1">
              <Form.Control
                ref={emailRef}
                placeholder="Email..."
                type="email"
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="exampleForm.ControlInput1">
              <Form.Control
                ref={phoneRef}
                placeholder="Số điện thoại..."
                type="tel"
              />
            </Form.Group>

            <Form.Group
              className="mb-2"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                ref={contentRef}
                placeholder="Nội dung liên hệ..."
                as="textarea"
                rows={3}
              />
            </Form.Group>

            <h4>Gửi thông tin tuyển sinh (không bắt buộc)</h4>
            <i>TFT rất mong nhận được thông tin từ bạn</i>

            <Form.Group className="my-2">
              <Form.Control
                min={0}
                max={10}
                step={0.2}
                placeholder="Điểm Toán THPTQG"
                type="number"
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Control
                min={0}
                max={10}
                step={0.2}
                placeholder="Điểm Tiếng Anh THPTQG"
                type="number"
              />
            </Form.Group>

            <button
              onClick={handleSubmit}
              ref={submitRef}
              className="btn-contact btn-view"
            >
              Gửi liên hệ
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
