import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container py-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
