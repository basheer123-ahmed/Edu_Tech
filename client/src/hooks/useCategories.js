import { useState, useEffect } from 'react';

const DEFAULT_CATEGORIES = [
  "Web Development",
  "Artificial Intelligence",
  "Data Science",
  "Machine Learning",
  "Programming",
  "Cyber Security",
  "UI/UX Design",
  "Cloud Computing",
  "Mobile Development",
  "DevOps",
  "Blockchain",
];

const STORAGE_KEY = 'skilstation_categories';

export const useCategories = () => {
  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name) => {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
      return true;
    }
    return false;
  };

  const removeCategory = (name) => {
    setCategories(prev => prev.filter(c => c !== name));
  };

  const renameCategory = (oldName, newName) => {
    const trimmed = newName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories(prev => prev.map(c => c === oldName ? trimmed : c));
      return true;
    }
    return false;
  };

  return { categories, addCategory, removeCategory, renameCategory };
};
