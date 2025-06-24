import aj from "../config/arcjet.js"

const arcjetMiddleware = async (req, res, next) => {
    try {
        // protecting all the incoming requests
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({error: "Rate Limit Exceeded"});
            }

            if(decision.reason.isBot()) {
                return res.status(403).json({error: "Bots Detected!!"});
            }

            return res.status(403).json({error: "Access denied!!"});
        }

        next();
    }
    catch(e) {
        console.log(`ArcJet Middleware Error: ${e}`);
        next(e);
    }
}

export default arcjetMiddleware;