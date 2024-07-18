import { Form } from "react-bootstrap";
import "./styles.css";
import emailjs from "emailjs-com";
import { useContext, useRef } from "react";
import { Toast } from "primereact/toast";
import { apiURL, ConfigContext } from "../../App";

export default function ContactForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const contentRef = useRef();
  const submitRef = useRef();
  const toast = useRef();
  const mathRef = useRef();
  const engRef = useRef();
  const configs = useContext(ConfigContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRef.current.style.display = "none";

    const formData = {
      name: nameRef.current.value?.trim(),
      email: emailRef.current.value?.trim(),
      phone: phoneRef.current.value?.trim(),
      content: contentRef.current.value?.trim(),
      math: +mathRef.current.value?.trim(),
      eng: +engRef.current.value?.trim(),
    };

    if (!formData.name) {
      toast.current.show({
        severity: "error",
        summary: "Tên",
        detail: "Tên không thể để trống",
        life: 30000,
      });
      submitRef.current.style.display = "unset";
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
      submitRef.current.style.display = "unset";
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
      submitRef.current.style.display = "unset";
      return;
    }

    if (!formData.content) {
      toast.current.show({
        severity: "error",
        summary: "Nội dung liên hệ",
        detail: "Nội dung liên hệ không thể để trống",
        life: 3000,
      });
      submitRef.current.style.display = "unset";
      return;
    }

    if (formData.math && (formData.math < 1.2 || formData.math > 10)) {
      toast.current.show({
        severity: "error",
        summary: "Nội dung liên hệ",
        detail: "Điểm Toán không đúng",
        life: 3000,
      });
      submitRef.current.style.display = "unset";
      return;
    }

    if (formData.eng && (formData.eng < 1.2 || formData.eng > 10)) {
      toast.current.show({
        severity: "error",
        summary: "Nội dung liên hệ",
        detail: "Điểm tiếng Anh không đúng",
        life: 3000,
      });
      submitRef.current.style.display = "unset";
      return;
    }

    //2 empty                     false && false
    //1 correct 1 empty -> test   false && true
    //2 correct                   true && true
    if ((formData.eng || formData.math) && !(formData.eng && formData.math)) {
      toast.current.show({
        severity: "error",
        summary: "Nội dung liên hệ",
        detail: "Bạn chưa nhập đủ điểm cho cả 2 môn",
        life: 3000,
      });
      submitRef.current.style.display = "unset";
      return;
    }

    fetch(apiURL + "contacts", {
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
        submitRef.current.style.display = "unset";
      });
  };

  const handleSendContact = () => {
    emailjs
      .send(
        configs?.find((config) => config.key === "EMAIL_SERVICE_ID")?.value ||
          "service_miw9zp4",
        configs?.find((config) => config.key === "EMAIL_TEMPLATE_01_ID")
          ?.value || "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: nameRef.current.value ?? emailRef.current.value,
          message:
            "Cảm ơn bạn đã quan tâm đến TDC. TDC sẽ phản hồi lại sớm nhất có thể <3",
          reply_to: emailRef.current.value,
        },
        configs?.find((config) => config.key === "EMAIL_USER_ID")?.value ||
          "nbxhmGhQt4JpgZSUa"
      )
      .then(() => {
        toast.current.show({
          severity: "info",
          summary: "Gửi liên hệ",
          detail: "Kiểm tra thông tin gmail",
          life: 3000,
        });
        //
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
        submitRef.current.style.display = "unset";
      });
  };

  return (
    <div className="contact-form mt-4">
      <Toast position="bottom-center" ref={toast} />
      <Form>
        <h4>Gửi thông tin liên hệ đến TFT</h4>
        <small>
          <i>TFT luôn sẵn lòng phản hồi</i>
        </small>

        <Form.Group className="my-1" controlId="exampleForm.ControlInput1">
          <small>
            Tên của bạn <span className="text-danger s">*</span>
          </small>
          <Form.Control ref={nameRef} placeholder="Tên..." type="text" />
        </Form.Group>

        <Form.Group className="my-2" controlId="exampleForm.ControlInput1">
          <small>
            Địa chỉ email <span className="text-danger s">*</span>
          </small>
          <Form.Control ref={emailRef} placeholder="Email..." type="email" />
        </Form.Group>

        <Form.Group className="my-2" controlId="exampleForm.ControlInput1">
          <small>Số điện thoại</small>
          <Form.Control
            ref={phoneRef}
            placeholder="Số điện thoại..."
            type="tel"
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
          <small>
            Nội dung liên hệ <span className="text-danger s">*</span>
          </small>
          <Form.Control
            ref={contentRef}
            placeholder="Nội dung liên hệ..."
            as="textarea"
            rows={3}
          />
        </Form.Group>

        <h4 className="pt-2">Điểm thi THPTQG phục vụ công tác tuyển sinh</h4>
        <small>
          <i>TFT luôn chào đón bạn</i>
          <br />
          <i>
            (Điểm của bạn sẽ được xem là của cùng một người nếu trùng tên và
            trùng email)
          </i>
        </small>

        <Form.Group className="my-2" controlId="exampleForm.ControlInput1">
          <small>Điển Toán</small>
          <Form.Control
            min={1.2}
            max={10}
            step={0.2}
            placeholder="Điểm Toán"
            type="number"
            ref={mathRef}
          />
        </Form.Group>

        <Form.Group className="mb-2" controlId="exampleForm.ControlTextarea1">
          <small>Điển Tiếng Anh</small>
          <Form.Control
            placeholder="Điển Tiếng Anh"
            min={1.2}
            max={10}
            step={0.2}
            type="number"
            ref={engRef}
          />
        </Form.Group>

        <button onClick={handleSubmit} ref={submitRef} className="btn mt-3">
          Gửi liên hệ
        </button>
        <br />

        <small>
          <i className="">
            Thông tin <span className="text-danger">*</span> là thông tin bắt
            buộc
          </i>
        </small>
      </Form>
    </div>
  );
}
