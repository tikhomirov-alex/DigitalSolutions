import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { Item } from './types';
import '../index.css';

const PAGE_SIZE = 20;

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const fetchItems = async (newOffset = 0) => {
    try {
      const response = await axios.get<Item[]>('/api/items', {
        params: {
          limit: PAGE_SIZE,
          offset: newOffset,
          search
        },
      });
      if (newOffset === 0) {
        setItems(response.data);
      } else {
        setItems((prevItems) => [...prevItems, ...response.data]);
      }
      setHasMore(response.data.length === PAGE_SIZE);
      setOffset(newOffset);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const handleSelect = async (value: number) => {
    try {
      await axios.post('/api/items/select', { selectedItem: value });
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.value === value ? { ...item, isSelected: !item.isSelected } : item
        )
      );
    } catch (error) {
      console.error('Error updating selection:', error);
    }
  };

  const handleSortEnd = async (sortedItems: Item[]) => {
    try {
      await axios.post('/api/items/sort', { sortedItems });
    } catch (error) {
      console.error('Error sorting items:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.value === Number(active.id));
        const newIndex = prevItems.findIndex((item) => item.value === Number(over.id));
        const newItems = arrayMove(prevItems, oldIndex, newIndex);

        const startIndex = Math.min(oldIndex, newIndex);
        const endIndex = Math.max(oldIndex, newIndex) + 1;
        handleSortEnd(newItems.slice(startIndex, endIndex));

        return newItems;
      });
    }
  };

  return (
    <div className="app">
      <input
        className="search-input"
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.value)} strategy={verticalListSortingStrategy}>
          <InfiniteScroll
            dataLength={items.length}
            next={() => fetchItems(offset + PAGE_SIZE)}
            hasMore={hasMore}
            loader={<h4>Загрузка...</h4>}
            endMessage={<p>Все элементы загружены</p>}
            scrollThreshold={0.99}
          >
            {items.map((item) => (
              <SortableItem key={item.value} item={item} onSelect={handleSelect} />
            ))}
          </InfiniteScroll>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default App;
