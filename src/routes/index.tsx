import Casts from "./public/casts";
import Home from "./public/home";
import Login from "./public/login";
import { MovieDetail, MovieGallery } from "./public/movies";
import Register from "./public/register";

import Profile from "./private/profile";
import ResetPassword from "./public/reset-password";

export default {
  public: [
    Home,
    Login,
    Register,
    MovieGallery,
    MovieDetail,
    Casts,
    ResetPassword
  ],
  private: [
    Profile
  ]
};

