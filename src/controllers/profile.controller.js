import jwt from "jsonwebtoken";
import ProfileModel from "../models/profile.model.js";
import { throwError } from "../utils/helpers.js";

const profileController = {
  createProfile: async (req, res) => {
    try {
      const { personalInfo, workInfo, additionalInfo } = req.body;

      const saveData = await ProfileModel.create({
        personalInfo,
        workInfo,
        additionalInfo,
      });

      res.status(201).send({
        message: "Created a new profile successfully!",
        data: saveData,
        isSuccess: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
        isSuccess: false,
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const existData = await ProfileModel.findById(id);
      if (!existData) throwError("Profile not exist!");

      res.status(200).send({
        message: "Profile retrieved successfully!",
        data: existData,
        isSuccess: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
        isSuccess: false,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { authorization } = req.headers;
      const { personalInfo, workInfo, additionalInfo } = req.body;

      const token = authorization.split(" ")[1];
      const user = await jwt.decode(token);
      if (user.profileId !== id && personalInfo)
        throwError("Only the owner of the personal information can edit it!");

      const existProfile = await ProfileModel.findByIdAndUpdate(
          id,
          {
            personalInfo,
            workInfo,
            additionalInfo,
          },
          { new: true }
      );
      if (!existProfile) throwError("Profile not exist!");

      res.status(200).send({
        message: "Profile updated successfully!",
        data: existProfile,
        isSuccess: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
        isSuccess: false,
      });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const existData = await ProfileModel.findByIdAndDelete(id);
      if (!existData) throwError("Profile not exist!");

      res.status(200).send({
        message: "Profile deleted successfully!",
        data: existData,
        isSuccess: true,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
        isSuccess: false,
      });
    }
  },
};

export default profileController;
