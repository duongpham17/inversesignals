
import styles from './Privacy.module.scss';
import Hacked from '@components/animations/texts/Hacked';

const PolicyPage = () => {

    const data = [
        {
            title: "Users data",
            message: `All the users data is stored in Monogdb database. No user data is transmitted or collected by third party.`
        },
        {
            title: "Usage",
            message: `The app does not track your usage, monitor your system, or access your personal files.`
        },
        {
            title: "Local usage",
            message: `All actions are performed locally and remain private to you.`
        },
        {
            title: "Stripe ( Payment )",
            message: `Stripe complies with the highest security standards (PCI DSS) to protect your payment information.`
        },
        {
            title: "Date Sharing",
            message: `We do not sell or share your personal information with third parties except as necessary to comply with payment processing and legal obligations.`
        },
        {
            title: "Email & Username",
            message: "An email is only required if you want the ability to recover your account; otherwise, you can sign up using just a username and password. This ensures that none of your personal information is stored in our database."
        }
    ]

    return (
        <section className={styles.container}>

            <h1>Privacy</h1>

            <p>Last updated: 24/10/2025</p>

            {data.map((el, index) => 
                <section key={el.title}>
                    <h3>{index+1}. <Hacked text={el.title}/></h3>
                    <p>{el.message}</p>
                </section>
            )}
        
        </section>
  )
}

export default PolicyPage