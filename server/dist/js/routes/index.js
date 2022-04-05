"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../controllers/partners/index");
const router = (0, express_1.Router)();
router.get("/getall", index_1.getPartners);
router.post("/range", index_1.fetchPartnersWithInKmRange);
exports.default = router;
