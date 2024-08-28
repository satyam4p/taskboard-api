import * as express from "express";
import trackerModal from "../../models/tracker.modal";

class TrackerController {
  private path = "/tracker";
  public router = express.Router();
  private tracker = trackerModal;
  constructor() {
    this.initialiseRoutes();
  }
  initialiseRoutes() {
    this.router.post(`${this.path}/`, this.queueEvents);
  }
  queueEvents = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const req = request.body;
      const alreadyExisits = await this.tracker.findOne({ fprint: req.fprint });
      if (alreadyExisits) {
        response.status(200).send({
          status: "200",
        });
      } else {
        const newEntry = new this.tracker({
          ...req,
        });
        newEntry.save().then(async (entry) => {
          if (entry) {
            response.status(200).send({ status: "200" });
          }
        });

        response.status(200).send({
          status: "200",
        });
      }
    } catch (error) {
      console.log("error::Tracker::  ", error);
    }
  };
}

export default TrackerController;
