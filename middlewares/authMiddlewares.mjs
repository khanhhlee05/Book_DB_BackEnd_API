import jwt from "jsonwebtoken"


//grab the token and verify func
const requireAuth = (request, response, next) => {
    const token = request.cookies.jwt; //grab the token from the cookies

    if (token){
        jwt.verify(token, "my ultimate secret", (error, decodedToken) => {
            if (error){
                console.log(error.message)
                response.redirect("/api/auth/login")
            } else {
                console.log(decodedToken)
                next()  
            }
        } )
    } else {
        response.redirect("/api/auth/login")
    }
} 