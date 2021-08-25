import express from 'express';
import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import Joi from "@hapi/joi";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/", async (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "try GET /filteredimage"
    });
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
  const schema = Joi.object({
    image_url: Joi.string()
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

  filterImageFromURL(req.query.image_url)
    .then(path => {
      res.sendFile(path, (error) => {
        deleteLocalFiles([path]);
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(422).json({
        status: "UNPROCESSABLE ENTITY",
        message: "Error while processing the image!"
      });
    });
});


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();