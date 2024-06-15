import ContactForm from "../../components/ContactForm";
import DefaultLayout from "../../layouts/DefaultLayout";
import "./styles.css";

export default function ContactPage() {

    return (
        <DefaultLayout 
            slot={
                <div className="about-page">
                    <h2 className="title">LIÊN HỆ VỚI CHÚNG TÔI - TFT</h2>
                    <ContactForm />
                </div>
            }>
        </DefaultLayout>
    );
}