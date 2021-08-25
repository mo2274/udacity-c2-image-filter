"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
const joi_1 = __importDefault(require("@hapi/joi"));
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(200).json({
            status: "OK",
            message: "try GET /filteredimage"
        });
    }));
    app.get("/filteredimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const schema = joi_1.default.object({
            image_url: joi_1.default.string()
                .uri()
                .required()
        });
        // validate the request query
        let { error, value } = schema.validate(req.query, { allowUnknown: true });
        if (error) {
            return res.status(400).json({
                status: "BAD_REQUEST",
                message: error.message
            });
        }
        util_1.filterImageFromURL(req.query.image_url)
            .then(path => {
            res.sendFile(path, (error) => {
                util_1.deleteLocalFiles([path]);
            });
        })
            .catch(error => {
            console.log(error);
            return res.status(422).json({
                status: "UNPROCESSABLE ENTITY",
                message: "Error while processing the image!"
            });
        });
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map