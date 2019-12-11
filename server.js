const tagService = require('./index');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const start = () => {
    let app = express();
    app.server = http.createServer(app);

    app.use(cors());

    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.use(bodyParser.json({
        limit: "2048kb"
    }));

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        next();
    });

    app.get("/getTags", (req, res, next) => {
        try {
            res.status(200).send(tagService.getTags());
        } catch (ex) {
            console.log(ex);
            next(ex);
        }
    });

    app.post("/addTag", (req, res, next) => {
        try {
            res.status(200).send(tagService.addTag(req.body.tag));
        } catch (ex) {
            console.log(ex);
            next(ex);
        }
    });

    app.post("/setTags", (req, res, next) => {
        try {
            res.status(200).send(tagService.setTags(req.body.tags));
        } catch (ex) {
            console.log(ex);
            next(ex);
        }
    });

    app.post("/removeTag", (req, res, next) => {
        try {
            res.status(200).send(tagService.removeTag(req.body.tag));
        } catch (ex) {
            console.log(ex);
            next(ex);
        }
    });

    app.use((err, req, res, next) => {
        const errorObj = {
            service: "read"
        };
        if (err.status === 400) {
            if (err.validationErrors) {
                errorObj.validationErrors = err.validationErrors;
            }
            errorObj.message = err.message || "Invalid Values Supplied";
            errorObj.head = err.head || null;
        } else if (err.status === 401 || err.status === 403) {
            errorObj.head = err.head || null;
            errorObj.message = err.message || "Unauthorized User";
        } else if (err.status === 500) {
            errorObj.head = err.head || null;

            errorObj.message = err.message;

            errorObj.message = "Internal Server Error";
        } else if (err.status === 404) {
            errorObj.head = err.head || null;
            errorObj.message = err.message;
        } else {
            errorObj.head = err.head || null;

            errorObj.message = err.message || "Unknown Error Occurred";
        }

        next();
        return res.status(err.status || 500).json(errorObj);
    });

    app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
        console.log("Starting server on port ", process.env.PORT || 3000);
    });
}

/**
 * Gracefully shut it down
 */
process.on("SIGTERM", () => {
    process.exit(0);
});
process.on("SIGINT", () => {
    process.exit(0);
});

module.exports = start;