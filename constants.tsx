
import React from 'react';
import { LayoutDashboard, Coffee, Palmtree, Waves, Utensils, LogOut, Clock, Users } from 'lucide-react';
import { Product, MenuData, Guest } from './types.ts';

// High-fidelity SVG Logo Component - Centralized to avoid bugs
export const SamoaLogo = ({ className = "w-full h-full" }: { className?: string }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 150C200 150 230 110 270 110C310 110 330 140 330 140C330 140 290 170 250 170C210 170 200 150 200 150Z" fill="#7d8c6d"/>
    <path d="M200 150C200 150 170 110 130 110C90 110 70 140 70 140C70 140 110 170 150 170C190 170 200 150 200 150Z" fill="#7d8c6d"/>
    <path d="M200 250C200 250 230 290 270 290C310 290 330 260 330 260C330 260 290 230 250 230C210 230 200 250 200 250Z" fill="#7d8c6d"/>
    <path d="M200 250C200 250 170 290 130 290C90 290 70 260 70 260C70 260 110 230 150 230C190 230 200 250 200 250Z" fill="#7d8c6d"/>
    <path d="M165 200C165 200 125 230 125 270C125 310 155 330 155 330C155 330 185 290 185 250C185 210 165 200 165 200Z" fill="#7d8c6d"/>
    <path d="M165 200C165 200 125 170 125 130C125 90 155 70 155 70C155 70 185 110 185 150C185 190 165 200 165 200Z" fill="#7d8c6d"/>
    <path d="M235 200C235 200 275 230 275 270C275 310 245 330 245 330C245 330 215 290 215 250C215 210 235 200 235 200Z" fill="#7d8c6d"/>
    <path d="M235 200C235 200 275 170 275 130C275 90 245 70 245 70C245 70 215 110 215 150C215 190 235 200 235 200Z" fill="#7d8c6d"/>
    <rect x="180" y="198" width="40" height="4" rx="2" fill="#7d8c6d" transform="rotate(45 200 200)"/>
    <rect x="180" y="198" width="40" height="4" rx="2" fill="#7d8c6d" transform="rotate(-45 200 200)"/>
  </svg>
);

export const NAVIGATION = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'LOBBY BAR', label: 'Lobby Bar', icon: <Coffee size={20} /> },
  { id: 'BAR PRAIA', label: 'Bar Praia', icon: <Palmtree size={20} /> },
  { id: 'PUKA PUKA', label: 'Puka Puka', icon: <Waves size={20} /> },
  { id: 'RESTAURANTE', label: 'Restaurante', icon: <Utensils size={20} /> },
  { id: 'HISTORY', label: 'Histórico', icon: <Clock size={20} /> },
  { id: 'ROOMS', label: 'Quartos/Hóspedes', icon: <Users size={20} /> },
  { id: 'LOGOUT', label: 'Sair', icon: <LogOut size={20} /> },
];

export const GUEST_DATA: Guest[] = [
  { room: '101', name: 'Carlos Alberto Silva', status: 'Checked-in' },
  { room: '102', name: 'Mariana Oliveira', status: 'VIP' },
  { room: '204', name: 'John Doe', status: 'Checked-in' },
  { room: '312', name: 'Fernanda Lima', status: 'Check-out Today' },
  { room: '405', name: 'Roberto Carlos', status: 'VIP' },
  { room: '501', name: 'Amanda Souza', status: 'Checked-in' },
];

export const MENU_DATA: MenuData = {
  'LOBBY BAR': [
    { id: 'lb1', name: 'Café Expresso', price: 8.00, category: 'Cafés', stock: 50 },
    { id: 'lb2', name: 'Cappuccino', price: 12.00, category: 'Cafés', stock: 30 },
    { id: 'lb3', name: 'Latte', price: 11.00, category: 'Cafés', stock: 25 },
    { id: 'lb4', name: 'Água com Gás', price: 6.00, category: 'Bebidas', stock: 100 },
    { id: 'lb5', name: 'Refrigerante', price: 7.00, category: 'Bebidas', stock: 80 },
    { id: 'lb6', name: 'Whisky 12 anos', price: 35.00, category: 'Drinks', stock: 12 },
    { id: 'lb7', name: 'Gin Tônica', price: 28.00, category: 'Drinks', stock: 20 },
    { id: 'lb8', name: 'Mojito', price: 24.00, category: 'Drinks', stock: 15 },
    { id: 'lb9', name: 'Aperol Spritz', price: 32.00, category: 'Drinks', stock: 10 },
    { id: 'lb10', name: 'Caipirinha', price: 22.00, category: 'Drinks', stock: 40 },
  ],
  'BAR PRAIA': [
    { id: 'bp1', name: 'Água de Coco', price: 12.00, category: 'Bebidas', stock: 40 },
    { id: 'bp2', name: 'Cerveja Long Neck', price: 15.00, category: 'Bebidas', stock: 120 },
    { id: 'bp3', name: 'Caipiroska', price: 26.00, category: 'Drinks', stock: 30 },
    { id: 'bp4', name: 'Piña Colada', price: 28.00, category: 'Drinks', stock: 20 },
    { id: 'bp5', name: 'Margarita', price: 30.00, category: 'Drinks', stock: 15 },
    { id: 'bp6', name: 'Batata Frita', price: 35.00, category: 'Petiscos', stock: 50 },
    { id: 'bp7', name: 'Hambúrguer Gourmet', price: 42.00, category: 'Lanches', stock: 25 },
    { id: 'bp8', name: 'Isca de Peixe', price: 58.00, category: 'Petiscos', stock: 18 },
  ],
  'PUKA PUKA': [
    { id: 'pp1', name: 'Smoothie Frutas', price: 22.00, category: 'Bebidas', stock: 20 },
    { id: 'pp5', name: 'Gin Tropical', price: 34.00, category: 'Drinks', stock: 15 },
    { id: 'pp8', name: 'Açaí Completo', price: 25.00, category: 'Comida', stock: 30 },
    { id: 'pp9', name: 'Salada Caesar', price: 45.00, category: 'Comida', stock: 12 },
  ],
  'RESTAURANTE': [
    { id: 'r1', name: 'Carpaccio de Filé', price: 48.00, category: 'Entradas', stock: 15 },
    { id: 'r3', name: 'Peixe Grelhado', price: 78.00, category: 'Pratos', stock: 10 },
    { id: 'r4', name: 'Filé Mignon ao Molho', price: 92.00, category: 'Pratos', stock: 8 },
  ]
};

// Safe Storage Helper
export const safeStorage = {
  get: (key: string, defaultValue: any) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage Error", e);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};
