import jwt from "jsonwebtoken"


//grab the token and verify func
export const requireAuth =  (request, response, next) => {
    const token = request.cookies.jwt; //grab the token from the cookies



    if (token) {
        jwt.verify(token, "my ultimate secret", (error, decodedToken) => {
            if (error) {
                console.log(error.message);
                return response.status(400).json({ error: 'Invalid token' }); // Send JSON response with error message
            } else {
                request.token = decodedToken;
                
                next();
            }
        });
    } else {
       return response.status(400).json({ error: 'No token provided' }); // Send JSON response with error message
    }
} 



 