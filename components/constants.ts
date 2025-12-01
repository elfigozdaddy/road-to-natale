
import React from 'react';
import { X, Circle, Check, Star } from "lucide-react";

export const VOTE_OPTIONS = [
  { value: 0, label: "Cattivo", color: "bg-red-500", icon: X, text: "text-red-500" },
  { value: 1, label: "Medio", color: "bg-yellow-400", icon: Circle, text: "text-yellow-500" },
  { value: 2, label: "Bravissimo", color: "bg-green-500", icon: Check, text: "text-green-500" },
  { value: 3, label: "Fantastico", color: "bg-blue-600", icon: Star, text: "text-blue-600", iconColor: "text-yellow-400" }, 
];

export const USERS = {
  'E': { name: 'E', code: 'alpha', colIndex: 0 },
  'M': { name: 'M', code: 'bravo', colIndex: 1 },
  'P': { name: 'P', code: 'charlie', colIndex: 2 },
};
