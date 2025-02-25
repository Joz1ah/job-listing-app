import * as API from "./api/"; 

const routes = (app: any): void => {
  app.post("/api/contact-us-send-email", API.contactUsSendEmail);
  app.get("/api/notifications/stream", API.sseNotifications);
};

export default routes;