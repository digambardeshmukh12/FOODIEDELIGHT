export interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  images?: string[];
  menu?: MenuItem[];  
  rating?: number;
}

export interface MenuItem {
  item: string;
  rate: number;
}
