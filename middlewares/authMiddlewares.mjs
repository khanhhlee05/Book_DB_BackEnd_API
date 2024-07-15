import jwt from "jsonwebtoken"
/* import { promisify } from 'util';

const verifyToken = promisify(jwt.verify);
 */

//grab the token and verify func
export const requireAuth =  (request, response, next) => {
    const token = request.cookies.jwt; //grab the token from the cookies



    if (token) {
        jwt.verify(token, "my ultimate secret", (error, decodedToken) => {
            if (error) {
                console.log(error.message);
                response.status(400).json({ error: 'Invalid token' }); // Send JSON response with error message
            } else {
                request.token = decodedToken;
                
                next();
            }
        });
    } else {
       response.status(400).json({ error: 'No token provided' }); // Send JSON response with error message
    }
} 



   /*  if (token){
       try {
        const decodedToken = await verifyToken(token, "my ultimate secret");
        request.token = decodedToken;
        next();
       } catch (error) {
        console.log(error.message)
        response.sendStatus(400)
       }  */