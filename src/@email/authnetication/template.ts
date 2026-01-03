import { website } from '../../@environment';
import { IAuthentication } from './';
 
export const AUTHENTICATION = ({token}: IAuthentication) => `
<html>
    <body>          
        <table style="width: 100%; border-spacing: 0px;background: white; padding: 2rem;">
            <tr>
                <th>            
                    <h1 style="text-align:left; font-size: 1rem;">
                        <p style="text-decoration: none;color: black">${website.Name} ( Authentication )</p>
                    </h1>
                </th>
            </tr>
            <tr>
                <td style="padding: 1rem 0rem">
                	<p style="padding: 1rem 0rem; color: #1F51FF; font-size: 2rem"> ${token} </p>
                	<p style="padding: 1rem 0rem"> This code will expire in 5 minutes</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 1rem 0rem">
                    <p> If you did not request this email, please delete or ignore.</p> 
                </td>
            </tr>
            <tr>
                <td style="height: 50px;">
                    <footer style="margin-top: 5rem; text-align: center; padding: 1rem; border-top: 1px solid black">
                    <p>Automated email</p>
                    <p>Please do not reply to this email. </p>
                    <p>
                    </footer>
                </td>
            </tr>
        </table>
    </body>
</html>
`