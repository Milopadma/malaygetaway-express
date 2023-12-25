// import { FilesController } from "../api/files/files.controller";
// import { saveFiles } from "../helpers/utils";
// import { sendFiles } from "../helpers/utils";
// import { sendInternalError, sendSuccess } from "../helpers/responses";

// test("FilesController", () => {
//   let filesController: FilesController;

//   beforeEach(() => {
//     filesController = new FilesController();
//   });

//   it("should upload files successfully", async () => {
//     const mockReq = { files: [{ originalname: "test.jpg" }] };
//     const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

//     await filesController.uploadFiles(mockReq, mockRes);

//     expect(mockRes.json).toHaveBeenCalledWith({
//       message: "Files uploaded successfully",
//     });
//   });
// });
