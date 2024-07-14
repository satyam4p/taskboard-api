import express, { Router } from "express";
import configModal from "../../models/configModal";
import authMiddleware from "../../middleware/auth.middleware";
import validationMiddleware from "../../middleware/validation.middleware";
import CreateTaskConfigDTO from "../../dto/createTaskConfig.dto";
import RequestWithUser from "../../interfaces/requestWithUser.interface";
import { isObjectEqual } from "../../utils/isEquals";
import { cloneDeep } from "lodash";

class ConfigController {
  public path = "/config";
  public router = Router();
  private config = configModal;

  constructor() {
    this.initialiseRoutes();
  }

  initialiseRoutes = () => {
    this.router
      .all(`${this.path}/*`, authMiddleware)
      /** need to create proper dto for config validation */
      .post(
        `${this.path}/create`,
        validationMiddleware(CreateTaskConfigDTO),
        this.createTaskConfig
      )
      // .post(`${this.path}/create`,this.createTaskConfig)
      .get(`${this.path}/:id`, this.getTaskConfig)
      .delete(`${this.path}/delete/:id`, this.deleteConfig)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreateTaskConfigDTO),
        this.updateConfig
      );
  };

  createTaskConfig = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const reqData = request.body;
      const reqWithUser = request as RequestWithUser;
      const existingConfig = await this.config.findOne({
        organisation: reqWithUser.user._id,
      });

      if (existingConfig) {
        const existingConfigClone = cloneDeep(existingConfig).toObject();
        ["_id", "organisation", "__v"].forEach(
          (prop) => delete existingConfigClone[prop]
        );
        if (isObjectEqual(existingConfigClone, reqData)) {
          response.status(200).send({
            message: "Same config already exists",
          });
          return;
        }
      }
      const createdConfig = new this.config({
        ...reqData,
        organisation: reqWithUser.user._id,
      });
      createdConfig.save().then((config) => {
        response.status(200).send(config);
      });
    } catch (error) {
      console.log("error occured:: ", error);
      response.status(402).send({
        message: "error occured while creating config",
      });
    }
  };

  getTaskConfig = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      console.log("request received");
      const reqId = request.params.id;
      const requestedConfig = await this.config.findOne({
        organisation: reqId,
      });
      ("");
      console.log("requested config:: ", requestedConfig);
      if (requestedConfig) {
        const configClone = cloneDeep(requestedConfig).toObject();
        ["_id", "organisation", "__v"].forEach(
          (prop) => delete configClone[prop]
        );
        response.status(200).send(configClone);
      } else {
        response.status(400).send({
          message: "Config does not exist",
        });
      }
    } catch (error) {
      console.log(
        `error occured whilefeching config for org ${request.params.id}`
      );
      response.status(404).send("Config does not exisits");
    }
  };

  updateConfig = async (
    request: express.Request,
    response: express.Response
  ) => {
    console.log("req received");
    const reqId = request.params.id;
    const reqData = request.body;

    try {
      const reqWUser = request as RequestWithUser;
      const existingConfig = await this.config.findOne({
        organisation: reqId,
      });

      if (existingConfig) {
        const res = await this.config.updateOne(
          { organisation: reqId },
          reqData
        );
        if (res) {
          response.status(200).send({
            message: "config updated successfully",
          });
          return;
        }
      }
      response.status(404).send({
        message: "config does not exists",
      });
      return;
    } catch (error) {
      console.log("an error occured while updating the config:: ", error);
      response.send({
        message: "an error occured while updating the config",
      });
    }
  };

  deleteConfig = async (
    request: express.Request,
    response: express.Response
  ) => {
    const reqId = request.params.id;
    try {
      const reqWUser = request as RequestWithUser;
      const deltedConfig = await this.config.deleteOne({
        organisation: reqWUser.user._id,
      });
      if (deltedConfig) {
        response.status(200).send({
          message: "config has been deleted successfully",
        });
      }
    } catch (error) {
      console.log("an error occured while deleting the config:: ", reqId);
      response.status(402).send({
        message: "the config does not exists",
      });
    }
  };
}

export default ConfigController;
