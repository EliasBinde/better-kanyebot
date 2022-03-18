import EventEmitter from "events";
import { Crawler } from "./crawler";
import { Wordlist } from "./wordlist";
import "./css/index.css";

const wordlist = new Wordlist().words;
const container = document.getElementById("result-container");
const current = document.getElementById("current");

(<HTMLInputElement>document.getElementById("limit")).value = "2";

let mails: string[] = [];

const crawler = new Crawler();

crawler.emailEvents.on("valid-found", (email) => {
  mails.push(email);
  container.innerHTML = "";
  mails.forEach((mail) => {
    console.log(mail);
  });
  let htmlString = "";

  let date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  const format = (num: number) => {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  };

  mails.map((mail) => {
    htmlString += `<div class="email"><div class="addr">${mail}<i class="fas fa-clipboard copy-icon" onclick="copy('${mail}')"></i></div><div class="time">Validated on ${format(
      day
    )}.${format(month)}.${format(year)} at ${format(h)}:${format(m)}:${format(
      s
    )} </div></div>`;
  });

  container.innerHTML = htmlString;
});

crawler.emailEvents.on("trying", (email) => {
  current.innerText = `Trying: ${email}`;
});

crawler.emailEvents.on("done", () => {
  document.getElementById("go-button").innerText = "Search";
  (<HTMLButtonElement>document.getElementById("go-button")).disabled = false;
  current.innerText = `Idle`;
});

const search = () => {
  let limit = parseInt(
    (<HTMLInputElement>document.getElementById("limit")).value
  );
  crawler.crawl(wordlist, limit);
};

document.getElementById("go-button").addEventListener("click", () => {
  container.innerHTML = "";
  mails = [];
  search();
  document.getElementById("go-button").innerText = "Searching...";
  (<HTMLButtonElement>document.getElementById("go-button")).disabled = true;
});
