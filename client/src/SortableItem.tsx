import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Item } from './types';

interface SortableItemProps {
  item: Item;
  onSelect: (value: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, onSelect }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="item">
      <input
        type="checkbox"
        checked={item.isSelected}
        onPointerDown={(e) => e.stopPropagation()}
        onChange={() => onSelect(item.value)}
      />
      {item.value}
    </div>
  );
};

export default SortableItem;
