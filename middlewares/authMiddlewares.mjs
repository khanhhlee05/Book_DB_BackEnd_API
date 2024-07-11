import jwt from "jsonwebtoken"


//grab the token and verify func
export const requireAuth = (request, response, next) => {
    const token = request.cookies.jwt; //grab the token from the cookies

    if (token){
        jwt.verify(token, "my ultimate secret", (error, decodedToken) => {
            if (error){
                console.log(error.message)
                response.sendStatus(400)
                response.redirect("/api/auth/login")
            } else {
                request.token = decodedToken
                next()  
            }
        } )
    } else {
        response.sendStatus(400)
        response.redirect("/api/auth/login")
    }
} 



