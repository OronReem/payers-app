import { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BillContext = createContext();

export const BillProvider = ({ children }) => {
  // Global State
  const [items, setItems] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [globalTipPercent, setGlobalTipPercent] = useState(0);

  const [imagePreview, setImagePreview] = useState(null);

  // Available vibrant colors for participants (strictly vivid HTML Hex codes to avoid black/white/gray and Tailwind pruning)
  const availableColors = [
    { hex: '#3b82f6', name: 'Blue' },
    { hex: '#eab308', name: 'Yellow' },
    { hex: '#22c55e', name: 'Green' },
    { hex: '#ef4444', name: 'Red' },
    { hex: '#a855f7', name: 'Purple' },
    { hex: '#f97316', name: 'Orange' },
    { hex: '#ec4899', name: 'Pink' },
    { hex: '#14b8a6', name: 'Teal' },
    { hex: '#6366f1', name: 'Indigo' }
  ];

  // Action to set initial items from OCR
  const loadParsedItems = (parsedItems) => {
    setItems(parsedItems.map(item => ({ ...item, assignedTo: [] })));
  };

  // Generate participants by count
  const generateParticipants = (count) => {
    const newParticipants = [];
    for(let i = 0; i < count; i++) {
      const pColor = availableColors[i % availableColors.length];
      newParticipants.push({
        id: uuidv4(),
        name: pColor.name,
        color: pColor.hex
      });
    }
    setParticipants(newParticipants);
    // Reset item assignments when newly generating
    setItems(items.map(item => ({ ...item, assignedTo: [] })));
  };

  // Add a participant
  const addParticipant = (name) => {
    const pColor = availableColors[participants.length % availableColors.length];
    setParticipants([...participants, { id: uuidv4(), name: name || pColor.name, color: pColor.hex }]);
  };

  const updateParticipant = (id, newName) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  // Assign participant to an item
  const toggleItemAssignment = (itemId, participantId) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const assignedTo = item.assignedTo.includes(participantId)
          ? item.assignedTo.filter(id => id !== participantId)
          : [...item.assignedTo, participantId];
        return { ...item, assignedTo };
      }
      return item;
    }));
  };

  // Modify item (Price, Qty, Name)
  const updateItem = (itemId, updates) => {
    setItems(items.map(item => item.id === itemId ? { ...item, ...updates } : item));
  };

  const addItem = (item) => {
    setItems([...items, { ...item, id: uuidv4(), assignedTo: [] }]);
  };

  const resetSession = () => {
    setParticipants([]);
    setGlobalTipPercent(0);
    setItems([]);
    setImagePreview(null);
  };

  return (
    <BillContext.Provider
      value={{
        items,
        setItems,
        participants,
        globalTipPercent,
        imagePreview,
        setImagePreview,
        setGlobalTipPercent,
        loadParsedItems,
        generateParticipants,
        addParticipant,
        updateParticipant,
        toggleItemAssignment,
        updateItem,
        addItem,
        resetSession
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => useContext(BillContext);
