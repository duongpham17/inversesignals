
import styles from './Policy.module.scss';
import Hacked from '@components/animations/texts/Hacked';

const PolicyPage = () => {

    const data = [
        {
            title: "Acceptance of Terms",
            message: `By downloading the app and using this website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you must not use this site or download anything related on this site.`
        },
        {
            title: "Use of Website",
            message: `You agree to use the website and app only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the site.`
        },
        {
            title: "Intellectual Property",
            message: `All content on this website and app, including text, images, logos, and software, is the property of [Your Business Name] and protected by copyright laws. You may not copy, reproduce, distribute, or create derivative works without permission.`
        },
        {
            title: "Creating Accounts & Recovery",
            message: "When creating an account, an email address is not required—you can sign up using only a username and password. Verifying your account with an email is optional and can be done at any time. However, please keep in mind that an email is necessary if you ever need to recover a lost username or password. This approach is designed to protect your privacy, especially if you prefer not to share your email address with us."
        },
        {
            title: "User Accounts",
            message: `If you create an account, you are responsible for maintaining the confidentiality of your login details and for all activities that occur under your account.`
        },
        {
            title: "Data Storage and Privacy",
            message: `Your information, such as email and username, will be stored securely in our database.`
        },
        {
            title: "Termination",
            message: `We reserve the right to terminate or suspend your access to the website at our sole discretion without notice for conduct that violates these terms.`
        },
        {
            title: "Limitation of Liability",
            message: `The website is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the site.`
        },
        {
            title: "Governing Law",
            message: `These terms are governed by the laws of United Kingdom. Any disputes will be subject to the exclusive jurisdiction of the courts in United Kingdom`
        },
        {
            title: "Changes to Terms",
            message: `We may update these Terms and Conditions from time to time. Continued use of the website after changes constitutes acceptance of the new terms.`
        }
    ]

    return (
        <section className={styles.container}>

            <h1>Terms and condtion</h1>

            <p>Last updated: 24/10/2025</p>

            {data.map((el, index) => 
                <div key={el.title}>
                    <h3>{index+1}. <Hacked text={el.title}/></h3>
                    <p>{el.message}</p>
                </div>
            )}
        
        </section>
  )
}

export default PolicyPage