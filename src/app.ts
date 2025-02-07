import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GetItemsRequest, Item, SelectItemsRequest, SortItemsRequest } from 'types';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

const items: Item[] = Array.from({ length: 100 }, (_, i) => ({
    value: i + 1,
    isSelected: false,
    sortPosition: i + 1,
    sortOffset: 0
}));

app.get('/api/items', (req: Request<{}, {}, {}, GetItemsRequest>, res: Response<Item[]>) => {
    const {
        limit = 20,
        offset = 0,
        search = ''
    } = req.query;

    // Преобразование параметров в числа
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    // Фильтрация по поисковому запросу
    let filteredItems = items.filter(item => item.value.toString().includes(search));

    // Сортировка
    const sortedItems = filteredItems.sort((a, b) => (a.sortPosition + a.sortOffset) - (b.sortPosition + b.sortOffset));

    // Пагинация
    const paginatedItems = sortedItems.slice(parsedOffset, parsedOffset + parsedLimit);

    res.json(paginatedItems);
});

app.post('/api/items/select', (req: Request<{}, {}, SelectItemsRequest>, res: Response) => {
    const { selectedItem } = req.body;

    const item = items.find(item => item.value === selectedItem);

    if (item) {
        item.isSelected = !item.isSelected;
    }

    res.sendStatus(204);
});

app.post('/api/items/sort', (req: Request<{}, {}, SortItemsRequest>, res: Response) => {
    const { sortedItems } = req.body;

    sortedItems.forEach((value, index) => {
        const item = items.find(item => item.value === value);
        if (item) {
            item.sortPosition = index;
        }
    });
    res.sendStatus(204);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App has been started on port ${port}`));