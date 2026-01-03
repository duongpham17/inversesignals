import Hacked from '@components/animations/texts/Hacked';
import styles from './Cookies.module.scss';

const CookiesRoute = () => {

    const data = [
        {
            title: "What are cookies?",
            description: `Cookies are small text files that websites store on your device such as a computer or phone to save information about your visit. 
                When you visit a site, its server sends a cookie to your browser, which then stores it and sends it back on later visits. 
                This allows the site to “remember” you and provide a more consistent experience.`
        },
        {
            title: "What are cookies used for in this website?",
            description: ` Cookies arnt used for anything on this website but more for the app that is downloaded on this webiste.`
        },
        {
            title: "What are the cookies used for on the downloaded app?",
            description: `Cookies are stored for logged in users to save information about their actions and history on the app and to protect routes which guest users can not enter. 
                If you are a guest you dont have to worry much about cookies.`
        },
        {
            title: "How to delete cookies",
            description: `You can delete cookies by clearing your browsing history, clearing cache and clearing local storage.
                If you do not agree to the use of cookies, you can adjust your browser settings to refuse or delete cookies.`
        }
    ]

  return (
    <div className={styles.container}>

        <h1>Cookies</h1>

        <p>Last updated: 24/10/2025</p>

        {data.map((el, index) => 
            <section key={index}>
                <h3><Hacked text={el.title}/></h3>
                <p>{el.description}</p>
            </section>
        )}
    
    </div>
  )
}

export default CookiesRoute