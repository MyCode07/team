import "./parts/slider.js";
import "./parts/menu.js";
import "./parts/form.js";
import { animations } from "./parts/adnimation.js";
import { maskInputs } from "./static/inputmask.js";

animations()

maskInputs('+7 (999) 999-99-99', '._mask-phone')