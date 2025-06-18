"use client";

import React, { useState } from 'react';

// ========= TYPES =========
// การกำหนด Type สำหรับข้อมูลสินค้าด้วย TypeScript
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// ========= MOCK DATA =========
// ข้อมูลสินค้าตัวอย่างสำหรับเริ่มต้น
const initialProducts: Product[] = [
  { id: 1, name: 'คีย์บอร์ดไร้สาย', sku: 'KB-W-001', category: 'อุปกรณ์คอมพิวเตอร์', quantity: 75, price: 1250, status: 'In Stock' },
  { id: 2, name: 'เมาส์เกมมิ่ง RGB', sku: 'MS-G-003', category: 'อุปกรณ์คอมพิวเตอร์', quantity: 40, price: 990, status: 'In Stock' },
  { id: 3, name: 'จอ Monitor 24 นิ้ว', sku: 'MT-IPS-24', category: 'หน้าจอ', quantity: 8, price: 4500, status: 'Low Stock' },
  { id: 4, name: 'หูฟังบลูทูธ', sku: 'HP-BT-012', category: 'อุปกรณ์เสริม', quantity: 0, price: 1500, status: 'Out of Stock' },
  { id: 5, name: 'Webcam 1080p', sku: 'WC-HD-108', category: 'อุปกรณ์คอมพิวเตอร์', quantity: 25, price: 800, status: 'In Stock' },
  { id: 6, name: 'External Harddisk 1TB', sku: 'HD-EXT-1T', category: 'อุปกรณ์จัดเก็บข้อมูล', quantity: 50, price: 2100, status: 'In Stock' },
];


// ========= ICONS (SVG) =========
// ไอคอนในรูปแบบ SVG เพื่อไม่ต้องพึ่งพาไลบรารี่ภายนอก
const icons = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  products: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.5V9a2 2 0 0 0-2-2H4v11h16V7h-4a2 2 0 0 0-2 2v5.5"></path><line x1="10" y1="14" x2="14" y2="14"></line></svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.0l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.0l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  edit: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  trash: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
};


// ========= COMPONENTS =========

// --- Sidebar Component ---
const Sidebar = () => {
    const [active, setActive] = useState('Products');
    const navItems = [
        { name: 'Dashboard', icon: icons.dashboard },
        { name: 'Products', icon: icons.products },
        { name: 'Settings', icon: icons.settings },
    ];
    return (
        <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col">
            <div className="h-20 flex items-center justify-center border-b border-gray-800">
                <h1 className="text-2xl font-bold text-white">StockFlow</h1>
            </div>
            <nav className="flex-1 px-4 py-6">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name} className="mb-2">
                            <a href="#"
                               onClick={() => setActive(item.name)}
                               className={`flex items-center p-3 rounded-lg transition-colors ${
                                 active === item.name 
                                   ? 'bg-blue-600 text-white' 
                                   : 'hover:bg-gray-800'
                               }`}
                            >
                                <span className="mr-4">{item.icon}</span>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

// --- Header Component ---
const Header = ({ onAddProductClick }: { onAddProductClick: () => void }) => {
    return (
        <header className="h-20 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-8">
            <h2 className="text-2xl font-semibold text-white">Products Dashboard</h2>
            <div className="flex items-center gap-4">
                 <button 
                    onClick={onAddProductClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    {icons.plus}
                    เพิ่มสินค้า
                </button>
            </div>
        </header>
    );
};

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl flex items-center gap-6">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};


// --- Product Table Component ---
const ProductTable = ({ products, onEdit, onDelete }: { products: Product[], onEdit: (product: Product) => void, onDelete: (id: number) => void }) => {

    const getStatusChip = (status: Product['status']) => {
        switch (status) {
            case 'In Stock':
                return <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">พร้อมขาย</span>;
            case 'Low Stock':
                return <span className="bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full">ใกล้หมด</span>;
            case 'Out of Stock':
                return <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-2.5 py-1 rounded-full">สินค้าหมด</span>;
        }
    }

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-900/50 text-xs text-gray-400 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-4">ชื่อสินค้า</th>
                        <th scope="col" className="px-6 py-4">SKU</th>
                        <th scope="col" className="px-6 py-4">หมวดหมู่</th>
                        <th scope="col" className="px-6 py-4">จำนวน</th>
                        <th scope="col" className="px-6 py-4">ราคา</th>
                        <th scope="col" className="px-6 py-4">สถานะ</th>
                        <th scope="col" className="px-6 py-4">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                            <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                            <td className="px-6 py-4">{product.sku}</td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4">{product.quantity}</td>
                            <td className="px-6 py-4">฿{product.price.toLocaleString()}</td>
                            <td className="px-6 py-4">{getStatusChip(product.status)}</td>
                            <td className="px-6 py-4 flex items-center gap-3">
                                <button onClick={() => onEdit(product)} className="text-blue-400 hover:text-blue-300">{icons.edit}</button>
                                <button onClick={() => onDelete(product.id)} className="text-red-400 hover:text-red-300">{icons.trash}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Modal Component ---
const ProductModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    productToEdit 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onSave: (product: Omit<Product, 'id' | 'status'>) => void,
    productToEdit: Product | null
}) => {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);

    React.useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setSku(productToEdit.sku);
            setCategory(productToEdit.category);
            setQuantity(productToEdit.quantity);
            setPrice(productToEdit.price);
        } else {
            // Reset form when adding new product
            setName('');
            setSku('');
            setCategory('');
            setQuantity(0);
            setPrice(0);
        }
    }, [productToEdit, isOpen]);


    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, sku, category, quantity, price });
        onClose();
    };
    
    const inputStyle = "w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500";

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl w-full max-w-lg p-8">
                <h3 className="text-xl font-semibold text-white mb-6">{productToEdit ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">ชื่อสินค้า</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputStyle} required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">SKU</label>
                            <input type="text" value={sku} onChange={e => setSku(e.target.value)} className={inputStyle} required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-300">หมวดหมู่</label>
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} className={inputStyle} required />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">จำนวน</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={inputStyle} required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">ราคา</label>
                            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className={inputStyle} required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">ยกเลิก</button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// ========= MAIN APP COMPONENT =========
export default function App() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const handleAddProductClick = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (id: number) => {
        // ในโปรเจกต์จริงควรมีการยืนยันก่อนลบ
        setProducts(products.filter(p => p.id !== id));
    };

    const handleSaveProduct = (productData: Omit<Product, 'id' | 'status'>) => {
        const getStatus = (quantity: number): Product['status'] => {
            if (quantity === 0) return 'Out of Stock';
            if (quantity <= 10) return 'Low Stock';
            return 'In Stock';
        };

        if (productToEdit) {
            // Update existing product
            setProducts(products.map(p => 
                p.id === productToEdit.id 
                ? { ...productToEdit, ...productData, status: getStatus(productData.quantity) } 
                : p
            ));
        } else {
            // Add new product
            const newProduct: Product = {
                id: Math.max(...products.map(p => p.id), 0) + 1, // Simple ID generation
                ...productData,
                status: getStatus(productData.quantity),
            };
            setProducts([...products, newProduct]);
        }
        setIsModalOpen(false);
        setProductToEdit(null);
    };

    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.status === 'Low Stock').length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return (
        <div className="bg-gray-900 h-screen w-full flex font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header onAddProductClick={handleAddProductClick} />
                <div className="flex-1 p-8 overflow-y-auto bg-gray-800/20">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <StatCard 
                            title="สินค้าทั้งหมด"
                            value={totalProducts}
                            icon={icons.products}
                            color="bg-blue-500/30"
                        />
                        <StatCard 
                            title="มูลค่ารวม"
                            value={`฿${totalValue.toLocaleString()}`}
                            icon={<span className="text-2xl font-bold">฿</span>}
                             color="bg-green-500/30"
                        />
                         <StatCard 
                            title="สินค้าใกล้หมด"
                            value={lowStockItems}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path></svg>}
                             color="bg-yellow-500/30"
                        />
                    </div>
                    
                    {/* Product Table */}
                    <ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />
                </div>
            </main>
            
            <ProductModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
        </div>
    );
}
