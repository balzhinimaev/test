"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const bubbleSort_1 = require("./bubbleSort");
const uuid_1 = require("uuid");
const body_parser_1 = __importDefault(require("body-parser"));
const pool = new pg_1.Pool({
    user: "someusername",
    password: "somepassword",
    database: "sort_results",
    host: "localhost",
    port: 5432,
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post(`/sort`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { array } = req.body;
    // Тут надо прописать проверку на численный масив
    if (!Array.isArray(array)) {
        res.status(400).json({ message: `array должен быть массивом из чисел` });
        return;
    }
    const sortedArray = (0, bubbleSort_1.bubbleSort)([...array]);
    const sortId = (0, uuid_1.v4)();
    console.log({ sortedArray, sortId });
    try {
        for (let i = 0; i < sortedArray.length; i++) {
            yield pool.query(`INSERT INTO sort_results (sort_id, element_order, value) VALUES ($1, $2, $3)`, [sortId, i, sortedArray[i]]);
        }
        res.json({
            sortedArray,
            sortId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка запроса' });
    }
}));
app.get(`/sort/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sortId = req.params.id;
    try {
        const result = yield pool.query(`SELECT value FROM sort_results WHERE sort_id = $1 ORDER BY element_order`, [sortId]);
        const sortedArray = result.rows.map((row) => row.value);
        res.json({ sortId, sortedArray });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка запроса' });
    }
}));
app.use(express_1.default.static("public"));
app.listen(3000, () => {
    console.log(`Сервер работает на 3000`);
});
