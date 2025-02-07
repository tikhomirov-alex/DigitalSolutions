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

const items: Item[] = Array.from({ length: 1000000 }, (_, i) => ({
    value: i + 1,
    isSelected: false,
    sortPosition: i + 1
}));

app.get('/api/items', (req: Request<{}, {}, {}, GetItemsRequest>, res: Response<Item[]>) => {
    const {
        limit = 20,
        offset = 0,
        search = ''
    } = req.query;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    let filteredItems = items.filter(item => item.value.toString().includes(search));

    const sortedItems = filteredItems.sort((a, b) => a.sortPosition - b.sortPosition);

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

    console.log(sortedItems);

    const positions = sortedItems.map(i => i.sortPosition).sort((a, b) => a - b);

    sortedItems.forEach((sortedItem, index) => {
        const originalItem = items.find(item => item.value === sortedItem.value);
        if (originalItem) {
            originalItem.sortPosition = positions[index];
        }
    });

    res.sendStatus(204);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App has been started on port ${port}`));