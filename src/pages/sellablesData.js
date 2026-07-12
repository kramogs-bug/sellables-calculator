import { sellablesIcons } from '../assets/assets.js';

export const SELLABLE_CATEGORIES = [
  { key: 'shells', label: 'Shells', items: [
    { name: 'Tro', price: 3, icon: sellablesIcons.tro }, { name: 'Aero', price: 3, icon: sellablesIcons.aero },
    { name: 'Sand Dollar', price: 5, icon: sellablesIcons.sandDollar }, { name: 'Scallop', price: 5, icon: sellablesIcons.scallop },
    { name: 'Starfish', price: 7, icon: sellablesIcons.star },
  ]},
  { key: 'mushrooms', label: 'Mushrooms', items: [{ name: 'Mushroom', price: 5, icon: sellablesIcons.mushrooms }] },
  { key: 'trash', label: 'Trash items', items: [
    { name: 'Bottle', price: 5, icon: sellablesIcons.bottle }, { name: 'Paper', price: 4, icon: sellablesIcons.paper },
    { name: 'Newspaper', price: 4, icon: sellablesIcons.news }, { name: 'Tires', price: 6, icon: sellablesIcons.tires },
  ]},
  { key: 'crabshells', label: 'Crab shells', items: [{ name: 'Crab Shell', price: 6, icon: sellablesIcons.crabshell }] },
  { key: 'minerals', label: 'Minerals', items: [{ name: 'Mineral', price: 5, icon: sellablesIcons.mineral }] },
  { key: 'rareminerals', label: 'Rare minerals', items: [
    { name: 'Gold', price: 10, icon: sellablesIcons.gold }, { name: 'Diamond', price: 10, icon: sellablesIcons.diamond },
    { name: 'Emerald', price: 8, icon: sellablesIcons.emerald }, { name: 'Ruby', price: 7, icon: sellablesIcons.ruby },
    { name: 'Sapphire', price: 7, icon: sellablesIcons.sapphire },
  ]},
  { key: 'flowers', label: 'Flowers', items: [
    { name: 'Mum', price: 0.3, icon: sellablesIcons.mum }, { name: 'Tulip', price: 0.4, icon: sellablesIcons.tulip },
    { name: 'Carnation', price: 0.5, icon: sellablesIcons.carnation }, { name: 'Aster', price: 0.6, icon: sellablesIcons.aster },
    { name: 'Rose', price: 0.7, icon: sellablesIcons.rose },
  ]},
];

export const SELLABLE_ITEMS = SELLABLE_CATEGORIES.flatMap((category) => category.items);
export const SELLABLE_BY_NAME = new Map(SELLABLE_ITEMS.map((item) => [item.name, item]));
