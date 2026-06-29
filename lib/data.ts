export interface Product {
  id: string;
  name: string;
  cat: string;
  img: string;
  meta: string;
  igi: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviews: number;
  stone: string;
  carat: string;
  cut: string;
  color: string;
  clarity: string;
  cert: string;
}

export const PRODUCTS: Product[] = [
  { id:'solitaire', name:'Aurora Solitaire Ring', cat:'Rings', img:'/products/solitaire.png',
    meta:'18k White Gold · 1.02ct', igi:'IGI · E/VS1 · 1.02ct', price:48500, rating:4.8, reviews:64,
    stone:'Lab Diamond', carat:'1.02ct', cut:'Excellent', color:'E', clarity:'VS1', cert:'LG-4827193' },
  { id:'ring', name:'Pavé Eternity Band', cat:'Rings', img:'/products/ring.png',
    meta:'18k Yellow Gold · 0.75ct tw', igi:'IGI · F/VS2', price:32900, rating:4.7, reviews:41,
    stone:'Lab Diamond', carat:'0.75ct tw', cut:'Very Good', color:'F', clarity:'VS2', cert:'LG-5519028' },
  { id:'necklace', name:'Azzurro Drop Necklace', cat:'Necklaces', img:'/products/necklace.png',
    meta:'18k White Gold · 0.50ct', igi:'IGI · D/VVS2', price:27400, rating:4.9, reviews:88,
    stone:'Lab Diamond', carat:'0.50ct', cut:'Excellent', color:'D', clarity:'VVS2', cert:'LG-3310744' },
  { id:'pendant', name:'Lume Pendant', cat:'Necklaces', img:'/products/pendant.png',
    meta:'Sterling Silver · 0.30ct', igi:'IGI · G/VS1', price:14900, rating:4.6, reviews:52,
    stone:'Lab Diamond', carat:'0.30ct', cut:'Very Good', color:'G', clarity:'VS1', cert:'LG-7782001' },
  { id:'earring', name:'Goccia Drop Earrings', cat:'Earrings', img:'/products/earring.png',
    meta:'18k Yellow Gold · 0.60ct tw', igi:'IGI · E/VS2', price:36200, salePrice:29900, rating:4.8, reviews:37,
    stone:'Lab Diamond', carat:'0.60ct tw', cut:'Excellent', color:'E', clarity:'VS2', cert:'LG-6640915' },
  { id:'bracelet', name:'Riviera Tennis Bracelet', cat:'Bracelets', img:'/products/bracelet.png',
    meta:'18k White Gold · 3.0ct tw', igi:'IGI · F/VS1', price:96000, rating:5.0, reviews:29,
    stone:'Lab Diamond', carat:'3.0ct tw', cut:'Excellent', color:'F', clarity:'VS1', cert:'LG-1209887' },
];

export const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings'];
export const WA_PHONE = '201000000000';
