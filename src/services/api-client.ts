import axios from "axios";

export default axios.create({
  baseURL: "https://api.themoviedb.org/3",

  headers: {
    accept: "application/json",
  },
  params: {
    key: "3f28313281343d9053bdd56420999f36",
    page: 1,
  },
});
