module.exports = {
  sendSuccess: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: any): void; new (): any };
      };
    },
    payload: { message: any }
  ) => {
    res.status(200).send({
      status: "SUCCESS",
      code: 200,
      ...payload,
      message: payload.message || "Resource found.",
    });
  },
  sendCreated: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: any): void; new (): any };
      };
    },
    payload: { message: any }
  ) => {
    res.status(201).send({
      status: "SUCCESS",
      code: 201,
      ...payload,
      message: payload.message || "Data created..",
    });
  },
  sendNotFound: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: {
          (arg0: { status: string; code: number; message: any }): void;
          new (): any;
        };
      };
    },
    message: any
  ) => {
    res.status(404).send({
      status: "ERROR",
      code: 404,
      message: message || "Resource not found.",
    });
  },
  sendConflict: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: {
          (arg0: { status: string; code: number; message: any }): void;
          new (): any;
        };
      };
    },
    message: any
  ) => {
    res.status(409).send({
      status: "CONFLICT",
      code: 409,
      message: message || "There is a conflict.",
    });
  },
  sendInvalid: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: {
          (arg0: { status: string; code: number; message: any }): void;
          new (): any;
        };
      };
    },
    message: any
  ) => {
    res.status(422).send({
      status: "ERROR",
      code: 422,
      message: message || "Invalid attributes..",
    });
  },
  sendUnauthorized: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: {
          (arg0: { status: string; code: number; message: any }): void;
          new (): any;
        };
      };
    },
    message: any
  ) => {
    res.status(401).json({
      status: "ERROR",
      code: 401,
      message: message || "You are not authorized.",
    });
  },
  sendForbidden: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: {
          (arg0: { status: string; code: number; message: any }): void;
          new (): any;
        };
      };
    },
    message: any
  ) => {
    res.status(403).json({
      status: "ERROR",
      code: 403,
      message: message || "You don't have access to request this site.",
    });
  },
  sendInternalError: (
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: {
          (arg0: {
            status: string;
            code: number;
            message: string;
            errors: any;
          }): void;
          new (): any;
        };
      };
    },
    errors: any
  ) => {
    res.status(500).send({
      status: "ERROR",
      code: 500,
      message: "Something Error.",
      errors,
    });
  },
  sendError: (
    res: {
      status: (arg0: any) => {
        (): any;
        new (): any;
        json: {
          (arg0: { status: any; code: any; message: any; data: any }): void;
          new (): any;
        };
      };
    },
    code: any,
    payload: { status: any; message: any; data: any }
  ) => {
    res.status(code).json({
      status: payload?.status || "ERROR",
      code,
      message: payload.message || "Something failed.",
      data: payload?.data,
    });
  },
};
