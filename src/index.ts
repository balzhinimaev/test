import express, { Request, Response } from "express";
import { Pool } from "pg";
import { bubbleSort } from "./bubbleSort";
import { v4 as uuid } from "uuid";
import bodyParser from "body-parser";

const pool = new Pool({
  user: "someusername",
  password: "somepassword",
  database: "sort_results",
  host: "localhost",
  port: 5432,
});

const app = express();
app.use(bodyParser.json());

app.post(`/sort`, async (req: Request, res: Response): Promise<void> => {
  const { array } = req.body;

  // Тут надо прописать проверку на численный масив
  if (!Array.isArray(array)) {
    res.status(400).json({ message: `array должен быть массивом из чисел` });
    return;
  }

  const sortedArray = bubbleSort([...array]);
  const sortId = uuid();

  console.log({ sortedArray, sortId });

  try {

    for (let i = 0; i < sortedArray.length; i++) {
        await pool.query(`INSERT INTO sort_results (sort_id, element_order, value) VALUES ($1, $2, $3)`, [ sortId, i, sortedArray[i] ]);
    }

    res.json({
      sortedArray,
      sortId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка запроса' })
  }
});
app.get(`/sort/:id`, async (req, res) => {

    const sortId = req.params.id

    try {

        const result = await pool.query(`SELECT value FROM sort_results WHERE sort_id = $1 ORDER BY element_order`, [sortId])

        const sortedArray = result.rows.map((row) => row.value)

        res.json({ sortId, sortedArray })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Ошибка запроса' })
    }

});

app.use(express.static("public"));
app.listen(3000, () => {
  console.log(`Сервер работает на 3000`);
});
