import jwt from 'jsonwebtoken'

//for example user wants to like a post
//they click the like button, but it doesnt get processed instantly. we are not sure if they have permission or not.
//so first it goes to auth middleware and does all the checks below. if all good we will go to (NEXT) and then we will like the post

const auth = async (req, res, next) => {
    try {

        //after user signs in or signs up, they get a token. here, we are checking if the token is valid
        const token = req.headers.authorization.split(' ')[1]

        //theres 2 tokens. from normal sign in and from google auth. our one is less than 500. if more than 500 it is google's
        const isCustomAuth = token.length < 500

        //decodeddata is the data we get from the token itself
        let decodedData

        if (token && isCustomAuth) { //this is for our own token
            decodedData = jwt.verify(token, 'test')

            //remember, middleware is good for populating stuff to the (NEXT) function. below we pass in userId, so (NEXT) can access it in req.userID
            req.userId = decodedData.id
        } else { //this is for google auth token
            decodedData = jwt.decode(token)

            //remember, middleware is good for populating stuff to the (NEXT) function. below we pass in userId, so (NEXT) can access it in req.userID
            req.userId = decodedData.sub
        }

        next()

    } catch (error) {
        console.log(error)
    }
}

export default auth