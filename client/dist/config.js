// path 是一个关键字，不能更改
const SERVER_URL = {
  path: "http://localhost:8091",
};

sessionStorage.setItem("server_url", JSON.stringify(SERVER_URL));
