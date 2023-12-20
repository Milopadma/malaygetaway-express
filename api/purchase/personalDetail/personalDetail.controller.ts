import PersonalDetail from "../../../model/purchase/personalDetail.model";
import {
  sendCreated,
  sendInternalError,
  sendInvalid,
  sendSuccess,
  sendNotFound,
  sendConflict,
  sendUnauthorized,
} from "../../../helpers/responses";


export class PersonalDetailController {
  async createPersonalDetail(
    req: {
      body: {
        firstName: any;
        lastName: any;
        address: any;
        city: any;
        state: any;
        country: any;
        postalCode: any;
      };
    },
    res: any
  ) {
    try {
      const { firstName, lastName, address, city, state, country, postalCode } = req.body;
      const personalDetail = await PersonalDetail.create({
        firstName,
        lastName,
        address,
        city,
        state,
        country,
        postalCode,
      });
      sendCreated(res, { data: { personalDetail } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getPersonalDetail(req: any, res: any) {
    try {
      const personalDetail = await PersonalDetail.find();
      sendSuccess(res, { data: { personalDetail } });
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async getPersonalDetailById(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const personalDetail = await PersonalDetail.findById(id);
      if (!personalDetail) {
        sendNotFound(res, "Personal detail not found");
      } else {
        sendSuccess(res, { data: { personalDetail } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async updatePersonalDetail(
    req: {
      params: { id: any };
      body: {
        firstName: any;
        lastName: any;
        address: any;
        city: any;
        state: any;
        country: any;
        postalCode: any;
      };
    },
    res: any
  ) {
    try {
      const { id } = req.params;
      const { firstName, lastName, address, city, state, country, postalCode } = req.body;
      const personalDetail = await PersonalDetail.findById(id);

      if (!personalDetail) {
        sendNotFound(res, "Personal detail not found");
      } else {
        personalDetail.firstName = firstName;
        personalDetail.lastName = lastName;
        personalDetail.address = address;
        personalDetail.city = city;
        personalDetail.state = state;
        personalDetail.country = country;
        personalDetail.postalCode = postalCode;

        await personalDetail.save();
        sendSuccess(res, { data: { personalDetail } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }

  async deletePersonalDetail(req: { params: { id: any } }, res: any) {
    try {
      const { id } = req.params;
      const personalDetail = await PersonalDetail.findByIdAndDelete(id);

      if (!personalDetail) {
        sendNotFound(res, "Personal detail not found");
      } else {
        sendSuccess(res, { data: { personalDetail } });
      }
    } catch (error) {
      sendInternalError(res, error);
    }
  }
}